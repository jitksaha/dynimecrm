"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveEmailFiles", {
    enumerable: true,
    get: function() {
        return resolveEmailFiles;
    }
});
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const resolveEmailFiles = (files, context)=>{
    const resolvedFiles = (0, _utils.resolveInput)(files, context);
    if (!Array.isArray(resolvedFiles)) {
        return [];
    }
    return resolvedFiles.flat().map((file)=>{
        if (!(0, _utils.isDefined)(file) || typeof file !== 'object') {
            return undefined;
        }
        const attachment = file;
        const id = 'id' in attachment ? attachment.id : attachment.fileId;
        if (!(0, _guards.isNonEmptyString)(id)) {
            return undefined;
        }
        const name = 'id' in attachment ? attachment.name : [
            attachment.label,
            attachment.extension
        ].filter(_guards.isNonEmptyString).join('');
        return {
            id,
            name: (0, _guards.isNonEmptyString)(name) ? name : id
        };
    }).filter(_utils.isDefined);
};

//# sourceMappingURL=resolve-email-files.util.js.map