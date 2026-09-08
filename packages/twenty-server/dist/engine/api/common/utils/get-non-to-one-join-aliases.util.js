"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNonToOneJoinAliases", {
    enumerable: true,
    get: function() {
        return getNonToOneJoinAliases;
    }
});
const getNonToOneJoinAliases = (queryBuilder)=>queryBuilder.getJoinAliases().filter(({ isToMany })=>isToMany).map(({ name })=>name);

//# sourceMappingURL=get-non-to-one-join-aliases.util.js.map