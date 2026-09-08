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
    get SEEDER_CREATE_WORKSPACE_INPUT () {
        return SEEDER_CREATE_WORKSPACE_INPUT;
    },
    get SEED_APPLE_WORKSPACE_ID () {
        return SEED_APPLE_WORKSPACE_ID;
    },
    get SEED_EMPTY_WORKSPACE_3_ID () {
        return SEED_EMPTY_WORKSPACE_3_ID;
    },
    get SEED_EMPTY_WORKSPACE_4_ID () {
        return SEED_EMPTY_WORKSPACE_4_ID;
    },
    get SEED_YCOMBINATOR_WORKSPACE_ID () {
        return SEED_YCOMBINATOR_WORKSPACE_ID;
    },
    get WORKSPACE_FIELDS_TO_SEED () {
        return WORKSPACE_FIELDS_TO_SEED;
    }
});
const _workspace = require("twenty-shared/workspace");
const WORKSPACE_FIELDS_TO_SEED = [
    'id',
    'displayName',
    'subdomain',
    'inviteHash',
    'logo',
    'activationStatus',
    'isTwoFactorAuthenticationEnforced',
    'workspaceCustomApplicationId'
];
const DEFAULT_SEED_APPLE_WORKSPACE_ID = '20202020-1c25-4d02-bf25-6aeccf7ea419';
const SEED_APPLE_WORKSPACE_ID = process.env.E2E_SEED_WORKSPACE_ID ?? DEFAULT_SEED_APPLE_WORKSPACE_ID;
const SEED_YCOMBINATOR_WORKSPACE_ID = '3b8e6458-5fc1-4e63-8563-008ccddaa6db';
const SEED_EMPTY_WORKSPACE_3_ID = '506915ec-21ca-431b-a04a-257eb216865e';
const SEED_EMPTY_WORKSPACE_4_ID = 'aa8fdcb1-8ee1-4012-98af-44a97caa7411';
const SEEDER_CREATE_WORKSPACE_INPUT = {
    [SEED_APPLE_WORKSPACE_ID]: {
        id: SEED_APPLE_WORKSPACE_ID,
        displayName: 'Apple',
        subdomain: 'apple',
        inviteHash: 'apple.dev-invite-hash',
        logo: 'https://twentyhq.github.io/placeholder-images/workspaces/apple-logo.png',
        activationStatus: _workspace.WorkspaceActivationStatus.PENDING_CREATION,
        isTwoFactorAuthenticationEnforced: false
    },
    [SEED_YCOMBINATOR_WORKSPACE_ID]: {
        id: SEED_YCOMBINATOR_WORKSPACE_ID,
        displayName: 'YCombinator',
        subdomain: 'yc',
        inviteHash: 'yc.dev-invite-hash',
        logo: 'https://twentyhq.github.io/placeholder-images/workspaces/ycombinator-logo.png',
        activationStatus: _workspace.WorkspaceActivationStatus.PENDING_CREATION,
        isTwoFactorAuthenticationEnforced: false
    }
};

//# sourceMappingURL=seeder-workspaces.constant.js.map