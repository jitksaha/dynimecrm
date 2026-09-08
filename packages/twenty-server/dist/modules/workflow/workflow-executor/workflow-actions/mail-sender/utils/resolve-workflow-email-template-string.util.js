"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveWorkflowEmailTemplateString", {
    enumerable: true,
    get: function() {
        return resolveWorkflowEmailTemplateString;
    }
});
const _utils = require("twenty-shared/utils");
const _escapehtmlutil = require("../../../../../../engine/core-modules/emailing-domain/utils/escape-html.util");
const WORKFLOW_VARIABLE_PATTERN = /\{\{[^{}]+\}\}/g;
const stringifyResolvedValue = (value)=>{
    if (value === null || value === undefined) {
        return '';
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
};
const resolveWorkflowEmailTemplateString = (value, context, { escapeValues })=>value.replace(WORKFLOW_VARIABLE_PATTERN, (variable)=>{
        const resolvedValue = stringifyResolvedValue((0, _utils.evalFromContext)(variable, context));
        return escapeValues ? (0, _escapehtmlutil.escapeHtml)(resolvedValue) : resolvedValue;
    });

//# sourceMappingURL=resolve-workflow-email-template-string.util.js.map