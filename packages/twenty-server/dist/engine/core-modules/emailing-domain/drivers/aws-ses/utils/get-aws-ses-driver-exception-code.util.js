"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getAwsSesDriverExceptionCode", {
    enumerable: true,
    get: function() {
        return getAwsSesDriverExceptionCode;
    }
});
const _utils = require("twenty-shared/utils");
const _awssesconfigurationerrornamesconstant = require("../constants/aws-ses-configuration-error-names.constant");
const _awssesinsufficientpermissionserrornamesconstant = require("../constants/aws-ses-insufficient-permissions-error-names.constant");
const _awssesthrottlingandtransienterrornamesconstant = require("../constants/aws-ses-throttling-and-transient-error-names.constant");
const _emailingdomaindriverexception = require("../../exceptions/emailing-domain-driver.exception");
const getAwsSesDriverExceptionCode = (error)=>{
    const name = error?.name ?? 'UnknownError';
    const httpStatus = error?.$metadata?.httpStatusCode;
    if (_awssesthrottlingandtransienterrornamesconstant.AWS_SES_THROTTLING_AND_TRANSIENT_ERROR_NAMES.includes(name)) {
        return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR;
    }
    if (httpStatus === 429 || (0, _utils.isDefined)(httpStatus) && httpStatus >= 500) {
        return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.TEMPORARY_ERROR;
    }
    if (httpStatus === 403 || _awssesinsufficientpermissionserrornamesconstant.AWS_SES_INSUFFICIENT_PERMISSIONS_ERROR_NAMES.includes(name)) {
        return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.INSUFFICIENT_PERMISSIONS;
    }
    if (httpStatus === 400 || _awssesconfigurationerrornamesconstant.AWS_SES_CONFIGURATION_ERROR_NAMES.includes(name)) {
        return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.CONFIGURATION_ERROR;
    }
    return _emailingdomaindriverexception.EmailingDomainDriverExceptionCode.UNKNOWN;
};

//# sourceMappingURL=get-aws-ses-driver-exception-code.util.js.map