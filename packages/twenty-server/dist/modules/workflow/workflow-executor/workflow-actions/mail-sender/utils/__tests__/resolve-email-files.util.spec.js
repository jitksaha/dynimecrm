"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resolveemailfilesutil = require("../resolve-email-files.util");
describe('resolveEmailFiles', ()=>{
    it('conforms static uploads to id/name, dropping extra metadata', ()=>{
        const upload = {
            id: 'file-1',
            name: 'logo.png',
            size: 1024,
            type: 'image/png',
            createdAt: '2026-01-01T00:00:00.000Z'
        };
        expect((0, _resolveemailfilesutil.resolveEmailFiles)([
            upload
        ], {})).toEqual([
            {
                id: 'file-1',
                name: 'logo.png'
            }
        ]);
    });
    it('resolves a variable bound to a record Files field and flattens it', ()=>{
        const context = {
            step: {
                first: {
                    files: [
                        {
                            fileId: 'file-1',
                            label: 'Contract',
                            extension: '.pdf'
                        },
                        {
                            fileId: 'file-2',
                            label: 'Proposal',
                            extension: '.pdf'
                        }
                    ]
                }
            }
        };
        expect((0, _resolveemailfilesutil.resolveEmailFiles)([
            '{{step.first.files}}'
        ], context)).toEqual([
            {
                id: 'file-1',
                name: 'Contract.pdf'
            },
            {
                id: 'file-2',
                name: 'Proposal.pdf'
            }
        ]);
    });
    it('mixes a static upload with a resolved record Files variable', ()=>{
        const context = {
            step: {
                files: [
                    {
                        fileId: 'file-2',
                        label: 'Deck',
                        extension: '.pdf'
                    }
                ]
            }
        };
        expect((0, _resolveemailfilesutil.resolveEmailFiles)([
            {
                id: 'file-1',
                name: 'brochure.pdf'
            },
            '{{step.files}}'
        ], context)).toEqual([
            {
                id: 'file-1',
                name: 'brochure.pdf'
            },
            {
                id: 'file-2',
                name: 'Deck.pdf'
            }
        ]);
    });
    it('falls back to the file id when no usable name is present', ()=>{
        expect((0, _resolveemailfilesutil.resolveEmailFiles)([
            {
                id: 'file-1'
            }
        ], {})).toEqual([
            {
                id: 'file-1',
                name: 'file-1'
            }
        ]);
    });
    it('returns an empty array when there is nothing to attach', ()=>{
        expect((0, _resolveemailfilesutil.resolveEmailFiles)(undefined, {})).toEqual([]);
        expect((0, _resolveemailfilesutil.resolveEmailFiles)([], {})).toEqual([]);
    });
    it('skips entries that resolve to nothing or lack a file id', ()=>{
        const context = {
            step: {}
        };
        expect((0, _resolveemailfilesutil.resolveEmailFiles)([
            '{{step.missing}}',
            {
                name: 'no-id.pdf'
            }
        ], context)).toEqual([]);
    });
});

//# sourceMappingURL=resolve-email-files.util.spec.js.map