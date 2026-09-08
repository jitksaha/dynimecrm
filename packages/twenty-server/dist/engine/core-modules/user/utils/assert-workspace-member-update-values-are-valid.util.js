"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "assertWorkspaceMemberUpdateValuesAreValid", {
    enumerable: true,
    get: function() {
        return assertWorkspaceMemberUpdateValuesAreValid;
    }
});
const _constants = require("twenty-shared/constants");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
// Enum-like TEXT fields whose values would otherwise be persisted unchecked,
// then cast to a client-side union.
const WORKSPACE_MEMBER_FIELD_ALLOWED_VALUES = {
    uiScale: new Set(_constants.UI_SCALE_VALUES)
};
const assertWorkspaceMemberUpdateValuesAreValid = ({ update })=>{
    for (const [fieldName, allowedValues] of Object.entries(WORKSPACE_MEMBER_FIELD_ALLOWED_VALUES)){
        if (!(fieldName in update)) {
            continue;
        }
        const value = update[fieldName];
        if (typeof value !== 'string' || !allowedValues.has(value)) {
            throw new _graphqlerrorsutil.UserInputError(`Invalid value for workspaceMember field ${fieldName}: ${String(value)}`, {
                userFriendlyMessage: /*i18n*/ {
                    id: "gKGO2f",
                    message: '"{fieldName}" received an invalid value.',
                    values: {
                        fieldName: fieldName
                    }
                }
            });
        }
    }
};

//# sourceMappingURL=assert-workspace-member-update-values-are-valid.util.js.map