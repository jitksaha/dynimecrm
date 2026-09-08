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
    get deleteFeatureFlags () {
        return deleteFeatureFlags;
    },
    get seedFeatureFlags () {
        return seedFeatureFlags;
    }
});
const _types = require("twenty-shared/types");
const tableName = 'featureFlag';
const DEFAULT_SEEDED_FEATURE_FLAGS = {
    [_types.FeatureFlagKey.IS_APP_CLAIMING_ENABLED]: false,
    [_types.FeatureFlagKey.IS_UNIQUE_INDEXES_ENABLED]: false,
    [_types.FeatureFlagKey.IS_EMAIL_GROUP_ENABLED]: true,
    [_types.FeatureFlagKey.IS_JUNCTION_RELATIONS_ENABLED]: true,
    [_types.FeatureFlagKey.IS_MESSAGE_CALENDAR_TARGET_READ_ENABLED]: true
};
const seedFeatureFlags = async ({ queryRunner, schemaName, workspaceId })=>{
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.${tableName}`, [
        'key',
        'workspaceId',
        'value'
    ]).orIgnore().values(Object.entries(DEFAULT_SEEDED_FEATURE_FLAGS).map(([key, value])=>({
            key,
            workspaceId,
            value
        }))).execute();
};
const deleteFeatureFlags = async ({ queryRunner, schemaName, workspaceId })=>{
    await queryRunner.manager.createQueryBuilder().delete().from(`${schemaName}.${tableName}`).where(`"${tableName}"."workspaceId" = :workspaceId`, {
        workspaceId
    }).execute();
};

//# sourceMappingURL=seed-feature-flags.util.js.map