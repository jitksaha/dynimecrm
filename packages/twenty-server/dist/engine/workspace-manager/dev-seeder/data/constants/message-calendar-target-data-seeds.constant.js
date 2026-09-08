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
    get CALENDAR_EVENT_TARGET_DATA_SEED_COLUMNS () {
        return CALENDAR_EVENT_TARGET_DATA_SEED_COLUMNS;
    },
    get MESSAGE_THREAD_TARGET_DATA_SEED_COLUMNS () {
        return MESSAGE_THREAD_TARGET_DATA_SEED_COLUMNS;
    },
    get getCalendarEventTargetDataSeeds () {
        return getCalendarEventTargetDataSeeds;
    },
    get getMessageThreadTargetDataSeeds () {
        return getMessageThreadTargetDataSeeds;
    }
});
const _utils = require("twenty-shared/utils");
const _messagedataseedsconstant = require("./message-data-seeds.constant");
const _opportunitydataseedsconstant = require("./opportunity-data-seeds.constant");
const _persondataseedsconstant = require("./person-data-seeds.constant");
const MESSAGE_THREAD_TARGET_DATA_SEED_COLUMNS = [
    'id',
    'messageThreadId',
    'targetPersonId',
    'targetCompanyId',
    'targetOpportunityId',
    'isAutomaticallyAssigned',
    'isManuallyAssigned'
];
const CALENDAR_EVENT_TARGET_DATA_SEED_COLUMNS = [
    'id',
    'calendarEventId',
    'targetPersonId',
    'targetCompanyId',
    'targetOpportunityId',
    'isAutomaticallyAssigned',
    'isManuallyAssigned'
];
const COMPANY_ID_BY_PERSON_ID = new Map(_persondataseedsconstant.PERSON_DATA_SEEDS.map((person)=>[
        person.id,
        person.companyId
    ]));
const BUILD_OPPORTUNITY_IDS_BY_PERSON_ID = ()=>{
    const OPPORTUNITY_IDS_BY_PERSON_ID = new Map();
    for (const OPPORTUNITY of _opportunitydataseedsconstant.OPPORTUNITY_DATA_SEEDS){
        const OPPORTUNITY_IDS = OPPORTUNITY_IDS_BY_PERSON_ID.get(OPPORTUNITY.pointOfContactId) ?? [];
        OPPORTUNITY_IDS.push(OPPORTUNITY.id);
        OPPORTUNITY_IDS_BY_PERSON_ID.set(OPPORTUNITY.pointOfContactId, OPPORTUNITY_IDS);
    }
    return OPPORTUNITY_IDS_BY_PERSON_ID;
};
const OPPORTUNITY_IDS_BY_PERSON_ID = BUILD_OPPORTUNITY_IDS_BY_PERSON_ID();
const BUILD_TARGET_COLUMN_SETS = (personIds)=>{
    const TARGET_COLUMN_SETS = [];
    const COMPANY_IDS = new Set();
    const OPPORTUNITY_IDS = new Set();
    for (const PERSON_ID of personIds){
        TARGET_COLUMN_SETS.push({
            targetPersonId: PERSON_ID,
            targetCompanyId: null,
            targetOpportunityId: null
        });
        const COMPANY_ID = COMPANY_ID_BY_PERSON_ID.get(PERSON_ID);
        if ((0, _utils.isDefined)(COMPANY_ID)) {
            COMPANY_IDS.add(COMPANY_ID);
        }
        for (const OPPORTUNITY_ID of OPPORTUNITY_IDS_BY_PERSON_ID.get(PERSON_ID) ?? []){
            OPPORTUNITY_IDS.add(OPPORTUNITY_ID);
        }
    }
    for (const COMPANY_ID of COMPANY_IDS){
        TARGET_COLUMN_SETS.push({
            targetPersonId: null,
            targetCompanyId: COMPANY_ID,
            targetOpportunityId: null
        });
    }
    for (const OPPORTUNITY_ID of OPPORTUNITY_IDS){
        TARGET_COLUMN_SETS.push({
            targetPersonId: null,
            targetCompanyId: null,
            targetOpportunityId: OPPORTUNITY_ID
        });
    }
    return TARGET_COLUMN_SETS;
};
const GROUP_PERSON_IDS_BY_PARENT_ID = ({ participants, getParentId, getPersonId })=>{
    const PERSON_IDS_BY_PARENT_ID = new Map();
    for (const PARTICIPANT of participants){
        const PARENT_ID = getParentId(PARTICIPANT);
        const PERSON_ID = getPersonId(PARTICIPANT);
        if (!(0, _utils.isDefined)(PARENT_ID) || !(0, _utils.isDefined)(PERSON_ID)) {
            continue;
        }
        const PERSON_IDS = PERSON_IDS_BY_PARENT_ID.get(PARENT_ID) ?? new Set();
        PERSON_IDS.add(PERSON_ID);
        PERSON_IDS_BY_PARENT_ID.set(PARENT_ID, PERSON_IDS);
    }
    return PERSON_IDS_BY_PARENT_ID;
};
const BUILD_TARGET_SEEDS = ({ personIdsByParentId, createTargetSeed })=>{
    const TARGET_SEEDS = [];
    let TARGET_INDEX = 1;
    for (const [PARENT_ID, PERSON_IDS] of personIdsByParentId){
        for (const TARGET_COLUMNS of BUILD_TARGET_COLUMN_SETS(PERSON_IDS)){
            TARGET_SEEDS.push(createTargetSeed({
                index: TARGET_INDEX,
                parentId: PARENT_ID,
                targetColumns: TARGET_COLUMNS
            }));
            TARGET_INDEX++;
        }
    }
    return TARGET_SEEDS;
};
const BUILD_TARGET_SEED_ID = ({ index, nodeSuffix })=>{
    const HEX_INDEX = index.toString(16).padStart(4, '0');
    return `20202020-${HEX_INDEX}-4e7c-8001-${nodeSuffix}`;
};
const MESSAGE_THREAD_ID_BY_MESSAGE_ID = new Map(_messagedataseedsconstant.MESSAGE_DATA_SEEDS.map((message)=>[
        message.id,
        message.messageThreadId
    ]));
const getMessageThreadTargetDataSeeds = (messageParticipantSeeds)=>BUILD_TARGET_SEEDS({
        personIdsByParentId: GROUP_PERSON_IDS_BY_PARENT_ID({
            participants: messageParticipantSeeds,
            getParentId: (participant)=>MESSAGE_THREAD_ID_BY_MESSAGE_ID.get(participant.messageId),
            getPersonId: (participant)=>participant.personId
        }),
        createTargetSeed: ({ index, parentId, targetColumns })=>({
                id: BUILD_TARGET_SEED_ID({
                    index,
                    nodeSuffix: 'cafe56789abc'
                }),
                messageThreadId: parentId,
                ...targetColumns,
                isAutomaticallyAssigned: true,
                isManuallyAssigned: false
            })
    });
const getCalendarEventTargetDataSeeds = (calendarEventParticipantSeeds)=>BUILD_TARGET_SEEDS({
        personIdsByParentId: GROUP_PERSON_IDS_BY_PARENT_ID({
            participants: calendarEventParticipantSeeds,
            getParentId: (participant)=>participant.calendarEventId,
            getPersonId: (participant)=>participant.personId
        }),
        createTargetSeed: ({ index, parentId, targetColumns })=>({
                id: BUILD_TARGET_SEED_ID({
                    index,
                    nodeSuffix: 'face56789abc'
                }),
                calendarEventId: parentId,
                ...targetColumns,
                isAutomaticallyAssigned: true,
                isManuallyAssigned: false
            })
    });

//# sourceMappingURL=message-calendar-target-data-seeds.constant.js.map