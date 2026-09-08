"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS", {
    enumerable: true,
    get: function() {
        return STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS;
    }
});
const _metadata = require("twenty-shared/metadata");
const _timeline = require("twenty-shared/timeline");
// Standard wildcard emitters supply platform fallbacks when no object-specific
// type owns the slot. Application manifests require an object on every emitter.
const STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITION_SOURCES = [
    {
        name: 'recordCreated',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c01',
        label: /*i18n*/ {
            id: "vuzFx0",
            message: "was created by"
        },
        icon: 'IconCirclePlus',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'created',
            objectUniversalIdentifier: null
        }
    },
    {
        name: 'recordUpdated',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c02',
        label: /*i18n*/ {
            id: "7YsDpr",
            message: "updated"
        },
        icon: 'IconEditCircle',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'updated',
            objectUniversalIdentifier: null
        }
    },
    {
        name: 'recordDeleted',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c03',
        label: /*i18n*/ {
            id: "edc5Bh",
            message: "was deleted by"
        },
        icon: 'IconTrash',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'deleted',
            objectUniversalIdentifier: null
        }
    },
    {
        name: 'recordRestored',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c04',
        label: /*i18n*/ {
            id: "tKm/LA",
            message: "was restored by"
        },
        icon: 'IconRestore',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'restored',
            objectUniversalIdentifier: null
        }
    },
    {
        name: 'recordLinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c05',
        label: /*i18n*/ {
            id: "SfnmZe",
            message: "was linked by"
        },
        icon: 'IconLink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'linked',
            objectUniversalIdentifier: null
        }
    },
    {
        name: 'recordUnlinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c06',
        label: /*i18n*/ {
            id: "0i3MMx",
            message: "was unlinked by"
        },
        icon: 'IconUnlink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'unlinked',
            objectUniversalIdentifier: null
        }
    },
    {
        name: 'noteLinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c09',
        label: /*i18n*/ {
            id: "sAG9OB",
            message: "linked a related note"
        },
        icon: 'IconLink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'linked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier
            }
        }
    },
    {
        name: 'noteUnlinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0a',
        label: /*i18n*/ {
            id: "spJjXJ",
            message: "unlinked a related note"
        },
        icon: 'IconUnlink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'unlinked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier
            }
        }
    },
    {
        name: 'noteUpdated',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0b',
        label: /*i18n*/ {
            id: "Hp+aAn",
            message: "updated a related note"
        },
        icon: 'IconEditCircle',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'updated',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.note.fields.noteTargets.universalIdentifier,
                triggerFieldUniversalIdentifiers: [
                    _metadata.STANDARD_OBJECTS.note.fields.title.universalIdentifier
                ]
            }
        }
    },
    {
        name: 'taskLinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0c',
        label: /*i18n*/ {
            id: "ecrchg",
            message: "linked a related task"
        },
        icon: 'IconLink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'linked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.fields.taskTargets.universalIdentifier
            }
        }
    },
    {
        name: 'taskUnlinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0d',
        label: /*i18n*/ {
            id: "IYBfg3",
            message: "unlinked a related task"
        },
        icon: 'IconUnlink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'unlinked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.fields.taskTargets.universalIdentifier
            }
        }
    },
    {
        name: 'taskUpdated',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0e',
        label: /*i18n*/ {
            id: "FoQjXC",
            message: "updated a related task"
        },
        icon: 'IconEditCircle',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'updated',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.task.fields.taskTargets.universalIdentifier,
                triggerFieldUniversalIdentifiers: [
                    _metadata.STANDARD_OBJECTS.task.fields.title.universalIdentifier
                ]
            }
        }
    },
    {
        name: 'messageLinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c0f',
        label: /*i18n*/ {
            id: "ttuub1",
            message: "sent or received an email"
        },
        icon: 'IconMail',
        frontComponentUniversalIdentifier: _timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.message,
        emit: {
            on: 'linked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.fields.messageParticipants.universalIdentifier,
                happensAtFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.message.fields.receivedAt.universalIdentifier
            }
        }
    },
    {
        name: 'calendarEventLinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c10',
        label: /*i18n*/ {
            id: "mGHuob",
            message: "attended a calendar event"
        },
        icon: 'IconCalendar',
        frontComponentUniversalIdentifier: _timeline.STANDARD_TIMELINE_ACTIVITY_RENDERER_UNIVERSAL_IDENTIFIERS.calendarEvent,
        emit: {
            on: 'linked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.fields.calendarEventParticipants.universalIdentifier,
                happensAtFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.fields.startsAt.universalIdentifier
            }
        }
    },
    {
        name: 'attachmentLinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c11',
        label: /*i18n*/ {
            id: "QAZeXE",
            message: "attached a file"
        },
        icon: 'IconPaperclip',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'linked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.attachment.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.attachment.fields.targetPerson.universalIdentifier
            }
        }
    },
    {
        name: 'attachmentUnlinked',
        universalIdentifier: '20202020-0d1a-4f0e-8a55-1c0a2f0a2c12',
        label: /*i18n*/ {
            id: "bf8Nhj",
            message: "removed an attachment"
        },
        icon: 'IconUnlink',
        frontComponentUniversalIdentifier: null,
        emit: {
            on: 'unlinked',
            objectUniversalIdentifier: _metadata.STANDARD_OBJECTS.attachment.universalIdentifier,
            through: {
                relationFieldUniversalIdentifier: _metadata.STANDARD_OBJECTS.attachment.fields.targetPerson.universalIdentifier
            }
        }
    }
];
const STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITIONS = STANDARD_TIMELINE_ACTIVITY_TYPE_DEFINITION_SOURCES.map((definition)=>({
        ...definition,
        action: definition.emit.on,
        objectUniversalIdentifier: definition.emit.objectUniversalIdentifier,
        targetRelationFieldUniversalIdentifier: definition.emit.through?.relationFieldUniversalIdentifier,
        triggerFieldUniversalIdentifiers: definition.emit.through?.triggerFieldUniversalIdentifiers,
        happensAtFieldUniversalIdentifier: definition.emit.through?.happensAtFieldUniversalIdentifier
    }));

//# sourceMappingURL=standard-timeline-activity-type-definitions.constant.js.map