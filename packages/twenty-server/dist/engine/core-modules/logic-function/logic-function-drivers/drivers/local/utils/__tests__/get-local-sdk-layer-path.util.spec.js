"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _logicfunctionexecutortmpdirfolder = require("../../../../constants/logic-function-executor-tmpdir-folder");
const _getlocalsdklayerpathutil = require("../get-local-sdk-layer-path.util");
describe('getLocalSdkLayerPath', ()=>{
    it('joins the tmpdir folder, the sdk segment and "<workspaceId>-<applicationUniversalIdentifier>"', ()=>{
        expect((0, _getlocalsdklayerpathutil.getLocalSdkLayerPath)({
            workspaceId: 'ws-1',
            applicationUniversalIdentifier: 'app-2'
        })).toBe(`${_logicfunctionexecutortmpdirfolder.LOGIC_FUNCTION_EXECUTOR_TMPDIR_FOLDER}/sdk/ws-1-app-2`);
    });
});

//# sourceMappingURL=get-local-sdk-layer-path.util.spec.js.map