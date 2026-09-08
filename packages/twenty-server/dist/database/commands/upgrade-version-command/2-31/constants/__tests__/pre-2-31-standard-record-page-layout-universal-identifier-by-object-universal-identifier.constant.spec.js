"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant = require("../pre-2-31-standard-record-page-layout-universal-identifier-by-object-universal-identifier.constant");
// Standard record-page layouts added AFTER 2.31 are born on the derived
// scheme and need no pre-2.31 literal: list them here to keep the
// completeness check green.
const POST_2_28_RECORD_PAGE_KEYS = [];
describe('PRE_2_31_STANDARD_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER_BY_OBJECT_UNIVERSAL_IDENTIFIER', ()=>{
    // A missing entry would make the standard reconcile silently skip that
    // curated stack, and the backfill would then create a duplicate one.
    it('covers every pre-2.31 standard record-page layout', ()=>{
        const recordPageObjectNames = Object.keys(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS).filter((key)=>key.endsWith('RecordPage')).filter((key)=>!POST_2_28_RECORD_PAGE_KEYS.includes(key)).map((key)=>key.slice(0, -'RecordPage'.length));
        expect(recordPageObjectNames.length).toBeGreaterThan(0);
        for (const objectName of recordPageObjectNames){
            const objectUniversalIdentifier = _metadata.STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS[objectName];
            expect(objectUniversalIdentifier).toBeDefined();
            expect(_pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant.PRE_2_31_STANDARD_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER_BY_OBJECT_UNIVERSAL_IDENTIFIER[objectUniversalIdentifier]).toBeDefined();
        }
    });
    it('holds no derived identifier: every literal predates the derivation', ()=>{
        const derivedLayoutUniversalIdentifiers = new Set(Object.values(_metadata.STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS).map((pageLayout)=>pageLayout.universalIdentifier));
        for (const pre228LayoutUniversalIdentifier of Object.values(_pre231standardrecordpagelayoutuniversalidentifierbyobjectuniversalidentifierconstant.PRE_2_31_STANDARD_RECORD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIER_BY_OBJECT_UNIVERSAL_IDENTIFIER)){
            expect(derivedLayoutUniversalIdentifiers.has(pre228LayoutUniversalIdentifier)).toBe(false);
        }
    });
});

//# sourceMappingURL=pre-2-31-standard-record-page-layout-universal-identifier-by-object-universal-identifier.constant.spec.js.map