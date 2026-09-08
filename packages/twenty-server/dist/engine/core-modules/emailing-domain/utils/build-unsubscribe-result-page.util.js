"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildUnsubscribeResultPage", {
    enumerable: true,
    get: function() {
        return buildUnsubscribeResultPage;
    }
});
const _escapehtmlutil = require("./escape-html.util");
const PAGE_STYLE = `body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fafafa;margin:0;padding:48px 16px;color:#1a1a1a;text-align:center}.card{max-width:420px;margin:0 auto;background:#fff;border:1px solid #ededed;border-radius:16px;padding:48px 32px}h1{font-size:24px;font-weight:700;margin:0 0 8px}p{color:#888;margin:0}`;
const buildUnsubscribeResultPage = (title, message)=>`<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${(0, _escapehtmlutil.escapeHtml)(title)}</title><style>${PAGE_STYLE}</style></head><body><div class="card"><h1>${(0, _escapehtmlutil.escapeHtml)(title)}</h1><p>${(0, _escapehtmlutil.escapeHtml)(message)}</p></div></body></html>`;

//# sourceMappingURL=build-unsubscribe-result-page.util.js.map