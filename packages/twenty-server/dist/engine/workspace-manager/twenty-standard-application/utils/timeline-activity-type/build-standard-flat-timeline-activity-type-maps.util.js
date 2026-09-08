"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildStandardFlatTimelineActivityTypeMaps", {
    enumerable: true,
    get: function() {
        return buildStandardFlatTimelineActivityTypeMaps;
    }
});
const _uuid = require("uuid");
const _createemptyflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _addflatentitytoflatentitymapsorthrowutil = require("../../../../metadata-modules/flat-entity/utils/add-flat-entity-to-flat-entity-maps-or-throw.util");
const _standardtimelineactivitytypedefinitionsconstant = require("../../../../metadata-modules/timeline-activity-type/constants/standard-timeline-activity-type-definitions.constant");
const _timelineactivitytypeentity = require("../../../../metadata-modules/timeline-activity-type/entities/timeline-activity-type.entity");
const _upgradeawarerepositorystate = require("../../../../twenty-orm/upgrade-aware/upgrade-aware-repository-state");
const _twentystandardapplications = require("../../constants/twenty-standard-applications");
const _i18nlabelutil = require("../i18n-label.util");
const buildStandardFlatTimelineActivityTypeMaps = ({ now, workspaceId, twentyStandardApplicationId, hiddenTimelineActivityTypeColumnPropertyNames = _upgradeawarerepositorystate.UpgradeAwareRepositoryState.getInstance().getHiddenColumnPropertyNames(_timelineactivitytypeentity.TimelineActivityTypeEntity) })=>{
    let flatTimelineActivityTypeMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
    for (const definition of _standardtimelineactivitytypedefinitionsconstant.STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS){
        flatTimelineActivityTypeMaps = (0, _addflatentitytoflatentitymapsorthrowutil.addFlatEntityToFlatEntityMapsOrThrow)({
            flatEntity: {
                id: (0, _uuid.v4)(),
                name: definition.name,
                label: (0, _i18nlabelutil.i18nLabel)(definition.label),
                action: definition.emit.on,
                icon: definition.icon,
                frontComponentUniversalIdentifier: hiddenTimelineActivityTypeColumnPropertyNames.has('frontComponentUniversalIdentifier') ? null : definition.frontComponentUniversalIdentifier,
                objectUniversalIdentifier: definition.emit.objectUniversalIdentifier,
                targetRelationFieldUniversalIdentifier: hiddenTimelineActivityTypeColumnPropertyNames.has('targetRelationFieldUniversalIdentifier') ? null : definition.emit.through?.relationFieldUniversalIdentifier ?? null,
                triggerFieldUniversalIdentifiers: hiddenTimelineActivityTypeColumnPropertyNames.has('triggerFieldUniversalIdentifiers') ? null : definition.emit.through?.triggerFieldUniversalIdentifiers ?? null,
                happensAtFieldUniversalIdentifier: hiddenTimelineActivityTypeColumnPropertyNames.has('happensAtFieldUniversalIdentifier') ? null : definition.emit.through?.happensAtFieldUniversalIdentifier ?? null,
                replacesTimelineActivityTypeUniversalIdentifier: null,
                isActive: true,
                overrides: null,
                workspaceId,
                applicationId: twentyStandardApplicationId,
                universalIdentifier: definition.universalIdentifier,
                applicationUniversalIdentifier: _twentystandardapplications.TWENTY_STANDARD_APPLICATION.universalIdentifier,
                createdAt: now,
                updatedAt: now
            },
            flatEntityMaps: flatTimelineActivityTypeMaps
        });
    }
    return flatTimelineActivityTypeMaps;
};

//# sourceMappingURL=build-standard-flat-timeline-activity-type-maps.util.js.map