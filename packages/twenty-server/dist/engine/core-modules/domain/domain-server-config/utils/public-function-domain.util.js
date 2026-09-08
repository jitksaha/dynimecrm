"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getHostnameFromUrlOrUndefined () {
        return getHostnameFromUrlOrUndefined;
    },
    get isHostUnderPublicFunctionDomain () {
        return isHostUnderPublicFunctionDomain;
    }
});
const _guards = require("@sniptt/guards");
const getHostnameFromUrlOrUndefined = (url)=>{
    if (!(0, _guards.isNonEmptyString)(url)) {
        return undefined;
    }
    try {
        return new URL(url).hostname.toLowerCase();
    } catch  {
        return undefined;
    }
};
const isHostUnderPublicFunctionDomain = ({ host, publicDomainBaseHostname })=>{
    if (!(0, _guards.isNonEmptyString)(host) || !(0, _guards.isNonEmptyString)(publicDomainBaseHostname)) {
        return false;
    }
    const hostname = host.split(':')[0].toLowerCase();
    const base = publicDomainBaseHostname.toLowerCase();
    return hostname !== base && hostname.endsWith(`.${base}`);
};

//# sourceMappingURL=public-function-domain.util.js.map