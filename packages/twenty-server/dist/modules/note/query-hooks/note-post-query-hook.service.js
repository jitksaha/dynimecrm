"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotePostQueryHookService", {
    enumerable: true,
    get: function() {
        return NotePostQueryHookService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _workspaceexception = require("../../../engine/core-modules/workspace/workspace.exception");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NotePostQueryHookService = class NotePostQueryHookService {
    async handleNoteTargetsDelete(authContext, payload) {
        if (!payload || payload?.length === 0) {
            return;
        }
        const workspace = authContext.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const noteTargetRepository = this.workspaceOrmManager.getRepository('noteTarget');
            await noteTargetRepository.softDelete({
                noteId: (0, _typeorm.In)(payload.map((note)=>note.id))
            });
        }, authContext);
    }
    async handleNoteTargetsRestore(authContext, payload) {
        if (!payload || payload?.length === 0) {
            return;
        }
        const workspace = authContext.workspace;
        (0, _utils.assertIsDefinedOrThrow)(workspace, _workspaceexception.WorkspaceNotFoundDefaultError);
        await this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const noteTargetRepository = this.workspaceOrmManager.getRepository('noteTarget');
            await noteTargetRepository.restore({
                noteId: (0, _typeorm.In)(payload.map((note)=>note.id))
            });
        }, authContext);
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
NotePostQueryHookService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], NotePostQueryHookService);

//# sourceMappingURL=note-post-query-hook.service.js.map