"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createUpsertRowLevelPermissionRulesTool", {
    enumerable: true,
    get: function() {
        return createUpsertRowLevelPermissionRulesTool;
    }
});
const _types = require("twenty-shared/types");
const _zod = require("zod");
const _toroletoolerrormessageutil = require("./utils/to-role-tool-error-message.util");
const predicateValueSchema = _zod.z.union([
    _zod.z.string(),
    _zod.z.array(_zod.z.string()),
    _zod.z.boolean(),
    _zod.z.number(),
    _zod.z.record(_zod.z.string(), _zod.z.unknown()),
    _zod.z.null()
]).optional().describe('Static value to compare the field against. Omit when using workspaceMemberFieldMetadataId or a value-less operand (IS_EMPTY, IS_IN_PAST, ...).');
const rowLevelPermissionPredicateSchema = _zod.z.object({
    id: _zod.z.uuid().optional().describe('Id of an existing predicate to update. Omit to create a new one.'),
    fieldMetadataId: _zod.z.uuid().describe('Id of the field (on the target object) the rule filters on'),
    operand: _zod.z.enum(_types.RowLevelPermissionPredicateOperand).describe('Comparison operator'),
    value: predicateValueSchema,
    subFieldName: _zod.z.string().nullable().optional().describe('Sub-field for composite fields (e.g. "firstName" of a FULL_NAME field)'),
    workspaceMemberFieldMetadataId: _zod.z.uuid().nullable().optional().describe('Dynamic comparison: id of a field on the workspaceMember object whose value for the CURRENT user is substituted at query time. Use the workspaceMember "id" field to express "matches the current user".'),
    workspaceMemberSubFieldName: _zod.z.string().nullable().optional().describe('Sub-field of the workspace member field when it is a composite field'),
    rowLevelPermissionPredicateGroupId: _zod.z.uuid().nullable().optional().describe('Id of the predicate group this predicate belongs to'),
    positionInRowLevelPermissionPredicateGroup: _zod.z.number().nullable().optional().describe('Position of this predicate within its group')
});
const rowLevelPermissionPredicateGroupSchema = _zod.z.object({
    id: _zod.z.uuid().optional().describe('Group id. Pass an existing id to update a group, or a new client-generated UUID so predicates can reference the group via rowLevelPermissionPredicateGroupId.'),
    logicalOperator: _zod.z.enum(_types.RowLevelPermissionPredicateGroupLogicalOperator).describe('How predicates inside this group are combined (AND / OR)'),
    parentRowLevelPermissionPredicateGroupId: _zod.z.uuid().nullable().optional().describe('Parent group id for nested groups'),
    positionInRowLevelPermissionPredicateGroup: _zod.z.number().nullable().optional().describe('Position of this group within its parent')
});
const upsertRowLevelPermissionRulesSchema = _zod.z.object({
    roleId: _zod.z.uuid().describe('Id of the role the rules apply to'),
    objectMetadataId: _zod.z.uuid().describe('Id of the object the rules restrict'),
    predicates: _zod.z.array(rowLevelPermissionPredicateSchema).describe('The complete list of predicates to keep for this role and object. Existing predicates omitted from the list are deleted; pass an empty array to remove all rules.'),
    predicateGroups: _zod.z.array(rowLevelPermissionPredicateGroupSchema).describe('The complete list of predicate groups to keep for this role and object. Existing groups omitted from the list are deleted.')
});
const createUpsertRowLevelPermissionRulesTool = (deps, context)=>({
        name: 'upsert_row_level_permission_rules',
        description: `Set row-level permission rules restricting which records members with a role can see on a given object (enterprise feature).

Example, "members with this role only see records where the owner field matches the current user": pass one predicate with fieldMetadataId = the owner field on the object, operand = IS, and workspaceMemberFieldMetadataId = the "id" field of the workspaceMember object (resolved to the current user at query time). Use metadata tools to look up field ids.
Combine several predicates with predicateGroups (AND / OR): give each new group a client-generated UUID and reference it from predicates via rowLevelPermissionPredicateGroupId.
IMPORTANT: this replaces the full rule set for the role + object. Predicates or groups omitted from the lists are deleted; empty lists clear all rules. System-managed roles (like Admin) cannot be changed.`,
        inputSchema: upsertRowLevelPermissionRulesSchema,
        execute: async (parameters)=>{
            try {
                const { predicates, predicateGroups } = await deps.rowLevelPermissionPredicateService.upsertRowLevelPermissionPredicates({
                    workspaceId: context.workspaceId,
                    input: {
                        roleId: parameters.roleId,
                        objectMetadataId: parameters.objectMetadataId,
                        predicates: parameters.predicates,
                        predicateGroups: parameters.predicateGroups.map((predicateGroup)=>({
                                ...predicateGroup,
                                objectMetadataId: parameters.objectMetadataId
                            }))
                    }
                });
                return {
                    success: true,
                    message: `Row-level permission rules updated (${predicates.length} predicate${predicates.length === 1 ? '' : 's'}, ${predicateGroups.length} group${predicateGroups.length === 1 ? '' : 's'})`,
                    result: {
                        predicates,
                        predicateGroups
                    }
                };
            } catch (error) {
                const message = (0, _toroletoolerrormessageutil.toRoleToolErrorMessage)(error);
                return {
                    success: false,
                    message: `Failed to upsert row-level permission rules: ${message}`,
                    error: message
                };
            }
        }
    });

//# sourceMappingURL=upsert-row-level-permission-rules.tool.js.map