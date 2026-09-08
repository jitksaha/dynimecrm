"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseFiniteNumberInput", {
    enumerable: true,
    get: function() {
        return parseFiniteNumberInput;
    }
});
const _zod = require("zod");
const finiteNumberInputSchema = _zod.z.preprocess((value)=>typeof value === 'string' && value.trim() === '' ? undefined : value, _zod.z.coerce.number().finite());
const parseFiniteNumberInput = (value)=>{
    const result = finiteNumberInputSchema.safeParse(value);
    return result.success ? result.data : undefined;
};

//# sourceMappingURL=parse-finite-number-input.util.js.map