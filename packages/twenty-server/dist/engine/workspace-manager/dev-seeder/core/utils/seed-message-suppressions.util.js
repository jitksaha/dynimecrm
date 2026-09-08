"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "seedMessageSuppressions", {
    enumerable: true,
    get: function() {
        return seedMessageSuppressions;
    }
});
const _utils = require("twenty-shared/utils");
const _messagesuppressionreasontype = require("../../../../core-modules/emailing-domain/types/message-suppression-reason.type");
const _messagesuppressionsourcetype = require("../../../../core-modules/emailing-domain/types/message-suppression-source.type");
const _seedunsubscribetopicsutil = require("./seed-unsubscribe-topics.util");
const tableName = 'messageSuppression';
// Addresses are taken from the seeded people so the unsubscribers list lines up
// with records that exist in the workspace.
const MESSAGE_SUPPRESSION_SEEDS = [
    {
        emailAddress: 'mark.young@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: null
    },
    {
        emailAddress: 'gabriel.robinson@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: null
    },
    {
        emailAddress: 'kimberly.gordon@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.BOUNCE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.WEBHOOK,
        providerEventId: 'seed-bounce-event-1',
        topicSeedName: null
    },
    {
        emailAddress: 'cindy.baker@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.BOUNCE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.WEBHOOK,
        providerEventId: 'seed-bounce-event-2',
        topicSeedName: null
    },
    {
        emailAddress: 'anthony.may@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.COMPLAINT,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.WEBHOOK,
        providerEventId: 'seed-complaint-event-1',
        topicSeedName: null
    },
    {
        emailAddress: 'vicki.meyer@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.COMPLAINT,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.WEBHOOK,
        providerEventId: 'seed-complaint-event-2',
        topicSeedName: null
    },
    {
        emailAddress: 'billy.mckinney@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.BOUNCE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.WEBHOOK,
        providerEventId: 'seed-bounce-event-3',
        topicSeedName: null
    },
    {
        emailAddress: 'andrew.king@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: null
    },
    {
        emailAddress: 'todd.jones@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-product-updates'
    },
    {
        emailAddress: 'gregory.perez@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-product-updates'
    },
    {
        emailAddress: 'vanessa.farmer@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-newsletter'
    },
    {
        emailAddress: 'elizabeth.chung@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-newsletter'
    },
    {
        emailAddress: 'melissa.huerta@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-events'
    },
    {
        emailAddress: 'debbie.johnson@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-events'
    },
    // Also globally suppressed above, to cover an address that opted out of a
    // single topic before unsubscribing from everything.
    {
        emailAddress: 'mark.young@example.com',
        reason: _messagesuppressionreasontype.MessageSuppressionReason.UNSUBSCRIBE,
        source: _messagesuppressionsourcetype.MessageSuppressionSource.SYSTEM,
        providerEventId: null,
        topicSeedName: 'unsubscribe-topic-newsletter'
    }
];
const seedMessageSuppressions = async ({ queryRunner, schemaName, workspaceId })=>{
    const topicIds = (0, _seedunsubscribetopicsutil.getSeededUnsubscribeTopicIds)(workspaceId);
    await queryRunner.manager.createQueryBuilder().insert().into(`${schemaName}.${tableName}`, [
        'workspaceId',
        'emailAddress',
        'reason',
        'source',
        'providerEventId',
        'unsubscribeTopicId'
    ]).orIgnore().values(MESSAGE_SUPPRESSION_SEEDS.map(({ emailAddress, reason, source, providerEventId, topicSeedName })=>({
            workspaceId,
            emailAddress,
            reason,
            source,
            providerEventId,
            unsubscribeTopicId: (0, _utils.isDefined)(topicSeedName) ? topicIds[topicSeedName] : null
        }))).execute();
};

//# sourceMappingURL=seed-message-suppressions.util.js.map