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
    get isNegatedWhereFactoryLike () {
        return isNegatedWhereFactoryLike;
    },
    get isObjectWhereLike () {
        return isObjectWhereLike;
    },
    get isWhereFactoryLike () {
        return isWhereFactoryLike;
    }
});
const _InstanceChecker = require("typeorm/util/InstanceChecker");
const isWhereFactoryLike = (condition)=>typeof condition === 'object' && condition !== null && typeof condition.whereFactory === 'function';
const isObjectWhereLike = (condition)=>typeof condition === 'object' && condition !== null && Object.getPrototypeOf(condition) === Object.prototype;
const isNegatedWhereFactoryLike = (condition)=>isWhereFactoryLike(condition) && _InstanceChecker.InstanceChecker.isNotBrackets(condition);

//# sourceMappingURL=query-builder.type.js.map