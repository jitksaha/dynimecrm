"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractNestedRelationFieldsByEntityIndex", {
    enumerable: true,
    get: function() {
        return extractNestedRelationFieldsByEntityIndex;
    }
});
const _classvalidator = require("class-validator");
const _constants = require("twenty-shared/constants");
const _twentyormexception = require("../exceptions/twenty-orm.exception");
const hasRelationConnect = (value)=>{
    if (!(0, _classvalidator.isDefined)(value) || typeof value !== 'object') {
        return false;
    }
    const obj = value;
    if (!(0, _classvalidator.isDefined)(obj[_constants.RELATION_NESTED_QUERY_KEYWORDS.CONNECT]) || typeof obj[_constants.RELATION_NESTED_QUERY_KEYWORDS.CONNECT] !== 'object') {
        return false;
    }
    const connect = obj[_constants.RELATION_NESTED_QUERY_KEYWORDS.CONNECT];
    if (!(0, _classvalidator.isDefined)(connect[_constants.RELATION_NESTED_QUERY_KEYWORDS.CONNECT_WHERE]) || typeof connect[_constants.RELATION_NESTED_QUERY_KEYWORDS.CONNECT_WHERE] !== 'object') {
        return false;
    }
    const where = connect[_constants.RELATION_NESTED_QUERY_KEYWORDS.CONNECT_WHERE];
    const whereKeys = Object.keys(where);
    if (whereKeys.length === 0) {
        return false;
    }
    return whereKeys.every((key)=>{
        const whereValue = where[key];
        if (typeof whereValue === 'string') {
            return true;
        }
        if (whereValue && typeof whereValue === 'object') {
            const subObj = whereValue;
            return Object.values(subObj).every((subValue)=>typeof subValue === 'string');
        }
        return false;
    });
};
const hasRelationDisconnect = (value)=>{
    if (!(0, _classvalidator.isDefined)(value) || typeof value !== 'object') {
        return false;
    }
    const obj = value;
    if (!(0, _classvalidator.isDefined)(obj[_constants.RELATION_NESTED_QUERY_KEYWORDS.DISCONNECT]) || typeof obj[_constants.RELATION_NESTED_QUERY_KEYWORDS.DISCONNECT] !== 'boolean') {
        return false;
    }
    return true;
};
const hasRelationCreate = (value)=>{
    if (!(0, _classvalidator.isDefined)(value) || typeof value !== 'object') {
        return false;
    }
    const create = value[_constants.RELATION_NESTED_QUERY_KEYWORDS.CREATE];
    return (0, _classvalidator.isDefined)(create) && typeof create === 'object';
};
const extractNestedRelationFieldsByEntityIndex = (entities, relationFieldNames)=>{
    const relationConnectQueryFieldsByEntityIndex = {};
    const relationDisconnectQueryFieldsByEntityIndex = {};
    const relationCreateQueryFieldsByEntityIndex = {};
    for (const [entityIndex, entity] of Object.entries(entities)){
        for (const [key, value] of Object.entries(entity)){
            if (!relationFieldNames.has(key)) {
                continue;
            }
            const hasConnect = hasRelationConnect(value);
            const hasCreate = hasRelationCreate(value);
            const hasDisconnect = hasRelationDisconnect(value);
            if (hasConnect && hasDisconnect) {
                throw new _twentyormexception.TwentyOrmException(`Cannot have both connect and disconnect for the same relation field ${key}.`, _twentyormexception.TwentyOrmExceptionCode.CONNECT_NOT_ALLOWED);
            }
            if (hasCreate && (hasConnect || hasDisconnect)) {
                throw new _twentyormexception.TwentyOrmException(`Cannot combine create, connect, and disconnect for the same relation field ${key}.`, _twentyormexception.TwentyOrmExceptionCode.CONNECT_NOT_ALLOWED);
            }
            const relationConnectQueryFields = relationConnectQueryFieldsByEntityIndex?.[entityIndex] || {};
            if (hasConnect) {
                relationConnectQueryFieldsByEntityIndex[entityIndex] = {
                    ...relationConnectQueryFields,
                    [key]: value
                };
            }
            const relationDisconnectQueryFields = relationDisconnectQueryFieldsByEntityIndex?.[entityIndex] || {};
            if (hasDisconnect) {
                relationDisconnectQueryFieldsByEntityIndex[entityIndex] = {
                    ...relationDisconnectQueryFields,
                    [key]: value
                };
            }
            const relationCreateQueryFields = relationCreateQueryFieldsByEntityIndex?.[entityIndex] || {};
            if (hasCreate) {
                relationCreateQueryFieldsByEntityIndex[entityIndex] = {
                    ...relationCreateQueryFields,
                    [key]: value
                };
            }
        }
    }
    return {
        relationConnectQueryFieldsByEntityIndex,
        relationCreateQueryFieldsByEntityIndex,
        relationDisconnectQueryFieldsByEntityIndex
    };
};

//# sourceMappingURL=extract-nested-relation-fields-by-entity-index.util.js.map