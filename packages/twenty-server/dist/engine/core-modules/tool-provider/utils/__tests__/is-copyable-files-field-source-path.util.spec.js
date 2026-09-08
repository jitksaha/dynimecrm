"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _iscopyablefilesfieldsourcepathutil = require("../is-copyable-files-field-source-path.util");
describe('isCopyableFilesFieldSourcePath', ()=>{
    it('should accept agent-chat uploads', ()=>{
        expect((0, _iscopyablefilesfieldsourcepathutil.isCopyableFilesFieldSourcePath)('agent-chat/abc.pdf')).toBe(true);
    });
    it('should reject files from other folders', ()=>{
        expect((0, _iscopyablefilesfieldsourcepathutil.isCopyableFilesFieldSourcePath)('files-field/field-uid/abc.pdf')).toBe(false);
        expect((0, _iscopyablefilesfieldsourcepathutil.isCopyableFilesFieldSourcePath)('profile-picture/abc.png')).toBe(false);
        expect((0, _iscopyablefilesfieldsourcepathutil.isCopyableFilesFieldSourcePath)('agent-chat-x/abc.pdf')).toBe(false);
    });
});

//# sourceMappingURL=is-copyable-files-field-source-path.util.spec.js.map