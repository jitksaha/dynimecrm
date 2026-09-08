"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _istranslatablemetadatanameutil = require("../is-translatable-metadata-name.util");
describe('isTranslatableMetadataName', ()=>{
    it.each([
        'view',
        'pageLayout',
        'commandMenuItem',
        'navigationMenuItem'
    ])('should accept %s', (metadataName)=>{
        expect((0, _istranslatablemetadatanameutil.isTranslatableMetadataName)(metadataName)).toBe(true);
    });
    it.each([
        'viewField',
        'role',
        'index'
    ])('should reject %s', (metadataName)=>{
        expect((0, _istranslatablemetadatanameutil.isTranslatableMetadataName)(metadataName)).toBe(false);
    });
});

//# sourceMappingURL=is-translatable-metadata-name.util.spec.js.map