"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTargetQueryService", {
    enumerable: true,
    get: function() {
        return TimelineActivityTargetQueryService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
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
const readTargetFromRecord = (record, targetJoinColumns)=>{
    for (const { joinColumnName, targetObjectNameSingular } of targetJoinColumns){
        const targetRecordId = record[joinColumnName];
        if ((0, _guards.isNonEmptyString)(targetRecordId)) {
            return {
                targetObjectNameSingular,
                targetRecordId
            };
        }
    }
    return undefined;
};
let TimelineActivityTargetQueryService = class TimelineActivityTargetQueryService {
    async resolveTargetsBySourceRecordId({ rule, sourceRecordIds }) {
        const targetsBySourceRecordId = new Map();
        if (rule.targetShape.kind !== 'JUNCTION' || sourceRecordIds.length === 0) {
            return targetsBySourceRecordId;
        }
        const { junctionObjectNameSingular, junctionSourceJoinColumnName } = rule.targetShape;
        const junctionRepository = this.workspaceOrmManager.getRepository(junctionObjectNameSingular, {
            shouldBypassPermissionChecks: true
        });
        const junctionRows = await junctionRepository.find({
            where: {
                [junctionSourceJoinColumnName]: (0, _typeorm.In)(sourceRecordIds)
            }
        });
        for (const junctionRow of junctionRows){
            const sourceRecordId = junctionRow[junctionSourceJoinColumnName];
            const target = readTargetFromRecord(junctionRow, rule.targetShape.targetJoinColumns);
            if (!(0, _guards.isNonEmptyString)(sourceRecordId) || !(0, _utils.isDefined)(target)) {
                continue;
            }
            const targets = targetsBySourceRecordId.get(sourceRecordId);
            if ((0, _utils.isDefined)(targets)) {
                targets.push(target);
            } else {
                targetsBySourceRecordId.set(sourceRecordId, [
                    target
                ]);
            }
        }
        return targetsBySourceRecordId;
    }
    resolveTargetFromRecord({ rule, record }) {
        if (!(0, _utils.isDefined)(record) || rule.targetShape.kind === 'SELF') {
            return undefined;
        }
        return readTargetFromRecord(record, rule.targetShape.targetJoinColumns);
    }
    async findSourceRecordsByRecordId({ rule, recordIds }) {
        const sourceRecordsByRecordId = new Map();
        if (recordIds.length === 0) {
            return sourceRecordsByRecordId;
        }
        const repository = this.workspaceOrmManager.getRepository(rule.sourceFlatObjectMetadata.nameSingular, {
            shouldBypassPermissionChecks: true
        });
        const records = await repository.find({
            where: {
                id: (0, _typeorm.In)(recordIds)
            }
        });
        for (const record of records){
            sourceRecordsByRecordId.set(record.id, record);
        }
        return sourceRecordsByRecordId;
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
TimelineActivityTargetQueryService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], TimelineActivityTargetQueryService);

//# sourceMappingURL=timeline-activity-target-query.service.js.map