"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _clients3 = require("@aws-sdk/client-s3");
const _s3requestpresigner = require("@aws-sdk/s3-request-presigner");
const _stream = require("stream");
const _s3driver = require("../s3.driver");
const mockS3Send = jest.fn();
jest.mock('@aws-sdk/client-s3', ()=>{
    const actual = jest.requireActual('@aws-sdk/client-s3');
    return {
        ...actual,
        S3: jest.fn().mockImplementation(()=>({
                send: mockS3Send
            }))
    };
});
jest.mock('@aws-sdk/s3-request-presigner', ()=>({
        getSignedUrl: jest.fn()
    }));
describe('S3Driver.readFile', ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('should request only the specified byte range', async ()=>{
        mockS3Send.mockResolvedValue({
            Body: _stream.Readable.from([
                Buffer.from('requested bytes')
            ])
        });
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1'
        });
        await driver.readFile({
            filePath: 'recordings/video.mp4',
            byteRange: {
                startByte: 100,
                endByte: 199
            }
        });
        expect(mockS3Send).toHaveBeenCalledTimes(1);
        expect(mockS3Send).toHaveBeenCalledWith(expect.objectContaining({
            input: expect.objectContaining({
                Bucket: 'test-bucket',
                Key: 'recordings/video.mp4',
                Range: 'bytes=100-199'
            })
        }));
    });
});
describe('S3Driver.getPresignedUrl', ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('should return null when presigning is not enabled', async ()=>{
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1',
            endpoint: 'http://localhost:9000'
        });
        const result = await driver.getPresignedUrl({
            filePath: 'some/file.png'
        });
        expect(result).toBeNull();
        expect(_s3requestpresigner.getSignedUrl).not.toHaveBeenCalled();
    });
    it('should presign with the main client when enabled without endpoint override', async ()=>{
        _s3requestpresigner.getSignedUrl.mockResolvedValue('https://s3.us-east-1.amazonaws.com/test-bucket/file.png?X-Amz-Signature=abc');
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1',
            presignEnabled: true
        });
        const result = await driver.getPresignedUrl({
            filePath: 'file.png',
            responseContentType: 'image/png',
            responseContentDisposition: 'inline',
            responseCacheControl: 'private, max-age=86400, immutable'
        });
        expect(result).toBe('https://s3.us-east-1.amazonaws.com/test-bucket/file.png?X-Amz-Signature=abc');
        expect(_s3requestpresigner.getSignedUrl).toHaveBeenCalledWith(expect.anything(), expect.any(_clients3.GetObjectCommand), {
            expiresIn: 900
        });
        const command = _s3requestpresigner.getSignedUrl.mock.calls[0][1];
        expect(command.input.ResponseCacheControl).toBe('private, max-age=86400, immutable');
    });
    it('should presign with a separate client when endpoint override is provided', async ()=>{
        _s3requestpresigner.getSignedUrl.mockResolvedValue('https://public.s3.com/test-bucket/some/file.png?X-Amz-Signature=abc');
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1',
            endpoint: 'http://internal-minio:9000',
            presignEnabled: true,
            presignEndpoint: 'https://public.s3.com'
        });
        const result = await driver.getPresignedUrl({
            filePath: 'some/file.png',
            responseContentType: 'image/png',
            responseContentDisposition: 'inline'
        });
        expect(result).toBe('https://public.s3.com/test-bucket/some/file.png?X-Amz-Signature=abc');
        expect(_s3requestpresigner.getSignedUrl).toHaveBeenCalledWith(expect.anything(), expect.any(_clients3.GetObjectCommand), {
            expiresIn: 900
        });
    });
    it('should use custom expiry when provided', async ()=>{
        _s3requestpresigner.getSignedUrl.mockResolvedValue('https://signed.url');
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1',
            presignEnabled: true
        });
        await driver.getPresignedUrl({
            filePath: 'file.txt',
            expiresInSeconds: 3600
        });
        expect(_s3requestpresigner.getSignedUrl).toHaveBeenCalledWith(expect.anything(), expect.any(_clients3.GetObjectCommand), {
            expiresIn: 3600
        });
    });
});
describe('S3Driver.getPresignedUploadUrl', ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    });
    it('should return null when presigning is not enabled', async ()=>{
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1'
        });
        const result = await driver.getPresignedUploadUrl({
            filePath: 'some/file.pdf',
            contentType: 'application/pdf',
            contentLength: 1024
        });
        expect(result).toBeNull();
        expect(_s3requestpresigner.getSignedUrl).not.toHaveBeenCalled();
    });
    it('should presign a PUT with content-type and content-length in the signature', async ()=>{
        _s3requestpresigner.getSignedUrl.mockResolvedValue('https://s3.us-east-1.amazonaws.com/test-bucket/some/file.pdf?X-Amz-Signature=abc');
        const driver = new _s3driver.S3Driver({
            bucketName: 'test-bucket',
            region: 'us-east-1',
            presignEnabled: true
        });
        const result = await driver.getPresignedUploadUrl({
            filePath: 'some/file.pdf',
            contentType: 'application/pdf',
            contentLength: 1024,
            expiresInSeconds: 900
        });
        expect(result).toBe('https://s3.us-east-1.amazonaws.com/test-bucket/some/file.pdf?X-Amz-Signature=abc');
        expect(_s3requestpresigner.getSignedUrl).toHaveBeenCalledWith(expect.anything(), expect.any(_clients3.PutObjectCommand), {
            expiresIn: 900,
            signableHeaders: new Set([
                'content-type',
                'content-length'
            ])
        });
        const command = _s3requestpresigner.getSignedUrl.mock.calls[0][1];
        expect(command.input).toMatchObject({
            Bucket: 'test-bucket',
            Key: 'some/file.pdf',
            ContentType: 'application/pdf',
            ContentLength: 1024
        });
    });
});

//# sourceMappingURL=s3.driver.spec.js.map