"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreatePersonService", {
    enumerable: true,
    get: function() {
        return CreatePersonService;
    }
});
const _common = require("@nestjs/common");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../engine/twenty-orm/utils/build-system-auth-context.util");
const _personworkspaceentity = require("../../person/standard-objects/person.workspace-entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CreatePersonService = class CreatePersonService {
    async createPeople(peopleToCreate, workspaceId) {
        if (peopleToCreate.length === 0) return [];
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const personRepository = this.workspaceOrmManager.getRepository(_personworkspaceentity.PersonWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const lastPersonPosition = await this.getLastPersonPosition(personRepository);
            const createdPeople = await personRepository.insert(peopleToCreate.map((person, index)=>({
                    ...person,
                    position: lastPersonPosition + index
                })));
            return createdPeople.raw;
        }, authContext);
    }
    async restorePeople(people, workspaceId) {
        if (people.length === 0) {
            return [];
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const personRepository = this.workspaceOrmManager.getRepository(_personworkspaceentity.PersonWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const restoredPeople = await personRepository.updateMany(people.map(({ personId, companyId })=>({
                    criteria: personId,
                    partialEntity: {
                        deletedAt: null,
                        companyId
                    }
                })));
            return restoredPeople.raw;
        }, authContext);
    }
    async enrichPeopleNames(peopleToEnrich, workspaceId) {
        if (peopleToEnrich.length === 0) {
            return [];
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const personRepository = this.workspaceOrmManager.getRepository(_personworkspaceentity.PersonWorkspaceEntity, {
                shouldBypassPermissionChecks: true
            });
            const enrichedPeople = await personRepository.updateMany(peopleToEnrich.map(({ personId, name })=>({
                    criteria: personId,
                    partialEntity: {
                        name
                    }
                })));
            return enrichedPeople.raw;
        }, authContext);
    }
    async getLastPersonPosition(personRepository) {
        const lastPersonPosition = await personRepository.maximum('position', undefined);
        return lastPersonPosition ?? 0;
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
CreatePersonService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], CreatePersonService);

//# sourceMappingURL=create-person.service.js.map