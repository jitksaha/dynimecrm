"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationSearchFieldMetadataActionsBuilderService", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationSearchFieldMetadataActionsBuilderService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _workspaceentitymigrationbuilderservice = require("../../services/workspace-entity-migration-builder.service");
const _flatsearchfieldmetadatavalidatorservice = require("../../validators/services/flat-search-field-metadata-validator.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMigrationSearchFieldMetadataActionsBuilderService = class WorkspaceMigrationSearchFieldMetadataActionsBuilderService extends _workspaceentitymigrationbuilderservice.WorkspaceEntityMigrationBuilderService {
    validateFlatEntityCreation(args) {
        const validationResult = this.flatSearchFieldMetadataValidatorService.validateFlatSearchFieldMetadataCreation(args);
        if (validationResult.errors.length > 0) {
            return {
                status: 'fail',
                ...validationResult
            };
        }
        const { flatEntityToValidate: flatSearchFieldMetadataToValidate } = args;
        return {
            status: 'success',
            action: {
                type: 'create',
                metadataName: 'searchFieldMetadata',
                flatEntity: flatSearchFieldMetadataToValidate
            }
        };
    }
    validateFlatEntityDeletion(args) {
        const validationResult = this.flatSearchFieldMetadataValidatorService.validateFlatSearchFieldMetadataDeletion(args);
        if (validationResult.errors.length > 0) {
            return {
                status: 'fail',
                ...validationResult
            };
        }
        const { flatEntityToValidate: flatSearchFieldMetadataToValidate } = args;
        return {
            status: 'success',
            action: {
                type: 'delete',
                metadataName: 'searchFieldMetadata',
                universalIdentifier: flatSearchFieldMetadataToValidate.universalIdentifier
            }
        };
    }
    validateFlatEntityUpdate(args) {
        const validationResult = this.flatSearchFieldMetadataValidatorService.validateFlatSearchFieldMetadataUpdate(args);
        if (validationResult.errors.length > 0) {
            return {
                status: 'fail',
                ...validationResult
            };
        }
        const { universalIdentifier, flatEntityUpdate } = args;
        const updateSearchFieldMetadataAction = {
            type: 'update',
            metadataName: 'searchFieldMetadata',
            universalIdentifier,
            update: flatEntityUpdate
        };
        return {
            status: 'success',
            action: updateSearchFieldMetadataAction
        };
    }
    constructor(flatSearchFieldMetadataValidatorService){
        super(_metadata.ALL_METADATA_NAME.searchFieldMetadata), this.flatSearchFieldMetadataValidatorService = flatSearchFieldMetadataValidatorService;
    }
};
WorkspaceMigrationSearchFieldMetadataActionsBuilderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _flatsearchfieldmetadatavalidatorservice.FlatSearchFieldMetadataValidatorService === "undefined" ? Object : _flatsearchfieldmetadatavalidatorservice.FlatSearchFieldMetadataValidatorService
    ])
], WorkspaceMigrationSearchFieldMetadataActionsBuilderService);

//# sourceMappingURL=workspace-migration-search-field-metadata-actions.builder.service.js.map