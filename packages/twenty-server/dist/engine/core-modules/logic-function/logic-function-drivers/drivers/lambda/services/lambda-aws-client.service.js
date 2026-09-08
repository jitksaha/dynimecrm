"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LambdaAwsClientService", {
    enumerable: true,
    get: function() {
        return LambdaAwsClientService;
    }
});
const _clientlambda = require("@aws-sdk/client-lambda");
const _clients3 = require("@aws-sdk/client-s3");
const _clientsts = require("@aws-sdk/client-sts");
const _s3requestpresigner = require("@aws-sdk/s3-request-presigner");
const _utils = require("twenty-shared/utils");
const _lambdadriverconstant = require("../constants/lambda-driver.constant");
const _awsrequesthandlerutil = require("../../../../../../../utils/aws-request-handler.util");
let LambdaAwsClientService = class LambdaAwsClientService {
    async getLambdaClient() {
        if (!(0, _utils.isDefined)(this.lambdaClient) || (0, _utils.isDefined)(this.options.subhostingRole) && this.areAssumeRoleCredentialsExpired()) {
            this.lambdaClient = new _clientlambda.Lambda({
                ...this.options,
                ...(0, _utils.isDefined)(this.options.subhostingRole) && {
                    credentials: await this.getAssumeRoleCredentials()
                },
                maxAttempts: _lambdadriverconstant.LAMBDA_CLIENT_MAX_ATTEMPTS,
                retryMode: _lambdadriverconstant.LAMBDA_CLIENT_RETRY_MODE,
                requestHandler: (0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)({
                    requestTimeoutMs: _lambdadriverconstant.LAMBDA_CLIENT_REQUEST_TIMEOUT_MS,
                    connectionTimeoutMs: _lambdadriverconstant.LAMBDA_CLIENT_CONNECTION_TIMEOUT_MS,
                    maxSockets: _lambdadriverconstant.LAMBDA_CLIENT_MAX_SOCKETS
                })
            });
        }
        return this.lambdaClient;
    }
    async getS3Client() {
        if (!(0, _utils.isDefined)(this.s3Client) || (0, _utils.isDefined)(this.options.subhostingRole) && this.areAssumeRoleCredentialsExpired()) {
            this.s3Client = new _clients3.S3Client({
                region: this.options.layerBucketRegion,
                credentials: (0, _utils.isDefined)(this.options.subhostingRole) ? await this.getAssumeRoleCredentials() : this.options.credentials,
                requestHandler: (0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)()
            });
        }
        return this.s3Client;
    }
    async generatePresignedUploadUrl(s3Key, expiresIn = 300) {
        const s3Client = await this.getS3Client();
        const putCommand = new _clients3.PutObjectCommand({
            Bucket: this.options.layerBucket,
            Key: s3Key,
            ContentType: 'application/zip'
        });
        return (0, _s3requestpresigner.getSignedUrl)(s3Client, putCommand, {
            expiresIn
        });
    }
    async waitFunctionActive(functionName, maxWaitTime = _lambdadriverconstant.UPDATE_FUNCTION_DURATION_TIMEOUT_IN_SECONDS) {
        await (0, _clientlambda.waitUntilFunctionActiveV2)({
            client: await this.getLambdaClient(),
            maxWaitTime
        }, {
            FunctionName: functionName
        });
    }
    async waitFunctionUpdated(functionName, maxWaitTime = _lambdadriverconstant.UPDATE_FUNCTION_DURATION_TIMEOUT_IN_SECONDS) {
        await (0, _clientlambda.waitUntilFunctionUpdatedV2)({
            client: await this.getLambdaClient(),
            maxWaitTime
        }, {
            FunctionName: functionName
        });
    }
    async getExistingLayerArn(layerName) {
        const lambdaClient = await this.getLambdaClient();
        const listLayerResult = await lambdaClient.send(new _clientlambda.ListLayerVersionsCommand({
            LayerName: layerName,
            MaxItems: 1
        }));
        return listLayerResult.LayerVersions?.[0]?.LayerVersionArn;
    }
    areAssumeRoleCredentialsExpired() {
        return !(0, _utils.isDefined)(this.assumeRoleCredentials) || (0, _utils.isDefined)(this.credentialsExpiry) && new Date() >= this.credentialsExpiry;
    }
    async refreshAssumeRoleCredentials() {
        this.stsClient ??= new _clientsts.STSClient({
            region: this.options.region,
            requestHandler: (0, _awsrequesthandlerutil.buildAwsRequestHandlerOptions)()
        });
        const stsClient = this.stsClient;
        const assumeRoleCommand = new _clientsts.AssumeRoleCommand({
            RoleArn: this.options.subhostingRole,
            RoleSessionName: 'LambdaSession',
            DurationSeconds: _lambdadriverconstant.CREDENTIALS_DURATION_IN_SECONDS
        });
        const { Credentials } = await stsClient.send(assumeRoleCommand);
        if (!(0, _utils.isDefined)(Credentials) || !(0, _utils.isDefined)(Credentials.AccessKeyId) || !(0, _utils.isDefined)(Credentials.SecretAccessKey) || !(0, _utils.isDefined)(Credentials.SessionToken)) {
            throw new Error('Failed to assume role');
        }
        this.assumeRoleCredentials = {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken
        };
        this.credentialsExpiry = new Date(Date.now() + (_lambdadriverconstant.CREDENTIALS_DURATION_IN_SECONDS - 60 * 5) * 1000);
        this.lambdaClient = undefined;
        this.s3Client = undefined;
    }
    async getAssumeRoleCredentials() {
        if (this.areAssumeRoleCredentialsExpired()) {
            await this.refreshAssumeRoleCredentials();
        }
        return this.assumeRoleCredentials;
    }
    constructor(options){
        this.options = options;
        this.credentialsExpiry = null;
    }
};

//# sourceMappingURL=lambda-aws-client.service.js.map