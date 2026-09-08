"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isPackagedApplicationSource", {
    enumerable: true,
    get: function() {
        return isPackagedApplicationSource;
    }
});
const _applicationregistrationsourcetypeenum = require("../enums/application-registration-source-type.enum");
const isPackagedApplicationSource = (sourceType)=>sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.TARBALL || sourceType === _applicationregistrationsourcetypeenum.ApplicationRegistrationSourceType.NPM;

//# sourceMappingURL=is-packaged-application-source.util.js.map