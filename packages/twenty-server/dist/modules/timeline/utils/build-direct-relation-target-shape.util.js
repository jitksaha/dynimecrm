"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildDirectRelationTargetShape", {
    enumerable: true,
    get: function() {
        return buildDirectRelationTargetShape;
    }
});
const _types = require("twenty-shared/types");
const _isfieldmetadatasettingsoftypeutil = require("../../../engine/metadata-modules/field-metadata/utils/is-field-metadata-settings-of-type.util");
const _buildtimelineactivitytargetjoincolumnsutil = require("./build-timeline-activity-target-join-columns.util");
const buildDirectRelationTargetShape = ({ relationFlatFieldMetadata, flatObjectMetadataMaps, flatFieldMetadataMaps })=>{
    const { settings, type } = relationFlatFieldMetadata;
    if (type !== _types.FieldMetadataType.RELATION && type !== _types.FieldMetadataType.MORPH_RELATION || !(0, _isfieldmetadatasettingsoftypeutil.isFieldMetadataSettingsOfType)(settings, type) || settings.relationType !== _types.RelationType.MANY_TO_ONE) {
        return undefined;
    }
    const targetJoinColumns = (0, _buildtimelineactivitytargetjoincolumnsutil.buildTimelineActivityTargetJoinColumns)({
        targetFlatFieldMetadata: relationFlatFieldMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    });
    return targetJoinColumns.length === 0 ? undefined : {
        kind: 'DIRECT_RELATION',
        targetJoinColumns
    };
};

//# sourceMappingURL=build-direct-relation-target-shape.util.js.map