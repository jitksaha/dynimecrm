/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getApiTypeFromPath", {
    enumerable: true,
    get: function() {
        return getApiTypeFromPath;
    }
});
const _apitypesconstant = require("../constants/api-types.constant");
const getApiTypeFromPath = (path)=>{
    const [pathPrefix] = path.replace(/^\//, '').split('/');
    return _apitypesconstant.API_TYPE_BY_PATH_PREFIX[pathPrefix];
};

//# sourceMappingURL=get-api-type-from-path.util.js.map