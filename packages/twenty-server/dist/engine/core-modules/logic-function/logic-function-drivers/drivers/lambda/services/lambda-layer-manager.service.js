"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LambdaLayerManagerService", {
    enumerable: true,
    get: function() {
        return LambdaLayerManagerService;
    }
});
const _promises = /*#__PURE__*/ _interop_require_wildcard(require("node:fs/promises"));
const _clientlambda = require("@aws-sdk/client-lambda");
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _lambdadriverconstant = require("../constants/lambda-driver.constant");
const _getlambdadepslayernameutil = require("../utils/get-lambda-deps-layer-name.util");
const _getlambdasdklayernameutil = require("../utils/get-lambda-sdk-layer-name.util");
const _reprefixlambdazipentriesutil = require("../utils/reprefix-lambda-zip-entries.util");
const _temporarydirmanager = require("../../../utils/temporary-dir-manager");
const _logicfunctionentity = require("../../../../../../metadata-modules/logic-function/logic-function.entity");
const _logicfunctionexception = require("../../../../../../metadata-modules/logic-function/logic-function.exception");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
let LambdaLayerManagerService = class LambdaLayerManagerService {
    async ensureDepsLayer(context) {
        const layerName = (0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication: context.flatApplication,
            namespace: this.options.resourceNamespace
        });
        const existingArn = await this.awsClient.getExistingLayerArn(layerName);
        if ((0, _utils.isDefined)(existingArn)) {
            return existingArn;
        }
        await this.createDepsLayer({
            ...context,
            layerName
        });
        const newArn = await this.awsClient.getExistingLayerArn(layerName);
        if (!(0, _utils.isDefined)(newArn)) {
            throw new Error(`Layer '${layerName}' was not created by the yarn install Lambda`);
        }
        return newArn;
    }
    async ensureSdkLayer(context) {
        const { flatApplication, applicationUniversalIdentifier } = context;
        const layerName = (0, _getlambdasdklayernameutil.getLambdaSdkLayerName)({
            workspaceId: flatApplication.workspaceId,
            applicationUniversalIdentifier
        });
        if (!flatApplication.isSdkLayerStale) {
            const existingArn = await this.awsClient.getExistingLayerArn(layerName);
            if ((0, _utils.isDefined)(existingArn)) {
                return existingArn;
            }
        }
        await this.deleteAllLayerVersions(layerName);
        const sdkArchiveBuffer = await this.sdkClientArchiveService.downloadArchiveBuffer({
            workspaceId: flatApplication.workspaceId,
            applicationId: flatApplication.id,
            applicationUniversalIdentifier
        });
        const zipBuffer = await (0, _reprefixlambdazipentriesutil.reprefixLambdaZipEntries)({
            sourceBuffer: sdkArchiveBuffer,
            prefix: _lambdadriverconstant.SDK_LAYER_PREFIX_IN_ZIP
        });
        const arn = await this.publishLayer({
            layerName,
            zipBuffer
        });
        await this.sdkClientArchiveService.markSdkLayerFresh({
            applicationId: flatApplication.id,
            workspaceId: flatApplication.workspaceId
        });
        return arn;
    }
    async deleteSdkLayer({ workspaceId, applicationUniversalIdentifier }) {
        const layerName = (0, _getlambdasdklayernameutil.getLambdaSdkLayerName)({
            workspaceId,
            applicationUniversalIdentifier
        });
        await this.deleteAllLayerVersions(layerName);
    }
    hasExpectedLayers({ lambdaExecutor, flatApplication, applicationUniversalIdentifier }) {
        const layers = lambdaExecutor.Configuration?.Layers;
        if (!(0, _utils.isDefined)(layers) || layers.length !== 2) {
            return false;
        }
        const depsLayerName = (0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication,
            namespace: this.options.resourceNamespace
        });
        const sdkLayerName = (0, _getlambdasdklayernameutil.getLambdaSdkLayerName)({
            workspaceId: flatApplication.workspaceId,
            applicationUniversalIdentifier
        });
        return layers.some((layer)=>layer.Arn?.includes(depsLayerName)) && layers.some((layer)=>layer.Arn?.includes(sdkLayerName));
    }
    async createDepsLayer({ flatApplication, applicationUniversalIdentifier, layerName }) {
        const existingArn = await this.awsClient.getExistingLayerArn(layerName);
        if ((0, _utils.isDefined)(existingArn)) {
            return;
        }
        const { packageJson, yarnLock } = await this.getDependencyContents({
            flatApplication,
            applicationUniversalIdentifier
        });
        const s3Key = `lambda-layers/${layerName}.zip`;
        const presignedUploadUrl = await this.awsClient.generatePresignedUploadUrl(s3Key);
        await this.toolFunctions.runYarnInstallCreateLayer({
            packageJson,
            yarnLock,
            presignedUploadUrl
        });
        const lambdaClient = await this.awsClient.getLambdaClient();
        let publishResult;
        try {
            publishResult = await lambdaClient.send(new _clientlambda.PublishLayerVersionCommand({
                LayerName: layerName,
                Content: {
                    S3Bucket: this.options.layerBucket,
                    S3Key: s3Key
                },
                CompatibleRuntimes: [
                    _logicfunctionentity.LogicFunctionRuntime.NODE18,
                    _logicfunctionentity.LogicFunctionRuntime.NODE22
                ]
            }));
        } catch (error) {
            if (error instanceof _clientlambda.InvalidParameterValueException && error.message.toLowerCase().includes('size')) {
                throw new _logicfunctionexception.LogicFunctionException(`Dependency layer '${layerName}' exceeds the Lambda layer size limit: ${error.message}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_DEPENDENCIES_SIZE_EXCEEDED);
            }
            throw error;
        }
        if (!publishResult.LayerVersionArn) {
            throw new Error(`PublishLayerVersion did not return a LayerVersionArn for layer '${layerName}'`);
        }
    }
    async getDependencyContents({ flatApplication, applicationUniversalIdentifier }) {
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        const { sourceTemporaryDir } = await temporaryDirManager.init();
        try {
            await this.logicFunctionResourceService.copyDependenciesInMemory({
                applicationUniversalIdentifier,
                workspaceId: flatApplication.workspaceId,
                inMemoryFolderPath: sourceTemporaryDir
            });
            const [packageJson, yarnLock] = await Promise.all([
                _promises.readFile(`${sourceTemporaryDir}/package.json`, 'utf-8'),
                _promises.readFile(`${sourceTemporaryDir}/yarn.lock`, 'utf-8')
            ]);
            return {
                packageJson,
                yarnLock
            };
        } finally{
            await temporaryDirManager.clean();
        }
    }
    async publishLayer({ layerName, zipBuffer }) {
        const lambdaClient = await this.awsClient.getLambdaClient();
        const result = await lambdaClient.send(new _clientlambda.PublishLayerVersionCommand({
            LayerName: layerName,
            Content: {
                ZipFile: zipBuffer
            },
            CompatibleRuntimes: [
                _logicfunctionentity.LogicFunctionRuntime.NODE18,
                _logicfunctionentity.LogicFunctionRuntime.NODE22
            ]
        }));
        if (!(0, _utils.isDefined)(result.LayerVersionArn)) {
            throw new Error('New layer version ARN is undefined');
        }
        return result.LayerVersionArn;
    }
    async deleteAllLayerVersions(layerName) {
        const lambdaClient = await this.awsClient.getLambdaClient();
        let marker;
        do {
            let listResult;
            try {
                listResult = await lambdaClient.send(new _clientlambda.ListLayerVersionsCommand({
                    LayerName: layerName,
                    MaxItems: 50,
                    Marker: marker
                }));
            } catch (error) {
                // Layer never existed or already fully removed. Idempotent.
                if (error instanceof _clientlambda.ResourceNotFoundException) {
                    return;
                }
                throw error;
            }
            const versions = listResult.LayerVersions ?? [];
            await Promise.all(versions.map(async (version)=>{
                try {
                    await lambdaClient.send(new _clientlambda.DeleteLayerVersionCommand({
                        LayerName: layerName,
                        VersionNumber: version.Version
                    }));
                } catch (error) {
                    // Already gone: another concurrent cleanup removed it. Idempotent.
                    if (error instanceof _clientlambda.ResourceNotFoundException) {
                        return;
                    }
                    throw error;
                }
            }));
            marker = listResult.NextMarker;
        }while ((0, _utils.isDefined)(marker))
    }
    constructor(options, awsClient, toolFunctions, logicFunctionResourceService, sdkClientArchiveService){
        this.options = options;
        this.awsClient = awsClient;
        this.toolFunctions = toolFunctions;
        this.logicFunctionResourceService = logicFunctionResourceService;
        this.sdkClientArchiveService = sdkClientArchiveService;
        this.logger = new _common.Logger(LambdaLayerManagerService.name);
    }
};

//# sourceMappingURL=lambda-layer-manager.service.js.map