"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromLogicFunctionManifestToUniversalFlatLogicFunction", {
    enumerable: true,
    get: function() {
        return fromLogicFunctionManifestToUniversalFlatLogicFunction;
    }
});
const _path = require("path");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _ispackagedapplicationsourceutil = require("../../application-registration/utils/is-packaged-application-source.util");
const _findflatentitybyuniversalidentifierutil = require("../../../../metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _logicfunctionentity = require("../../../../metadata-modules/logic-function/logic-function.entity");
const resolveExecutionMode = ({ logicFunctionManifest, applicationSourceType, existingFlatLogicFunctionMaps, isPrebuiltModeEnabled })=>{
    const existingFlatLogicFunction = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
        flatEntityMaps: existingFlatLogicFunctionMaps,
        universalIdentifier: logicFunctionManifest.universalIdentifier
    });
    if ((0, _utils.isDefined)(existingFlatLogicFunction)) {
        if (existingFlatLogicFunction.executionMode === _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT && !(0, _guards.isNonEmptyString)(logicFunctionManifest.builtHandlerChecksum)) {
            return _logicfunctionentity.LogicFunctionExecutionMode.LIVE;
        }
        return existingFlatLogicFunction.executionMode;
    }
    if (isPrebuiltModeEnabled && (0, _ispackagedapplicationsourceutil.isPackagedApplicationSource)(applicationSourceType) && (0, _guards.isNonEmptyString)(logicFunctionManifest.builtHandlerChecksum)) {
        return _logicfunctionentity.LogicFunctionExecutionMode.PREBUILT;
    }
    return _logicfunctionentity.LogicFunctionExecutionMode.LIVE;
};
const fromLogicFunctionManifestToUniversalFlatLogicFunction = ({ logicFunctionManifest, applicationUniversalIdentifier, applicationSourceType, existingFlatLogicFunctionMaps, isPrebuiltModeEnabled, now })=>{
    const name = logicFunctionManifest.name ?? (0, _path.parse)(logicFunctionManifest.handlerName).name;
    return {
        universalIdentifier: logicFunctionManifest.universalIdentifier,
        applicationUniversalIdentifier,
        name,
        description: logicFunctionManifest.description ?? null,
        runtime: _logicfunctionentity.LogicFunctionRuntime.NODE22,
        timeoutSeconds: logicFunctionManifest.timeoutSeconds ?? 300,
        sourceHandlerPath: logicFunctionManifest.sourceHandlerPath,
        builtHandlerPath: logicFunctionManifest.builtHandlerPath,
        handlerName: logicFunctionManifest.handlerName,
        checksum: logicFunctionManifest.builtHandlerChecksum,
        cronTriggerSettings: logicFunctionManifest.cronTriggerSettings ?? null,
        databaseEventTriggerSettings: logicFunctionManifest.databaseEventTriggerSettings ?? null,
        httpRouteTriggerSettings: logicFunctionManifest.httpRouteTriggerSettings ?? null,
        serverRouteTriggerSettings: logicFunctionManifest.serverRouteTriggerSettings ?? null,
        toolTriggerSettings: logicFunctionManifest.toolTriggerSettings ?? null,
        workflowActionTriggerSettings: logicFunctionManifest.workflowActionTriggerSettings ?? null,
        isBuildUpToDate: true,
        executionMode: resolveExecutionMode({
            logicFunctionManifest,
            applicationSourceType,
            existingFlatLogicFunctionMaps,
            isPrebuiltModeEnabled
        }),
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    };
};

//# sourceMappingURL=from-logic-function-manifest-to-universal-flat-logic-function.util.js.map