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
    get ApplicationFileCompletionErrorDTO () {
        return ApplicationFileCompletionErrorDTO;
    },
    get CompleteApplicationFileUploadsResultDTO () {
        return CompleteApplicationFileUploadsResultDTO;
    }
});
const _graphql = require("@nestjs/graphql");
const _scalars = require("../../../../api/graphql/workspace-schema-builder/graphql-types/scalars");
const _filedto = require("../../../file/dtos/file.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ApplicationFileCompletionErrorDTO = class ApplicationFileCompletionErrorDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>_scalars.UUIDScalarType),
    _ts_metadata("design:type", String)
], ApplicationFileCompletionErrorDTO.prototype, "fileId", void 0);
_ts_decorate([
    (0, _graphql.Field)(),
    _ts_metadata("design:type", String)
], ApplicationFileCompletionErrorDTO.prototype, "message", void 0);
ApplicationFileCompletionErrorDTO = _ts_decorate([
    (0, _graphql.ObjectType)('ApplicationFileCompletionError')
], ApplicationFileCompletionErrorDTO);
let CompleteApplicationFileUploadsResultDTO = class CompleteApplicationFileUploadsResultDTO {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            _filedto.FileDTO
        ]),
    _ts_metadata("design:type", Array)
], CompleteApplicationFileUploadsResultDTO.prototype, "files", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            ApplicationFileCompletionErrorDTO
        ]),
    _ts_metadata("design:type", Array)
], CompleteApplicationFileUploadsResultDTO.prototype, "errors", void 0);
CompleteApplicationFileUploadsResultDTO = _ts_decorate([
    (0, _graphql.ObjectType)('CompleteApplicationFileUploadsResult')
], CompleteApplicationFileUploadsResultDTO);

//# sourceMappingURL=complete-application-file-uploads-result.dto.js.map