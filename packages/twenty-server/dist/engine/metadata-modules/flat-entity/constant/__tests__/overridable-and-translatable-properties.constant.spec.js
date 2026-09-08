"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _alloverridablepropertiesbymetadatanameconstant = require("../all-overridable-properties-by-metadata-name.constant");
const _alltranslatablepropertiesbymetadatanameconstant = require("../all-translatable-properties-by-metadata-name.constant");
describe('registry-derived override property maps', ()=>{
    it('derives the overridable properties for every metadata entity', ()=>{
        expect(_alloverridablepropertiesbymetadatanameconstant.ALL_OVERRIDABLE_PROPERTIES_BY_METADATA_NAME).toMatchSnapshot();
    });
    it('derives the translatable properties for every metadata entity', ()=>{
        expect(_alltranslatablepropertiesbymetadatanameconstant.ALL_TRANSLATABLE_PROPERTIES_BY_METADATA_NAME).toMatchSnapshot();
    });
});

//# sourceMappingURL=overridable-and-translatable-properties.constant.spec.js.map