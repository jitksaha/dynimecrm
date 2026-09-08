"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _fromlogicfunctionmanifesttouniversalflatlogicfunctionutil = require("../from-logic-function-manifest-to-universal-flat-logic-function.util");
const _applicationregistrationsourcetypeenum = require("../../../application-registration/enums/application-registration-source-type.enum");
const _createemptyflatentitymapsconstant = require("../../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _logicfunctionentity = require("../../../../../metadata-modules/logic-function/logic-function.entity");
describe('fromLogicFunctionManifestToUniversalFlatLogicFunction', ()=>{
    const now = '2026-01-01T00:00:00.000Z';
    const applicationUniversalIdentifier = 'app-uuid-1';
    const logicFunctionUniversalIdentifier = 'fn-uuid-1';
    const buildLogicFunctionManifest = (overrides = {})=>({
            universalIdentifier: logicFunctionUniversalIdentifier,
            name: 'My Function',
            handlerName: 'handler',
            sourceHandlerPath: 'src/my-function.ts',
            builtHandlerPath: 'dist/my-function.mjs',
            builtHandlerChecksum: 'checksum-1',
            ...overrides
        });
    const emptyFlatLogicFunctionMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    const buildFlatLogicFunctionMaps = (executionMode)=>({
            ...emptyFlatLogicFunctionMaps,
            byUniversalIdentifier: {
                [logicFunctionUniversalIdentifier]: {
                    universalIdentifier: logicFunctionUniversalIdentifier,
                    executionMode
                }
            }
        });
    const convert = ({ logicFunctionManifest = buildLogicFunctionManifest(), applicationSourceType, existingFlatLogicFunctionMaps = emptyFlatLogicFunctionMaps, isPrebuiltModeEnabled = true })=>(0, _fromlogicfunctionmanifesttouniversalflatlogicfunctionutil.fromLogicFunctionManifestToUniversalFlatLogicFunction)({
            logicFunctionManifest,
            applicationUniversalIdentifier,
            applicationSourceType,
            existingFlatLogicFunctionMaps,
            isPrebuiltModeEnabled,
            now
        });
    it.each([
        _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL,
        _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM
    ])('should set PREBUILT execution mode for a new function of a %s application', (applicationSourceType)=>{
        const result = convert({
            applicationSourceType
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.PREBUILT);
        expect(result.checksum).toBe('checksum-1');
        expect(result.isBuildUpToDate).toBe(true);
    });
    it.each([
        _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL,
        _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.OAUTH_ONLY
    ])('should keep LIVE execution mode for a new function of a %s application', (applicationSourceType)=>{
        const result = convert({
            applicationSourceType
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.LIVE);
    });
    it.each([
        [
            'empty',
            ''
        ],
        [
            'undefined',
            undefined
        ]
    ])('should fall back to LIVE for a packaged application with an %s checksum', (_label, builtHandlerChecksum)=>{
        const result = convert({
            logicFunctionManifest: buildLogicFunctionManifest({
                builtHandlerChecksum
            }),
            applicationSourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.LIVE);
    });
    it('should keep LIVE execution mode when prebuilt mode is disabled', ()=>{
        const result = convert({
            applicationSourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            isPrebuiltModeEnabled: false
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.LIVE);
    });
    it('should keep the execution mode of an already synced function', ()=>{
        const result = convert({
            applicationSourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            existingFlatLogicFunctionMaps: buildFlatLogicFunctionMaps(_logicfunctionentity.LogicFunctionExecutionMode.LIVE)
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.LIVE);
    });
    it('should keep PREBUILT on an already synced function even when prebuilt mode is disabled', ()=>{
        const result = convert({
            applicationSourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            existingFlatLogicFunctionMaps: buildFlatLogicFunctionMaps(_logicfunctionentity.LogicFunctionExecutionMode.PREBUILT),
            isPrebuiltModeEnabled: false
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.PREBUILT);
    });
    it.each([
        [
            'empty',
            ''
        ],
        [
            'undefined',
            undefined
        ]
    ])('should demote an already synced PREBUILT function to LIVE when the manifest has an %s checksum', (_label, builtHandlerChecksum)=>{
        const result = convert({
            logicFunctionManifest: buildLogicFunctionManifest({
                builtHandlerChecksum
            }),
            applicationSourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM,
            existingFlatLogicFunctionMaps: buildFlatLogicFunctionMaps(_logicfunctionentity.LogicFunctionExecutionMode.PREBUILT)
        });
        expect(result.executionMode).toBe(_logicfunctionentity.LogicFunctionExecutionMode.LIVE);
    });
    it('should derive the name from the handler when the manifest has no name', ()=>{
        const result = convert({
            logicFunctionManifest: buildLogicFunctionManifest({
                name: undefined,
                handlerName: 'myHandler'
            }),
            applicationSourceType: _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.LOCAL
        });
        expect(result.name).toBe('myHandler');
    });
});

//# sourceMappingURL=from-logic-function-manifest-to-universal-flat-logic-function.util.spec.js.map