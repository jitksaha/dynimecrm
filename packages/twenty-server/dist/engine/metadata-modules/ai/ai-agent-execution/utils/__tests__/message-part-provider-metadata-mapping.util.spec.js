"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mapDBPartToUIMessagePart = require("../mapDBPartToUIMessagePart");
const _mapUIMessagePartsToDBParts = require("../mapUIMessagePartsToDBParts");
describe('message part provider metadata mapping', ()=>{
    it('persists and restores OpenAI encrypted reasoning metadata', ()=>{
        const providerMetadata = {
            openai: {
                itemId: 'rs_123',
                reasoningEncryptedContent: 'encrypted-content'
            }
        };
        const reasoningPart = {
            type: 'reasoning',
            text: 'reasoning summary',
            state: 'done',
            providerMetadata
        };
        const dbParts = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            reasoningPart
        ], 'message-id', 'workspace-id');
        expect(dbParts).toEqual([
            expect.objectContaining({
                type: 'reasoning',
                reasoningContent: 'reasoning summary',
                providerMetadata
            })
        ]);
        expect((0, _mapDBPartToUIMessagePart.mapDBPartToUIMessagePart)(dbParts[0])).toEqual({
            type: 'reasoning',
            text: 'reasoning summary',
            state: 'done',
            providerMetadata
        });
    });
});

//# sourceMappingURL=message-part-provider-metadata-mapping.util.spec.js.map