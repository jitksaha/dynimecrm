"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _collectuploadedfilereferencesutil = require("../collect-uploaded-file-references.util");
describe('collectUploadedFileReferences', ()=>{
    const buildFilePart = (fileId, filename)=>({
            type: 'file',
            mediaType: 'application/pdf',
            filename,
            url: 'https://example.com/file',
            fileId
        });
    it('should collect file parts from user messages across the thread', ()=>{
        const messages = [
            {
                id: '1',
                role: 'user',
                parts: [
                    {
                        type: 'text',
                        text: 'here is a file'
                    },
                    buildFilePart('file-1', 'contract.pdf')
                ]
            },
            {
                id: '2',
                role: 'assistant',
                parts: [
                    {
                        type: 'text',
                        text: 'thanks'
                    }
                ]
            },
            {
                id: '3',
                role: 'user',
                parts: [
                    buildFilePart('file-2', 'data.csv')
                ]
            }
        ];
        expect((0, _collectuploadedfilereferencesutil.collectUploadedFileReferences)(messages)).toEqual([
            {
                filename: 'contract.pdf',
                fileId: 'file-1'
            },
            {
                filename: 'data.csv',
                fileId: 'file-2'
            }
        ]);
    });
    it('should deduplicate by fileId and default missing filenames', ()=>{
        const messages = [
            {
                id: '1',
                role: 'user',
                parts: [
                    buildFilePart('file-1'),
                    buildFilePart('file-1')
                ]
            }
        ];
        expect((0, _collectuploadedfilereferencesutil.collectUploadedFileReferences)(messages)).toEqual([
            {
                filename: 'uploaded_file',
                fileId: 'file-1'
            }
        ]);
    });
    it('should ignore file parts on assistant messages', ()=>{
        const messages = [
            {
                id: '1',
                role: 'assistant',
                parts: [
                    buildFilePart('file-1', 'generated.pdf')
                ]
            }
        ];
        expect((0, _collectuploadedfilereferencesutil.collectUploadedFileReferences)(messages)).toEqual([]);
    });
});

//# sourceMappingURL=collect-uploaded-file-references.util.spec.js.map