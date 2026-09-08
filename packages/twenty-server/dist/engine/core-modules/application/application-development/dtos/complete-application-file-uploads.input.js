"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CompleteApplicationFileUploadsInput", {
    enumerable: true,
    get: function() {
        return CompleteApplicationFileUploadsInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classvalidator = require("class-validator");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _applicationdevelopmentconstants = require("../constants/application-development.constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CompleteApplicationFileUploadsInput = class CompleteApplicationFileUploadsInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CompleteApplicationFileUploadsInput.prototype, "applicationUniversalIdentifier", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _scalars.UUIDScalarType
        ]),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ArrayNotEmpty)(),
    (0, _classvalidator.ArrayMaxSize)(_applicationdevelopmentconstants.MAX_APPLICATION_FILE_UPLOAD_BATCH_SIZE),
    _ts_metadata("design:type", Array)
], CompleteApplicationFileUploadsInput.prototype, "fileIds", void 0);
CompleteApplicationFileUploadsInput = _ts_decorate([
    (0, _graphql.ArgsType)()
], CompleteApplicationFileUploadsInput);

//# sourceMappingURL=complete-application-file-uploads.input.js.map