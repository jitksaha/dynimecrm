"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _filesfieldvaluefileidsutil = require("../files-field-value-file-ids.util");
describe('collectFileIdsFromFilesFieldValue', ()=>{
    it('should collect fileIds from a files field value', ()=>{
        expect((0, _filesfieldvaluefileidsutil.collectFileIdsFromFilesFieldValue)([
            {
                fileId: 'file-1',
                label: 'a.pdf'
            },
            {
                fileId: 'file-2'
            }
        ])).toEqual([
            'file-1',
            'file-2'
        ]);
    });
    it('should ignore non-array values and malformed entries', ()=>{
        expect((0, _filesfieldvaluefileidsutil.collectFileIdsFromFilesFieldValue)(undefined)).toEqual([]);
        expect((0, _filesfieldvaluefileidsutil.collectFileIdsFromFilesFieldValue)('file-1')).toEqual([]);
        expect((0, _filesfieldvaluefileidsutil.collectFileIdsFromFilesFieldValue)([
            null,
            'file-1',
            {
                label: 'no-id.pdf'
            },
            {
                fileId: ''
            },
            {
                fileId: 'file-2'
            }
        ])).toEqual([
            'file-2'
        ]);
    });
});
describe('substituteFileIdsInFilesFieldValue', ()=>{
    it('should swap substituted fileIds and keep other entry fields', ()=>{
        const result = (0, _filesfieldvaluefileidsutil.substituteFileIdsInFilesFieldValue)([
            {
                fileId: 'chat-file',
                label: 'contract.pdf'
            },
            {
                fileId: 'already-prepared',
                label: 'other.pdf'
            }
        ], new Map([
            [
                'chat-file',
                'copied-file'
            ]
        ]));
        expect(result).toEqual([
            {
                fileId: 'copied-file',
                label: 'contract.pdf'
            },
            {
                fileId: 'already-prepared',
                label: 'other.pdf'
            }
        ]);
    });
    it('should return non-array values untouched', ()=>{
        expect((0, _filesfieldvaluefileidsutil.substituteFileIdsInFilesFieldValue)('not-an-array', new Map())).toBe('not-an-array');
    });
});

//# sourceMappingURL=files-field-value-file-ids.util.spec.js.map