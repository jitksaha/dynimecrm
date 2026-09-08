"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _i18n = require("twenty-shared/i18n");
const _utils = require("twenty-shared/utils");
const _buildobjectnavigationuniversalflatcommandmenuitemutil = require("../../../../metadata-modules/flat-command-menu-item/utils/build-object-navigation-universal-flat-command-menu-item.util");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _standardcommandmenuitemconstant = require("../standard-command-menu-item.constant");
const PLACEHOLDER_REGEX = /\{(\w+)\}/g;
const AUTHORED_METADATA_LABELS = [
    ...Object.values(_standardcommandmenuitemconstant.STANDARD_COMMAND_MENU_ITEMS).flatMap((item)=>[
            item.label,
            item.shortLabel,
            item.icon
        ].filter(_utils.isDefined)),
    _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_LABEL,
    _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_SHORT_LABEL,
    _buildobjectnavigationuniversalflatcommandmenuitemutil.NAVIGATION_INTERPOLATED_ICON,
    _indexviewnameconstant.INDEX_VIEW_NAME
];
describe('authored metadata label placeholders', ()=>{
    // Lingui drops ICU arguments it is not given, so a placeholder outside the
    // closed vocabulary would be silently erased from the translated label
    // instead of reaching whoever can fill it.
    it('only uses names the placeholder vocabulary declares', ()=>{
        const usedNames = new Set(AUTHORED_METADATA_LABELS.flatMap((label)=>[
                ...label.matchAll(PLACEHOLDER_REGEX)
            ].map(([, name])=>name)));
        // Guards the assertion below against passing vacuously if the authored
        // labels stopped carrying placeholders at all.
        expect(usedNames.size).toBeGreaterThan(0);
        expect([
            ...usedNames
        ].filter((name)=>!_i18n.METADATA_LABEL_PLACEHOLDER_NAMES.includes(name))).toEqual([]);
    });
    it('no longer carries template expressions', ()=>{
        expect(AUTHORED_METADATA_LABELS.filter((label)=>label.includes('${'))).toEqual([]);
    });
});

//# sourceMappingURL=standard-command-menu-item-placeholders.spec.js.map