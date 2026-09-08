"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ApplicationFileUploadRequestInput () {
        return ApplicationFileUploadRequestInput;
    },
    get CreateApplicationFileUploadsInput () {
        return CreateApplicationFileUploadsInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _types = require("twenty-shared/types");
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
let ApplicationFileUploadRequestInput = class ApplicationFileUploadRequestInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_types.FileFolder),
    _ts_metadata("design:type", typeof _types.FileFolder === "undefined" ? Object : _types.FileFolder)
], ApplicationFileUploadRequestInput.prototype, "fileFolder", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    _ts_metadata("design:type", String)
], ApplicationFileUploadRequestInput.prototype, "filePath", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_graphql.Int),
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(1),
    _ts_metadata("design:type", Number)
], ApplicationFileUploadRequestInput.prototype, "size", void 0);
ApplicationFileUploadRequestInput = _ts_decorate([
    (0, _graphql.InputType)()
], ApplicationFileUploadRequestInput);
let CreateApplicationFileUploadsInput = class CreateApplicationFileUploadsInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>String),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateApplicationFileUploadsInput.prototype, "applicationUniversalIdentifier", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            ApplicationFileUploadRequestInput
        ]),
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.ArrayNotEmpty)(),
    (0, _classvalidator.ArrayMaxSize)(_applicationdevelopmentconstants.MAX_APPLICATION_FILE_UPLOAD_BATCH_SIZE),
    (0, _classvalidator.ValidateNested)({
        each: true
    }),
    (0, _classtransformer.Type)(()=>ApplicationFileUploadRequestInput),
    _ts_metadata("design:type", Array)
], CreateApplicationFileUploadsInput.prototype, "files", void 0);
CreateApplicationFileUploadsInput = _ts_decorate([
    (0, _graphql.ArgsType)()
], CreateApplicationFileUploadsInput);

//# sourceMappingURL=create-application-file-uploads.input.js.map