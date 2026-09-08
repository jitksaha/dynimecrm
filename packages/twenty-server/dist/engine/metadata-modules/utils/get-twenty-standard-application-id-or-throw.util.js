"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getTwentyStandardApplicationIdOrThrow", {
    enumerable: true,
    get: function() {
        return getTwentyStandardApplicationIdOrThrow;
    }
});
const _application = require("twenty-shared/application");
const _utils = require("twenty-shared/utils");
const _applicationexception = require("../../core-modules/application/application.exception");
const getTwentyStandardApplicationIdOrThrow = (flatApplicationMaps)=>{
    const twentyStandardApplicationId = flatApplicationMaps.idByUniversalIdentifier[_application.TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER];
    if (!(0, _utils.isDefined)(twentyStandardApplicationId)) {
        throw new _applicationexception.ApplicationException('Could not find the twenty-standard application in the workspace cache', _applicationexception.ApplicationExceptionCode.APPLICATION_NOT_FOUND);
    }
    return twentyStandardApplicationId;
};

//# sourceMappingURL=get-twenty-standard-application-id-or-throw.util.js.map