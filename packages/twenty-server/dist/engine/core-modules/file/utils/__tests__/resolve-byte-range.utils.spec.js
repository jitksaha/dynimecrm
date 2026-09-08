"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolvebyterangeutils = require("../resolve-byte-range.utils");
describe('resolveByteRange', ()=>{
    it('should return full when no range header is present', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: undefined,
            fileSizeInBytes: 100
        })).toEqual({
            type: 'full'
        });
    });
    it.each([
        'bits=0-10',
        'bytes=0-10,20-30',
        'bytes=abc-def',
        'bytes=-'
    ])('should return full for malformed or multi-range header %s', (rangeHeader)=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader,
            fileSizeInBytes: 100
        })).toEqual({
            type: 'full'
        });
    });
    it('should resolve an open-ended range from the start byte', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=0-',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'partial',
            byteRange: {
                startByte: 0,
                endByte: 99
            }
        });
    });
    it('should resolve a bounded range', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=10-19',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'partial',
            byteRange: {
                startByte: 10,
                endByte: 19
            }
        });
    });
    it.each([
        'Bytes=10-19',
        'BYTES=10-19'
    ])('should match the byte range unit case-insensitively for %s', (rangeHeader)=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader,
            fileSizeInBytes: 100
        })).toEqual({
            type: 'partial',
            byteRange: {
                startByte: 10,
                endByte: 19
            }
        });
    });
    it('should clamp the end byte to the file size', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=90-1000',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'partial',
            byteRange: {
                startByte: 90,
                endByte: 99
            }
        });
    });
    it('should resolve a suffix range to the last bytes of the file', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=-30',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'partial',
            byteRange: {
                startByte: 70,
                endByte: 99
            }
        });
    });
    it('should clamp a suffix range longer than the file to the whole file', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=-500',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'partial',
            byteRange: {
                startByte: 0,
                endByte: 99
            }
        });
    });
    it('should return unsatisfiable when the start byte is past the file end', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=100-',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'unsatisfiable'
        });
    });
    it('should return unsatisfiable for a zero-length suffix', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=-0',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'unsatisfiable'
        });
    });
    it('should return unsatisfiable for any range on an empty file', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=0-',
            fileSizeInBytes: 0
        })).toEqual({
            type: 'unsatisfiable'
        });
    });
    it('should return full when the end byte precedes the start byte', ()=>{
        expect((0, _resolvebyterangeutils.resolveByteRange)({
            rangeHeader: 'bytes=20-10',
            fileSizeInBytes: 100
        })).toEqual({
            type: 'full'
        });
    });
});

//# sourceMappingURL=resolve-byte-range.utils.spec.js.map