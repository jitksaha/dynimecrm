"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getCrudToolLabels", {
    enumerable: true,
    get: function() {
        return getCrudToolLabels;
    }
});
const _translations = require("twenty-shared/translations");
const _translatetoollabelutil = require("./translate-tool-label.util");
const OPERATION_VERBS = {
    find_many: /*i18n*/ {
        id: "A1taO8",
        message: "Search"
    },
    find_one: /*i18n*/ {
        id: "KujtjC",
        message: "Find"
    },
    group_by: /*i18n*/ {
        id: "L8fEEm",
        message: "Group"
    },
    create_one: /*i18n*/ {
        id: "hYgDIe",
        message: "Create"
    },
    create_many: /*i18n*/ {
        id: "hYgDIe",
        message: "Create"
    },
    update_one: /*i18n*/ {
        id: "EkH9pt",
        message: "Update"
    },
    update_many: /*i18n*/ {
        id: "EkH9pt",
        message: "Update"
    },
    upsert_many: /*i18n*/ {
        id: "waPPpZ",
        message: "Upsert"
    },
    delete_one: /*i18n*/ {
        id: "cnGeoo",
        message: "Delete"
    },
    delete_many: /*i18n*/ {
        id: "cnGeoo",
        message: "Delete"
    }
};
const getCrudToolLabels = (operation, objectLabel, i18nService, locale)=>{
    const i18n = i18nService.getI18nInstance(locale ?? _translations.SOURCE_LOCALE);
    const verb = OPERATION_VERBS[operation];
    const object = (0, _translatetoollabelutil.translateToolLabel)(objectLabel, i18nService, locale).toLocaleLowerCase(locale);
    return {
        label: `${i18n._(verb)} ${object}`
    };
};

//# sourceMappingURL=get-crud-tool-label.util.js.map