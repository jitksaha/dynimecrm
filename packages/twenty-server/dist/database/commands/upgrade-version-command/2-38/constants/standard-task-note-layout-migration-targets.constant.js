"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_TASK_NOTE_LAYOUT_MIGRATION_TARGETS", {
    enumerable: true,
    get: function() {
        return STANDARD_TASK_NOTE_LAYOUT_MIGRATION_TARGETS;
    }
});
const _application = require("twenty-shared/application");
const _metadata = require("twenty-shared/metadata");
const getWidgetUniversalIdentifiers = (pageLayoutIdentifiers, tabUniversalIdentifiers)=>Object.values(pageLayoutIdentifiers.tabs).filter(({ universalIdentifier })=>tabUniversalIdentifiers.includes(universalIdentifier)).flatMap(({ widgets })=>Object.values(widgets).map(({ universalIdentifier })=>universalIdentifier));
const getLegacyViewFieldUniversalIdentifiers = ({ fieldsViewUniversalIdentifier, removedFieldUniversalIdentifiers })=>removedFieldUniversalIdentifiers.map((fieldMetadataUniversalIdentifier)=>(0, _application.getSystemViewFieldUniversalIdentifier)({
            fieldMetadataApplicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            fieldMetadataUniversalIdentifier,
            viewUniversalIdentifier: fieldsViewUniversalIdentifier
        }));
const buildTargetLayout = ({ label, pageLayoutIdentifiers, fieldsViewIdentifiers, removedTabUniversalIdentifiers, removedFieldUniversalIdentifiers })=>{
    const preMigrationTabUniversalIdentifiers = Object.values(pageLayoutIdentifiers.tabs).map(({ universalIdentifier })=>universalIdentifier);
    const postMigrationTabUniversalIdentifiers = preMigrationTabUniversalIdentifiers.filter((universalIdentifier)=>!removedTabUniversalIdentifiers.includes(universalIdentifier));
    const postMigrationViewFieldUniversalIdentifiers = Object.values(fieldsViewIdentifiers.viewFields).map(({ universalIdentifier })=>universalIdentifier);
    const removedViewFieldUniversalIdentifiers = getLegacyViewFieldUniversalIdentifiers({
        fieldsViewUniversalIdentifier: fieldsViewIdentifiers.universalIdentifier,
        removedFieldUniversalIdentifiers
    });
    const postMigrationViewFieldGroupUniversalIdentifiers = Object.values(fieldsViewIdentifiers.viewFieldGroups).map(({ universalIdentifier })=>universalIdentifier);
    const removedViewFieldGroupUniversalIdentifiers = [
        (0, _application.getSystemViewFieldGroupUniversalIdentifier)({
            name: 'System',
            objectMetadataApplicationUniversalIdentifier: _application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER,
            viewUniversalIdentifier: fieldsViewIdentifiers.universalIdentifier
        })
    ];
    return {
        label,
        pageLayoutUniversalIdentifier: pageLayoutIdentifiers.universalIdentifier,
        fieldsViewUniversalIdentifier: fieldsViewIdentifiers.universalIdentifier,
        preMigrationTabUniversalIdentifiers,
        postMigrationTabUniversalIdentifiers,
        preMigrationWidgetUniversalIdentifiers: getWidgetUniversalIdentifiers(pageLayoutIdentifiers, preMigrationTabUniversalIdentifiers),
        postMigrationWidgetUniversalIdentifiers: getWidgetUniversalIdentifiers(pageLayoutIdentifiers, postMigrationTabUniversalIdentifiers),
        preMigrationViewFieldUniversalIdentifiers: [
            ...postMigrationViewFieldUniversalIdentifiers,
            ...removedViewFieldUniversalIdentifiers
        ],
        postMigrationViewFieldUniversalIdentifiers,
        preMigrationViewFieldGroupUniversalIdentifiers: [
            ...postMigrationViewFieldGroupUniversalIdentifiers,
            ...removedViewFieldGroupUniversalIdentifiers
        ],
        postMigrationViewFieldGroupUniversalIdentifiers,
        removedTabUniversalIdentifiers,
        removedViewFieldUniversalIdentifiers,
        removedViewFieldGroupUniversalIdentifiers
    };
};
const TASK_LAYOUT_IDENTIFIERS = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.taskRecordPage;
const NOTE_LAYOUT_IDENTIFIERS = _metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.noteRecordPage;
const STANDARD_TASK_NOTE_LAYOUT_MIGRATION_TARGETS = [
    buildTargetLayout({
        label: 'Task',
        pageLayoutIdentifiers: TASK_LAYOUT_IDENTIFIERS,
        fieldsViewIdentifiers: _metadata.STANDARD_OBJECTS.task.views.taskRecordPageFields,
        removedTabUniversalIdentifiers: [
            TASK_LAYOUT_IDENTIFIERS.tabs.timeline.universalIdentifier,
            TASK_LAYOUT_IDENTIFIERS.tabs.files.universalIdentifier
        ],
        removedFieldUniversalIdentifiers: [
            _metadata.STANDARD_OBJECTS.task.fields.bodyV2.universalIdentifier,
            _metadata.STANDARD_OBJECTS.task.fields.createdAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.task.fields.createdBy.universalIdentifier,
            _metadata.STANDARD_OBJECTS.task.fields.updatedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.task.fields.updatedBy.universalIdentifier
        ]
    }),
    buildTargetLayout({
        label: 'Note',
        pageLayoutIdentifiers: NOTE_LAYOUT_IDENTIFIERS,
        fieldsViewIdentifiers: _metadata.STANDARD_OBJECTS.note.views.noteRecordPageFields,
        removedTabUniversalIdentifiers: [
            NOTE_LAYOUT_IDENTIFIERS.tabs.timeline.universalIdentifier,
            NOTE_LAYOUT_IDENTIFIERS.tabs.files.universalIdentifier
        ],
        removedFieldUniversalIdentifiers: [
            _metadata.STANDARD_OBJECTS.note.fields.bodyV2.universalIdentifier,
            _metadata.STANDARD_OBJECTS.note.fields.createdAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.note.fields.createdBy.universalIdentifier,
            _metadata.STANDARD_OBJECTS.note.fields.updatedAt.universalIdentifier,
            _metadata.STANDARD_OBJECTS.note.fields.updatedBy.universalIdentifier
        ]
    })
];

//# sourceMappingURL=standard-task-note-layout-migration-targets.constant.js.map