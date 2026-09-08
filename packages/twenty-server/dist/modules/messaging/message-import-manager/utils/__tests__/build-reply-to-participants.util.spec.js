"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildreplytoparticipantsutil = require("../build-reply-to-participants.util");
describe('buildReplyToParticipants', ()=>{
    it('exposes every Reply-To address as a REPLY_TO participant so relayed messages link to the real contacts', ()=>{
        const participants = (0, _buildreplytoparticipantsutil.buildReplyToParticipants)([
            {
                address: 'jane@acme.com',
                name: 'Jane'
            },
            {
                address: 'sales@acme.com'
            }
        ], {
            address: 'wordpress@forms.example',
            name: 'Contact form'
        });
        expect(participants).toEqual([
            {
                role: _types.MessageParticipantRole.REPLY_TO,
                handle: 'jane@acme.com',
                displayName: 'Jane'
            },
            {
                role: _types.MessageParticipantRole.REPLY_TO,
                handle: 'sales@acme.com',
                displayName: ''
            }
        ]);
    });
    it('skips the Reply-To entry that merely echoes the sender, regardless of casing', ()=>{
        const participants = (0, _buildreplytoparticipantsutil.buildReplyToParticipants)([
            {
                address: 'WordPress@Forms.Example'
            },
            {
                address: 'jane@acme.com'
            }
        ], {
            address: 'wordpress@forms.example'
        });
        expect(participants).toEqual([
            {
                role: _types.MessageParticipantRole.REPLY_TO,
                handle: 'jane@acme.com',
                displayName: ''
            }
        ]);
    });
});

//# sourceMappingURL=build-reply-to-participants.util.spec.js.map