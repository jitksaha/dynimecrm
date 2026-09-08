"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildEmailStepLog", {
    enumerable: true,
    get: function() {
        return buildEmailStepLog;
    }
});
const _truncatestringtoutf8bytebudgetutil = require("../../../../../../utils/truncate-string-to-utf8-byte-budget.util");
const MAX_BODY_PREVIEW_BYTES = 8_000;
const splitRecipients = (raw)=>{
    if (raw === undefined || raw === null) {
        return [];
    }
    return raw.split(/[,;]/).map((entry)=>entry.trim()).filter((entry)=>entry.length > 0);
};
const isStringArray = (value)=>Array.isArray(value) && value.every((item)=>typeof item === 'string');
const pickRecipients = (inputValue, outputValue)=>{
    if (isStringArray(outputValue)) {
        return outputValue;
    }
    return splitRecipients(inputValue);
};
const truncateBody = (body)=>{
    if (body === undefined || body === null || body.length === 0) {
        return {
            bodyPreview: undefined,
            bodyBytes: undefined,
            bodyTruncated: false
        };
    }
    const { value, originalBytes, truncated } = (0, _truncatestringtoutf8bytebudgetutil.truncateStringToUtf8ByteBudget)(body, MAX_BODY_PREVIEW_BYTES);
    return {
        bodyPreview: value,
        bodyBytes: originalBytes,
        bodyTruncated: truncated
    };
};
const extractString = (output, key)=>{
    if (!output.result || typeof output.result !== 'object') {
        return undefined;
    }
    const value = output.result[key];
    return typeof value === 'string' ? value : undefined;
};
const extractNumber = (output, key)=>{
    if (!output.result || typeof output.result !== 'object') {
        return undefined;
    }
    const value = output.result[key];
    return typeof value === 'number' ? value : undefined;
};
const extractRecipientsField = (output, key)=>{
    if (!output.result || typeof output.result !== 'object') {
        return undefined;
    }
    return output.result[key];
};
const buildEmailStepLog = ({ mode, input, output, durationMs })=>{
    const to = pickRecipients(input.recipients?.to, extractRecipientsField(output, 'recipients'));
    const cc = pickRecipients(input.recipients?.cc, extractRecipientsField(output, 'ccRecipients'));
    const bcc = pickRecipients(input.recipients?.bcc, extractRecipientsField(output, 'bccRecipients'));
    const subject = extractString(output, 'subject') ?? input.subject;
    const connectedAccountId = extractString(output, 'connectedAccountId') ?? input.connectedAccountId;
    const attachmentCount = extractNumber(output, 'attachmentCount');
    const bodyForLog = extractString(output, 'sanitizedHtmlBody') ?? extractString(output, 'plainTextBody') ?? input.body;
    const body = truncateBody(bodyForLog);
    return {
        details: {
            type: 'EMAIL',
            mode,
            status: output.success ? 'SUCCESS' : 'ERROR',
            recipients: {
                to,
                cc: cc.length > 0 ? cc : undefined,
                bcc: bcc.length > 0 ? bcc : undefined
            },
            subject,
            bodyPreview: body.bodyPreview,
            bodyBytes: body.bodyBytes,
            bodyTruncated: body.bodyTruncated,
            connectedAccountId,
            fromHandle: input.fromHandle,
            attachmentCount,
            inReplyTo: input.inReplyTo,
            error: output.error,
            durationMs
        },
        entries: [],
        sizeBytes: 0
    };
};

//# sourceMappingURL=build-email-step-log.util.js.map