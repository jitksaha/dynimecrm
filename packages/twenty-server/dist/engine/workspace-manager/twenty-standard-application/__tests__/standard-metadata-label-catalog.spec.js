"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _guards = require("@sniptt/guards");
const _i18n = require("twenty-shared/i18n");
const _utils = require("twenty-shared/utils");
const _en = require("../../../core-modules/i18n/locales/generated/en");
const _getmetadataflatentitymapskeyutil = require("../../../metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _twentystandardapplicationallflatentitymapsconstant = require("../utils/twenty-standard-application-all-flat-entity-maps.constant");
const _i18nlabelutil = require("../utils/i18n-label.util");
const _standardtimelineactivitytypedefinitionsconstant = require("../../../metadata-modules/timeline-activity-type/constants/standard-timeline-activity-type-definitions.constant");
// The read path resolves every standard metadata label through
// generateMessageId(value, `${metadataName}.${property}`), while authoring
// repeats that context as a literal on each msg site -- lingui extraction
// cannot evaluate a call. This spec is what pins the two together: it mints
// the standard application and asserts the compiled catalog holds an entry at
// the exact id the read path will compute. A missing or misspelled context on
// any authoring site fails here instead of silently untranslating.
describe('standard metadata labels reach the catalog under their context', ()=>{
    const { allFlatEntityMaps } = (0, _twentystandardapplicationallflatentitymapsconstant.computeTwentyStandardApplicationAllFlatEntityMaps)({
        now: '2026-01-01T00:00:00.000Z',
        workspaceId: '20202020-0000-4000-8000-000000000000',
        twentyStandardApplicationId: '20202020-0000-4000-8000-000000000001'
    });
    const translatableMetadataNames = Object.keys(_i18n.TRANSLATABLE_PROPERTIES_BY_METADATA_NAME);
    const timelineActivityTypeMessageIdByLabel = new Map(_standardtimelineactivitytypedefinitionsconstant.STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS.map(({ label })=>[
            label.message,
            label.id
        ]));
    it.each(translatableMetadataNames)('%s', (metadataName)=>{
        const flatEntityMaps = allFlatEntityMaps[(0, _getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey)(metadataName)];
        if (!(0, _utils.isDefined)(flatEntityMaps)) {
            return;
        }
        const missing = [];
        for (const flatEntity of Object.values(flatEntityMaps.byUniversalIdentifier)){
            if (!(0, _utils.isDefined)(flatEntity)) {
                continue;
            }
            // FIELDS_WIDGET views back the record-page fields widget; their name is
            // engine plumbing and never displayed.
            if (metadataName === 'view' && flatEntity.type === 'FIELDS_WIDGET') {
                continue;
            }
            for (const property of _i18n.TRANSLATABLE_PROPERTIES_BY_METADATA_NAME[metadataName]){
                const value = flatEntity[property];
                if (!(0, _guards.isNonEmptyString)(value)) {
                    continue;
                }
                // A value that is nothing but placeholders ({objectLabelPlural} as a
                // whole short label) has no words to translate.
                if (value.replace(/\{\w+\}/g, '').trim() === '') {
                    continue;
                }
                const context = (0, _i18n.getMetadataLabelContext)(metadataName, property);
                const messageId = (0, _i18n.generateMessageId)(value, context);
                // Translation catalogs are generated after source changes, by the
                // i18n pipeline, and are not committed alongside them. The source
                // descriptor still proves that the label uses the exact context
                // expected by the read path before that pipeline catches up: labels
                // authored through i18nLabel register their macro-computed id, and
                // timeline labels expose it on their definition.
                const sourceMessageId = metadataName === 'timelineActivityType' && property === 'label' ? timelineActivityTypeMessageIdByLabel.get(value) : undefined;
                if (!(messageId in _en.messages) && !_i18nlabelutil.AUTHORED_STANDARD_METADATA_MESSAGE_IDS.has(messageId) && sourceMessageId !== messageId) {
                    missing.push(`(${context}) ${value}`);
                }
            }
        }
        expect(missing).toEqual([]);
    });
});

//# sourceMappingURL=standard-metadata-label-catalog.spec.js.map