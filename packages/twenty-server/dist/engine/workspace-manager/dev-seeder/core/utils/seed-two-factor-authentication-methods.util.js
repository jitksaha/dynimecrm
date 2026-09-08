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
    get TWO_FACTOR_AUTHENTICATION_METHOD_DATA_SEED_IDS () {
        return TWO_FACTOR_AUTHENTICATION_METHOD_DATA_SEED_IDS;
    },
    get seedTwoFactorAuthenticationMethods () {
        return seedTwoFactorAuthenticationMethods;
    }
});
const _seederworkspacesconstant = require("../constants/seeder-workspaces.constant");
const _seeduserworkspacesutil = require("./seed-user-workspaces.util");
const tableName = 'twoFactorAuthenticationMethod';
const TWO_FACTOR_AUTHENTICATION_METHOD_DATA_SEED_IDS = {
    JANE: '20202020-1111-4a01-8001-000000000004'
};
const seedTwoFactorAuthenticationMethods = async ({ queryRunner, schemaName, workspaceId, encryptedSecret })=>{
    if (process.env.NODE_ENV !== 'test' || workspaceId !== _seederworkspacesconstant.SEED_APPLE_WORKSPACE_ID) {
        return;
    }
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.${tableName}`, [
        'id',
        'workspaceId',
        'userWorkspaceId',
        'secret',
        'status',
        'strategy'
    ]).orIgnore().values([
        {
            id: TWO_FACTOR_AUTHENTICATION_METHOD_DATA_SEED_IDS.JANE,
            workspaceId,
            userWorkspaceId: _seeduserworkspacesutil.USER_WORKSPACE_DATA_SEED_IDS.JANE,
            secret: encryptedSecret,
            status: 'VERIFIED',
            strategy: 'TOTP'
        }
    ]).execute();
};

//# sourceMappingURL=seed-two-factor-authentication-methods.util.js.map