"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeApplicationTranslationSyncPlan", {
    enumerable: true,
    get: function() {
        return computeApplicationTranslationSyncPlan;
    }
});
const _utils = require("twenty-shared/utils");
// A soft-deleted row is preferred over none, so a locale that comes back is
// revived rather than duplicated.
const pickRowByLocale = (existingRows)=>{
    const rowByLocale = new Map();
    for (const row of existingRows){
        const currentRow = rowByLocale.get(row.locale);
        const shouldPreferRow = !(0, _utils.isDefined)(currentRow) || (0, _utils.isDefined)(currentRow.deletedAt) && !(0, _utils.isDefined)(row.deletedAt);
        if (shouldPreferRow) {
            rowByLocale.set(row.locale, row);
        }
    }
    return rowByLocale;
};
const computeApplicationTranslationSyncPlan = ({ existingRows, translations })=>{
    const rowByLocale = pickRowByLocale(existingRows);
    const manifestEntries = Object.entries(translations);
    const manifestLocales = new Set(manifestEntries.map(([locale])=>locale));
    const rowsToUpdate = manifestEntries.map(([locale, messages])=>{
        const existingRow = rowByLocale.get(locale);
        return (0, _utils.isDefined)(existingRow) ? {
            id: existingRow.id,
            messages
        } : undefined;
    }).filter(_utils.isDefined);
    const rowsToInsert = manifestEntries.filter(([locale])=>!(0, _utils.isDefined)(rowByLocale.get(locale))).map(([locale, messages])=>({
            locale,
            messages
        }));
    const rowIdsToSoftDelete = existingRows.filter((row)=>!manifestLocales.has(row.locale) && !(0, _utils.isDefined)(row.deletedAt)).map((row)=>row.id);
    return {
        rowsToUpdate,
        rowsToInsert,
        rowIdsToSoftDelete
    };
};

//# sourceMappingURL=compute-application-translation-sync-plan.util.js.map