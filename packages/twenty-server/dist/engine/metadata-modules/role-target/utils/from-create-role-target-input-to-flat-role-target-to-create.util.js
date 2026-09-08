"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fromCreateRoleTargetInputToFlatRoleTargetToCreate", {
    enumerable: true,
    get: function() {
        return fromCreateRoleTargetInputToFlatRoleTargetToCreate;
    }
});
const _utils = require("twenty-shared/utils");
const _uuid = require("uuid");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _resolveentityrelationuniversalidentifiersutil = require("../../flat-entity/utils/resolve-entity-relation-universal-identifiers.util");
const _findflatroletargetfromforeignkeyutil = require("../../flat-role-target/utils/find-flat-role-target-from-foreign-key.util");
const fromCreateRoleTargetInputToFlatRoleTargetToCreate = ({ createRoleTargetInput, workspaceId, flatRoleTargetMaps, flatRoleMaps, flatAgentMaps, flatApplication })=>{
    const now = new Date();
    const { roleId, targetId, targetMetadataForeignKey, universalIdentifier } = createRoleTargetInput;
    const { roleUniversalIdentifier } = (0, _resolveentityrelationuniversalidentifiersutil.resolveEntityRelationUniversalIdentifiers)({
        metadataName: 'roleTarget',
        foreignKeyValues: {
            roleId
        },
        flatEntityMaps: {
            flatRoleMaps
        }
    });
    const agentUniversalIdentifier = targetMetadataForeignKey === 'agentId' ? (0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
        flatEntityMaps: flatAgentMaps,
        flatEntityId: targetId
    }).universalIdentifier : null;
    const flatRoleTargetToCreate = {
        id: (0, _uuid.v4)(),
        roleId,
        roleUniversalIdentifier,
        userWorkspaceId: null,
        agentId: null,
        agentUniversalIdentifier,
        apiKeyId: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        universalIdentifier: universalIdentifier ?? (0, _uuid.v4)(),
        workspaceId,
        applicationId: flatApplication.id,
        applicationUniversalIdentifier: flatApplication.universalIdentifier,
        [targetMetadataForeignKey]: targetId
    };
    const flatRoleTargetToDelete = (0, _findflatroletargetfromforeignkeyutil.findFlatRoleTargetFromForeignKey)({
        flatRoleTargetMaps,
        targetMetadataForeignKey,
        targetId
    });
    return {
        flatRoleTargetToCreate: flatRoleTargetToCreate,
        flatRoleTargetsToDelete: (0, _utils.isDefined)(flatRoleTargetToDelete) ? [
            flatRoleTargetToDelete
        ] : []
    };
};

//# sourceMappingURL=from-create-role-target-input-to-flat-role-target-to-create.util.js.map