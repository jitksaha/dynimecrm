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
    get ACTION_TOOL_IDS () {
        return ACTION_TOOL_IDS;
    },
    get ACTION_TOOL_LABELS () {
        return ACTION_TOOL_LABELS;
    }
});
const _i18nlabelutil = require("../../../workspace-manager/twenty-standard-application/utils/i18n-label.util");
const ACTION_TOOL_IDS = [
    'http_request',
    'send_email',
    'draft_email',
    'create_calendar_event',
    'search_help_center',
    'code_interpreter',
    'navigate_app',
    'save_campaign'
];
const ACTION_TOOL_LABELS = {
    http_request: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "DvpBQM",
            message: "HTTP Request"
        })
    },
    send_email: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "i/TzEU",
            message: "Send Email"
        })
    },
    draft_email: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "43Mh2+",
            message: "Draft Email"
        })
    },
    create_calendar_event: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "fbe2ik",
            message: "Create Calendar Event"
        })
    },
    search_help_center: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "K3jNeK",
            message: "Search Help Center"
        })
    },
    code_interpreter: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "T9qjpu",
            message: "Code Interpreter"
        })
    },
    navigate_app: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "zL+3RN",
            message: "Navigate App"
        })
    },
    save_campaign: {
        label: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
            id: "H2SymB",
            message: "Save Campaign"
        })
    }
};

//# sourceMappingURL=action-tool-label.constant.js.map