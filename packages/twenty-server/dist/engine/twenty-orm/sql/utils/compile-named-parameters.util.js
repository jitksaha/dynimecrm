"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compileNamedParameters", {
    enumerable: true,
    get: function() {
        return compileNamedParameters;
    }
});
const _twentyormexception = require("../../exceptions/twenty-orm.exception");
const PARAMETER_NAME_CHARACTER = /[A-Za-z0-9_]/;
const compileNamedParameters = (sql, parameters)=>{
    const values = [];
    const positionByParameterName = new Map();
    let text = '';
    let index = 0;
    const buildSpreadItemKey = (parameterName, itemIndex)=>`:${parameterName}__${itemIndex}`;
    const appendValue = (parameterName, value)=>{
        const existingPosition = positionByParameterName.get(parameterName);
        if (existingPosition !== undefined) {
            return `$${existingPosition}`;
        }
        values.push(value);
        positionByParameterName.set(parameterName, values.length);
        return `$${values.length}`;
    };
    while(index < sql.length){
        const character = sql[index];
        if (character === "'" || character === '"') {
            const closingIndex = findClosingQuoteIndex(sql, index, character);
            text += sql.slice(index, closingIndex + 1);
            index = closingIndex + 1;
            continue;
        }
        if (character === ':' && sql[index + 1] === ':') {
            text += '::';
            index += 2;
            continue;
        }
        if (character !== ':') {
            text += character;
            index += 1;
            continue;
        }
        const isSpread = sql.startsWith(':...', index);
        const nameStartIndex = index + (isSpread ? 4 : 1);
        let nameEndIndex = nameStartIndex;
        while(nameEndIndex < sql.length && PARAMETER_NAME_CHARACTER.test(sql[nameEndIndex])){
            nameEndIndex += 1;
        }
        if (nameEndIndex === nameStartIndex) {
            text += character;
            index += 1;
            continue;
        }
        const parameterName = sql.slice(nameStartIndex, nameEndIndex);
        if (!(parameterName in parameters)) {
            throw new _twentyormexception.TwentyOrmException(`Parameter ":${parameterName}" is referenced by the query but was never provided`, _twentyormexception.TwentyOrmExceptionCode.MISSING_PARAMETER);
        }
        const parameterValue = parameters[parameterName];
        if (isSpread) {
            if (!Array.isArray(parameterValue)) {
                throw new _twentyormexception.TwentyOrmException(`Parameter ":...${parameterName}" expects an array`, _twentyormexception.TwentyOrmExceptionCode.INVALID_PARAMETER);
            }
            if (parameterValue.length === 0) {
                text += 'NULL';
            } else {
                text += parameterValue.map((item, itemIndex)=>appendValue(buildSpreadItemKey(parameterName, itemIndex), item)).join(', ');
            }
        } else {
            text += appendValue(parameterName, parameterValue);
        }
        index = nameEndIndex;
    }
    return {
        text,
        values
    };
};
const findClosingQuoteIndex = (sql, openingIndex, quote)=>{
    let index = openingIndex + 1;
    while(index < sql.length){
        if (sql[index] !== quote) {
            index += 1;
            continue;
        }
        if (sql[index + 1] === quote) {
            index += 2;
            continue;
        }
        return index;
    }
    throw new _twentyormexception.TwentyOrmException(`Unterminated ${quote === "'" ? 'string literal' : 'quoted identifier'} in SQL`, _twentyormexception.TwentyOrmExceptionCode.MALFORMED_SQL);
};

//# sourceMappingURL=compile-named-parameters.util.js.map