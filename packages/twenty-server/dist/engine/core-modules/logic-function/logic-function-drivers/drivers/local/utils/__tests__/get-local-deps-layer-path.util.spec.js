"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _logicfunctionexecutortmpdirfolder = require("../../../../constants/logic-function-executor-tmpdir-folder");
const _getlocaldepslayerpathutil = require("../get-local-deps-layer-path.util");
describe('getLocalDepsLayerPath', ()=>{
    it('joins the tmpdir folder, the deps segment and the yarnLockChecksum', ()=>{
        expect((0, _getlocaldepslayerpathutil.getLocalDepsLayerPath)({
            yarnLockChecksum: 'abc123'
        })).toBe(`${_logicfunctionexecutortmpdirfolder.LOGIC_FUNCTION_EXECUTOR_TMPDIR_FOLDER}/deps/abc123`);
    });
    it('falls back to default when yarnLockChecksum is undefined', ()=>{
        expect((0, _getlocaldepslayerpathutil.getLocalDepsLayerPath)({
            yarnLockChecksum: undefined
        })).toBe(`${_logicfunctionexecutortmpdirfolder.LOGIC_FUNCTION_EXECUTOR_TMPDIR_FOLDER}/deps/default`);
    });
});

//# sourceMappingURL=get-local-deps-layer-path.util.spec.js.map