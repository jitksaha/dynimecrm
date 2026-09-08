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
    get attachToManyRelationToRecords () {
        return attachToManyRelationToRecords;
    },
    get attachToOneRelationToRecords () {
        return attachToOneRelationToRecords;
    },
    get collectForeignKeys () {
        return collectForeignKeys;
    },
    get collectRecordIds () {
        return collectRecordIds;
    }
});
const _guards = require("@sniptt/guards");
const collectForeignKeys = (records, joinColumnName)=>[
        ...new Set(records.map((record)=>record[joinColumnName]).filter(_guards.isNonEmptyString))
    ];
const collectRecordIds = (records)=>[
        ...new Set(records.map((record)=>record.id).filter(_guards.isNonEmptyString))
    ];
const attachToOneRelationToRecords = ({ records, fieldName, joinColumnName, targets })=>{
    const targetById = new Map(targets.map((target)=>[
            target.id,
            target
        ]));
    for (const record of records){
        const foreignKey = record[joinColumnName];
        record[fieldName] = (0, _guards.isNonEmptyString)(foreignKey) ? targetById.get(foreignKey) ?? null : null;
    }
};
const attachToManyRelationToRecords = ({ records, fieldName, inverseForeignKeyColumnName, children })=>{
    const childrenByParentId = new Map();
    for (const child of children){
        const parentId = child[inverseForeignKeyColumnName];
        if (!(0, _guards.isNonEmptyString)(parentId)) {
            continue;
        }
        const siblings = childrenByParentId.get(parentId) ?? [];
        siblings.push(child);
        childrenByParentId.set(parentId, siblings);
    }
    for (const record of records){
        record[fieldName] = childrenByParentId.get(record.id) ?? [];
    }
};

//# sourceMappingURL=attach-relations.util.js.map