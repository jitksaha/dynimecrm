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
    get getSeededUnsubscribeTopicIds () {
        return getSeededUnsubscribeTopicIds;
    },
    get seedUnsubscribeTopics () {
        return seedUnsubscribeTopics;
    }
});
const _unsubscribetopicvisibilitytype = require("../../../../core-modules/emailing-domain/types/unsubscribe-topic-visibility.type");
const _generateseedidutil = require("./generate-seed-id.util");
const tableName = 'unsubscribeTopic';
const UNSUBSCRIBE_TOPIC_SEEDS = [
    {
        seedName: 'unsubscribe-topic-product-updates',
        name: 'Product updates',
        description: 'New features, improvements and release notes',
        visibility: _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility.PUBLIC
    },
    {
        seedName: 'unsubscribe-topic-newsletter',
        name: 'Monthly newsletter',
        description: 'A monthly digest of company news',
        visibility: _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility.PUBLIC
    },
    {
        seedName: 'unsubscribe-topic-events',
        name: 'Events and webinars',
        description: 'Invitations to live events and webinars',
        visibility: _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility.PUBLIC
    }
];
const getSeededUnsubscribeTopicIds = (workspaceId)=>Object.fromEntries(UNSUBSCRIBE_TOPIC_SEEDS.map(({ seedName })=>[
            seedName,
            (0, _generateseedidutil.generateSeedId)(workspaceId, seedName)
        ]));
const seedUnsubscribeTopics = async ({ queryRunner, schemaName, workspaceId })=>{
    const topicIds = getSeededUnsubscribeTopicIds(workspaceId);
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.${tableName}`, [
        'id',
        'workspaceId',
        'name',
        'description',
        'visibility'
    ]).orIgnore().values(UNSUBSCRIBE_TOPIC_SEEDS.map(({ seedName, name, description, visibility })=>({
            id: topicIds[seedName],
            workspaceId,
            name,
            description,
            visibility
        }))).execute();
};

//# sourceMappingURL=seed-unsubscribe-topics.util.js.map