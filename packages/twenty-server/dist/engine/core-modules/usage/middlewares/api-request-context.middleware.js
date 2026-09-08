/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApiRequestContextMiddleware", {
    enumerable: true,
    get: function() {
        return ApiRequestContextMiddleware;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _apirequestcontextstorage = require("../storage/api-request-context.storage");
const _getapitypefrompathutil = require("../utils/get-api-type-from-path.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ApiRequestContextMiddleware = class ApiRequestContextMiddleware {
    use(req, _res, next) {
        const [path] = req.originalUrl.split('?');
        const apiType = (0, _getapitypefrompathutil.getApiTypeFromPath)(path);
        if (!(0, _utils.isDefined)(apiType)) {
            next();
            return;
        }
        void (0, _apirequestcontextstorage.withApiRequestContext)(apiType, ()=>{
            next();
        });
    }
};
ApiRequestContextMiddleware = _ts_decorate([
    (0, _common.Injectable)()
], ApiRequestContextMiddleware);

//# sourceMappingURL=api-request-context.middleware.js.map