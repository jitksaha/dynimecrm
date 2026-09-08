"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get buildConflictKey () {
        return buildConflictKey;
    },
    get matchEntitiesForUpsert () {
        return matchEntitiesForUpsert;
    },
    get partitionEntitiesForSave () {
        return partitionEntitiesForSave;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const partitionEntitiesForSave = (entities, existingIds)=>{
    const toUpdate = [];
    const toInsert = [];
    for (const entity of entities){
        const id = entity.id;
        if ((0, _guards.isNonEmptyString)(id) && existingIds.has(id)) {
            toUpdate.push(entity);
        } else {
            toInsert.push(entity);
        }
    }
    return {
        toUpdate,
        toInsert
    };
};
const buildConflictKey = (entity, conflictPaths)=>JSON.stringify(conflictPaths.map((path)=>entity[path] ?? null));
const hasCompleteConflictKey = (record, conflictPaths)=>conflictPaths.every((path)=>(0, _utils.isDefined)(record[path]));
const matchEntitiesForUpsert = (entities, existingRecords, conflictPaths)=>{
    const existingIdByConflictKey = new Map();
    for (const existingRecord of existingRecords){
        if ((0, _guards.isNonEmptyString)(existingRecord.id) && hasCompleteConflictKey(existingRecord, conflictPaths)) {
            existingIdByConflictKey.set(buildConflictKey(existingRecord, conflictPaths), existingRecord.id);
        }
    }
    const toUpdate = [];
    const toInsert = [];
    for (const entity of entities){
        const existingId = hasCompleteConflictKey(entity, conflictPaths) ? existingIdByConflictKey.get(buildConflictKey(entity, conflictPaths)) : undefined;
        if ((0, _guards.isNonEmptyString)(existingId)) {
            toUpdate.push({
                id: existingId,
                entity
            });
        } else {
            toInsert.push(entity);
        }
    }
    return {
        toUpdate,
        toInsert
    };
};

//# sourceMappingURL=resolve-save-and-upsert.util.js.map