"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getFlatEntityMapsExceptionContext", {
    enumerable: true,
    get: function() {
        return getFlatEntityMapsExceptionContext;
    }
});
const _utils = require("twenty-shared/utils");
const _flatentitymapsexception = require("../exceptions/flat-entity-maps.exception");
const hasFlatEntityIdentifier = (context)=>(0, _utils.isDefined)(context.universalIdentifier) || (0, _utils.isDefined)(context.id);
const getFlatEntityMapsExceptionContext = (error)=>{
    if (error instanceof _flatentitymapsexception.FlatEntityMapsException) {
        return (0, _utils.isDefined)(error.context) && hasFlatEntityIdentifier(error.context) ? error.context : undefined;
    }
    if ((0, _utils.isDefined)(error) && typeof error === 'object' && 'context' in error) {
        const parsedContext = _flatentitymapsexception.flatEntityMapsExceptionContextSchema.safeParse(error.context);
        return parsedContext.success && hasFlatEntityIdentifier(parsedContext.data) ? parsedContext.data : undefined;
    }
    return undefined;
};

//# sourceMappingURL=get-flat-entity-maps-exception-context.util.js.map