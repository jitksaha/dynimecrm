"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LambdaToolFunctionsService", {
    enumerable: true,
    get: function() {
        return LambdaToolFunctionsService;
    }
});
const _promises = /*#__PURE__*/ _interop_require_wildcard(require("node:fs/promises"));
const _path = require("path");
const _clientlambda = require("@aws-sdk/client-lambda");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _commonlayerdependenciesdirname = require("../../../constants/common-layer-dependencies-dirname");
const _lambdadriverconstant = require("../constants/lambda-driver.constant");
const _buildyarninstallfailureexceptionutil = require("../utils/build-yarn-install-failure-exception.util");
const _computehashedlambdaresourcenameutil = require("../utils/compute-hashed-lambda-resource-name.util");
const _copybuilder = require("../../../utils/copy-builder");
const _copycommonlayerdependencies = require("../../../utils/copy-common-layer-dependencies");
const _copyyarninstall = require("../../../utils/copy-yarn-install");
const _createzipfile = require("../../../utils/create-zip-file");
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
let LambdaToolFunctionsService = class LambdaToolFunctionsService {
    async transpile(params) {
        await this.ensureBuilderLambdaExists();
        const lambdaClient = await this.awsClient.getLambdaClient();
        const builderFunctionName = await this.getBuilderFunctionName();
        const payload = {
            action: 'transpile',
            ...params
        };
        const result = await lambdaClient.send(new _clientlambda.InvokeCommand({
            FunctionName: builderFunctionName,
            Payload: JSON.stringify(payload),
            LogType: _clientlambda.LogType.Tail
        }), {
            abortSignal: AbortSignal.timeout(_lambdadriverconstant.BUILDER_LAMBDA_TIMEOUT_SECONDS * 1000)
        });
        if (result.FunctionError) {
            const parsedResult = result.Payload ? JSON.parse(result.Payload.transformToString()) : {};
            const userCompilationErrorRegex = /^Build failed with \d+ error/;
            const isUserCompilationError = (0, _guards.isNonEmptyString)(parsedResult?.errorMessage) && userCompilationErrorRegex.test(parsedResult.errorMessage);
            if (isUserCompilationError) {
                throw new _logicfunctionexception.LogicFunctionException(`Function code compilation failed: ${parsedResult.errorMessage}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_COMPILATION_FAILED);
            }
            throw new _logicfunctionexception.LogicFunctionException(`Builder Lambda failed: ${JSON.stringify(parsedResult)}`, _logicfunctionexception.LogicFunctionExceptionCode.LOGIC_FUNCTION_CREATE_FAILED);
        }
        const parsedResult = result.Payload ? JSON.parse(result.Payload.transformToString()) : {};
        if (!parsedResult.builtCode) {
            throw new Error('Builder Lambda did not return builtCode');
        }
        return {
            builtCode: parsedResult.builtCode
        };
    }
    async runYarnInstallCreateLayer(params) {
        await this.ensureYarnInstallLambdaExists();
        const lambdaClient = await this.awsClient.getLambdaClient();
        const yarnInstallFunctionName = await this.getYarnInstallFunctionName();
        const payload = {
            action: 'createLayer',
            ...params
        };
        const result = await lambdaClient.send(new _clientlambda.InvokeCommand({
            FunctionName: yarnInstallFunctionName,
            Payload: JSON.stringify(payload),
            LogType: _clientlambda.LogType.Tail
        }), {
            abortSignal: AbortSignal.timeout(_lambdadriverconstant.YARN_INSTALL_LAMBDA_TIMEOUT_SECONDS * 1000)
        });
        if (result.FunctionError) {
            const parsedResult = result.Payload ? JSON.parse(result.Payload.transformToString()) : {};
            throw (0, _buildyarninstallfailureexceptionutil.buildYarnInstallFailureException)(parsedResult);
        }
        const parsedResult = result.Payload ? JSON.parse(result.Payload.transformToString()) : {};
        if (!parsedResult.success) {
            throw new Error('Yarn install Lambda did not report success');
        }
        return parsedResult;
    }
    async ensureCommonLayerExists() {
        const commonLayerName = await this.getCommonLayerName();
        const existingArn = await this.awsClient.getExistingLayerArn(commonLayerName);
        if ((0, _utils.isDefined)(existingArn)) {
            return existingArn;
        }
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        const { sourceTemporaryDir, lambdaZipPath } = await temporaryDirManager.init();
        try {
            await (0, _copycommonlayerdependencies.copyCommonLayerDependencies)(sourceTemporaryDir);
            await (0, _createzipfile.createZipFile)(sourceTemporaryDir, lambdaZipPath);
            const lambdaClient = await this.awsClient.getLambdaClient();
            const result = await lambdaClient.send(new _clientlambda.PublishLayerVersionCommand({
                LayerName: commonLayerName,
                Content: {
                    ZipFile: await _promises.readFile(lambdaZipPath)
                },
                CompatibleRuntimes: [
                    _logicfunctionentity.LogicFunctionRuntime.NODE18,
                    _logicfunctionentity.LogicFunctionRuntime.NODE22
                ]
            }));
            if (!result.LayerVersionArn) {
                throw new Error('PublishLayerVersion did not return a LayerVersionArn for common layer');
            }
            return result.LayerVersionArn;
        } finally{
            await temporaryDirManager.clean();
        }
    }
    async ensureYarnInstallLambdaExists() {
        const yarnInstallFunctionName = await this.getYarnInstallFunctionName();
        const lambdaClient = await this.awsClient.getLambdaClient();
        try {
            await lambdaClient.send(new _clientlambda.GetFunctionCommand({
                FunctionName: yarnInstallFunctionName
            }));
            return;
        } catch (error) {
            if (!(error instanceof _clientlambda.ResourceNotFoundException)) {
                throw error;
            }
        }
        const commonLayerArn = await this.ensureCommonLayerExists();
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        const { sourceTemporaryDir, lambdaZipPath } = await temporaryDirManager.init();
        try {
            await (0, _copyyarninstall.copyYarnInstall)(sourceTemporaryDir);
            await (0, _createzipfile.createZipFile)(sourceTemporaryDir, lambdaZipPath);
            const params = {
                Code: {
                    ZipFile: await _promises.readFile(lambdaZipPath)
                },
                FunctionName: yarnInstallFunctionName,
                Layers: [
                    commonLayerArn
                ],
                Handler: 'index.handler',
                Role: this.options.lambdaRole,
                Runtime: _logicfunctionentity.LogicFunctionRuntime.NODE22,
                Timeout: _lambdadriverconstant.YARN_INSTALL_LAMBDA_TIMEOUT_SECONDS,
                MemorySize: _lambdadriverconstant.YARN_INSTALL_LAMBDA_MEMORY_MB,
                EphemeralStorage: {
                    Size: _lambdadriverconstant.LAMBDA_EPHEMERAL_STORAGE_MB
                }
            };
            await lambdaClient.send(new _clientlambda.CreateFunctionCommand(params));
        } finally{
            await temporaryDirManager.clean();
        }
        await this.awsClient.waitFunctionActive(yarnInstallFunctionName);
    }
    async ensureBuilderLambdaExists() {
        const builderFunctionName = await this.getBuilderFunctionName();
        const lambdaClient = await this.awsClient.getLambdaClient();
        try {
            await lambdaClient.send(new _clientlambda.GetFunctionCommand({
                FunctionName: builderFunctionName
            }));
            return;
        } catch (error) {
            if (!(error instanceof _clientlambda.ResourceNotFoundException)) {
                throw error;
            }
        }
        const commonLayerArn = await this.ensureCommonLayerExists();
        const temporaryDirManager = new _temporarydirmanager.TemporaryDirManager();
        const { sourceTemporaryDir, lambdaZipPath } = await temporaryDirManager.init();
        try {
            await (0, _copybuilder.copyBuilder)(sourceTemporaryDir);
            await (0, _createzipfile.createZipFile)(sourceTemporaryDir, lambdaZipPath);
            const params = {
                Code: {
                    ZipFile: await _promises.readFile(lambdaZipPath)
                },
                FunctionName: builderFunctionName,
                Layers: [
                    commonLayerArn
                ],
                Handler: 'index.handler',
                Role: this.options.lambdaRole,
                Runtime: _logicfunctionentity.LogicFunctionRuntime.NODE22,
                Timeout: _lambdadriverconstant.BUILDER_LAMBDA_TIMEOUT_SECONDS,
                MemorySize: _lambdadriverconstant.BUILDER_LAMBDA_MEMORY_MB,
                EphemeralStorage: {
                    Size: _lambdadriverconstant.LAMBDA_EPHEMERAL_STORAGE_MB
                }
            };
            await lambdaClient.send(new _clientlambda.CreateFunctionCommand(params));
        } finally{
            await temporaryDirManager.clean();
        }
        await this.awsClient.waitFunctionActive(builderFunctionName);
    }
    async getCommonLayerName() {
        if ((0, _utils.isDefined)(this.commonLayerName)) {
            return this.commonLayerName;
        }
        const [packageJson, yarnLock] = await Promise.all([
            _promises.readFile((0, _path.join)(_commonlayerdependenciesdirname.COMMON_LAYER_DEPENDENCIES_DIRNAME, 'package.json'), 'utf-8'),
            _promises.readFile((0, _path.join)(_commonlayerdependenciesdirname.COMMON_LAYER_DEPENDENCIES_DIRNAME, 'yarn.lock'), 'utf-8')
        ]);
        this.commonLayerName = (0, _computehashedlambdaresourcenameutil.computeHashedLambdaResourceName)({
            resourceNamePrefix: _lambdadriverconstant.COMMON_LAYER_NAME_PREFIX,
            namespace: this.options.resourceNamespace,
            contents: [
                packageJson,
                yarnLock
            ]
        });
        return this.commonLayerName;
    }
    async getYarnInstallFunctionName() {
        if ((0, _utils.isDefined)(this.yarnInstallFunctionName)) {
            return this.yarnInstallFunctionName;
        }
        const handlerContent = await _promises.readFile(_lambdadriverconstant.YARN_INSTALL_HANDLER_PATH, 'utf-8');
        this.yarnInstallFunctionName = (0, _computehashedlambdaresourcenameutil.computeHashedLambdaResourceName)({
            resourceNamePrefix: _lambdadriverconstant.YARN_INSTALL_FUNCTION_NAME_PREFIX,
            namespace: this.options.resourceNamespace,
            contents: [
                handlerContent,
                String(_lambdadriverconstant.YARN_INSTALL_LAMBDA_MEMORY_MB),
                String(_lambdadriverconstant.YARN_INSTALL_LAMBDA_TIMEOUT_SECONDS),
                String(_lambdadriverconstant.LAMBDA_EPHEMERAL_STORAGE_MB)
            ]
        });
        return this.yarnInstallFunctionName;
    }
    async getBuilderFunctionName() {
        if ((0, _utils.isDefined)(this.builderFunctionName)) {
            return this.builderFunctionName;
        }
        const handlerContent = await _promises.readFile(_lambdadriverconstant.BUILDER_HANDLER_PATH, 'utf-8');
        this.builderFunctionName = (0, _computehashedlambdaresourcenameutil.computeHashedLambdaResourceName)({
            resourceNamePrefix: _lambdadriverconstant.BUILDER_FUNCTION_NAME_PREFIX,
            namespace: this.options.resourceNamespace,
            contents: [
                handlerContent,
                String(_lambdadriverconstant.BUILDER_LAMBDA_MEMORY_MB),
                String(_lambdadriverconstant.BUILDER_LAMBDA_TIMEOUT_SECONDS),
                String(_lambdadriverconstant.LAMBDA_EPHEMERAL_STORAGE_MB)
            ]
        });
        return this.builderFunctionName;
    }
    constructor(options, awsClient){
        this.options = options;
        this.awsClient = awsClient;
    }
};

//# sourceMappingURL=lambda-tool-functions.service.js.map