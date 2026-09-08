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
    get FLAT_FIELD_METADATA_EDITABLE_PROPERTIES () {
        return FLAT_FIELD_METADATA_EDITABLE_PROPERTIES;
    },
    get FLAT_FIELD_METADATA_SYSTEM_SIDE_EFFECT_EDITABLE_PROPERTIES () {
        return FLAT_FIELD_METADATA_SYSTEM_SIDE_EFFECT_EDITABLE_PROPERTIES;
    }
});
const FLAT_FIELD_METADATA_EDITABLE_PROPERTIES = {
    custom: [
        'defaultValue',
        'description',
        'icon',
        'isActive',
        'isLabelSyncedWithName',
        'isUnique',
        'label',
        'name',
        'options',
        'settings'
    ],
    standard: [
        'defaultValue',
        'description',
        'icon',
        'isActive',
        'label',
        'options',
        'settings',
        'isUnique'
    ]
};
const FLAT_FIELD_METADATA_SYSTEM_SIDE_EFFECT_EDITABLE_PROPERTIES = [
    'isActive'
];

//# sourceMappingURL=flat-field-metadata-editable-properties.constant.js.map