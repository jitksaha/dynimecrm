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
    get buildTargetFieldCollisionRenameUpdates () {
        return buildTargetFieldCollisionRenameUpdates;
    },
    get buildTargetObjectCollisionRenameUpdates () {
        return buildTargetObjectCollisionRenameUpdates;
    }
});
const _metadata = require("twenty-shared/metadata");
const _utils = require("twenty-shared/utils");
const MAX_RENAME_ATTEMPTS = 100;
const TARGET_OBJECT_DEFINITIONS = [
    {
        universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEventTarget.universalIdentifier,
        nameSingular: 'calendarEventTarget',
        namePlural: 'calendarEventTargets'
    },
    {
        universalIdentifier: _metadata.STANDARD_OBJECTS.messageThreadTarget.universalIdentifier,
        nameSingular: 'messageThreadTarget',
        namePlural: 'messageThreadTargets'
    }
];
const TARGET_OBJECT_UNIVERSAL_IDENTIFIERS = new Set(TARGET_OBJECT_DEFINITIONS.map(({ universalIdentifier })=>universalIdentifier));
const TARGET_OBJECT_NAMES = new Set(TARGET_OBJECT_DEFINITIONS.flatMap(({ nameSingular, namePlural })=>[
        nameSingular,
        namePlural
    ]));
const TARGET_RELATION_FIELD_DEFINITIONS = [
    {
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        universalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventTargets.universalIdentifier,
        name: 'calendarEventTargets'
    },
    {
        objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.messageThread.universalIdentifier,
        universalIdentifier: _metadata.STANDARD_OBJECTS.messageThread.fields.messageThreadTargets.universalIdentifier,
        name: 'messageThreadTargets'
    },
    ...[
        'person',
        'company',
        'opportunity'
    ].flatMap((objectName)=>[
            {
                objectUniversalIdentifier: _metadata.STANDARD_OBJECTS[objectName].universalIdentifier,
                universalIdentifier: _metadata.STANDARD_OBJECTS[objectName].fields.calendarEventTargets.universalIdentifier,
                name: 'calendarEventTargets'
            },
            {
                objectUniversalIdentifier: _metadata.STANDARD_OBJECTS[objectName].universalIdentifier,
                universalIdentifier: _metadata.STANDARD_OBJECTS[objectName].fields.messageThreadTargets.universalIdentifier,
                name: 'messageThreadTargets'
            }
        ])
];
const findAvailableName = ({ baseName, takenNames })=>{
    for(let attempt = 0; attempt < MAX_RENAME_ATTEMPTS; attempt++){
        const suffix = attempt === 0 ? 'Old' : `Old${attempt + 1}`;
        const candidate = `${baseName}${suffix}`;
        if (!takenNames.has(candidate)) {
            takenNames.add(candidate);
            return candidate;
        }
    }
    throw new Error(`Could not find an available old name for ${baseName} after ${MAX_RENAME_ATTEMPTS} attempts`);
};
const buildTargetObjectCollisionRenameUpdates = ({ flatObjectMetadataMaps, now })=>{
    const allObjects = Object.values(flatObjectMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined);
    const takenNames = new Set(allObjects.flatMap(({ nameSingular, namePlural })=>[
            nameSingular,
            namePlural
        ]));
    return allObjects.filter((objectMetadata)=>!TARGET_OBJECT_UNIVERSAL_IDENTIFIERS.has(objectMetadata.universalIdentifier) && [
            objectMetadata.nameSingular,
            objectMetadata.namePlural
        ].some((name)=>TARGET_OBJECT_NAMES.has(name))).map((objectMetadata)=>({
            ...objectMetadata,
            nameSingular: findAvailableName({
                baseName: objectMetadata.nameSingular,
                takenNames
            }),
            namePlural: findAvailableName({
                baseName: objectMetadata.namePlural,
                takenNames
            }),
            labelSingular: `${objectMetadata.labelSingular} (Old)`,
            labelPlural: `${objectMetadata.labelPlural} (Old)`,
            isLabelSyncedWithName: false,
            updatedAt: now
        }));
};
const buildTargetFieldCollisionRenameUpdates = ({ flatFieldMetadataMaps, now })=>{
    const allFields = Object.values(flatFieldMetadataMaps.byUniversalIdentifier).filter(_utils.isDefined);
    const takenNamesByObjectUniversalIdentifier = new Map();
    for (const fieldMetadata of allFields){
        const takenNames = takenNamesByObjectUniversalIdentifier.get(fieldMetadata.objectMetadataUniversalIdentifier) ?? new Set();
        takenNames.add(fieldMetadata.name);
        takenNamesByObjectUniversalIdentifier.set(fieldMetadata.objectMetadataUniversalIdentifier, takenNames);
    }
    return TARGET_RELATION_FIELD_DEFINITIONS.flatMap((definition)=>allFields.filter((fieldMetadata)=>fieldMetadata.objectMetadataUniversalIdentifier === definition.objectUniversalIdentifier && fieldMetadata.universalIdentifier !== definition.universalIdentifier && fieldMetadata.name === definition.name).map((fieldMetadata)=>({
                ...fieldMetadata,
                name: findAvailableName({
                    baseName: definition.name,
                    takenNames: takenNamesByObjectUniversalIdentifier.get(definition.objectUniversalIdentifier) ?? new Set()
                }),
                label: `${fieldMetadata.label} (Old)`,
                isLabelSyncedWithName: false,
                updatedAt: now
            })));
};

//# sourceMappingURL=build-target-metadata-collision-renames.util.js.map