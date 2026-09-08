"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceMigrationTimelineActivityTypeActionsBuilderService", {
    enumerable: true,
    get: function() {
        return WorkspaceMigrationTimelineActivityTypeActionsBuilderService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _workspaceentitymigrationbuilderservice = require("../../services/workspace-entity-migration-builder.service");
const _flattimelineactivitytypevalidatorservice = require("../../validators/services/flat-timeline-activity-type-validator.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let WorkspaceMigrationTimelineActivityTypeActionsBuilderService = class WorkspaceMigrationTimelineActivityTypeActionsBuilderService extends _workspaceentitymigrationbuilderservice.WorkspaceEntityMigrationBuilderService {
    validateFlatEntityCreation(args) {
        const validationResult = this.flatTimelineActivityTypeValidatorService.validateFlatTimelineActivityTypeCreation(args);
        if (validationResult.errors.length > 0) {
            return {
                status: 'fail',
                ...validationResult
            };
        }
        return {
            status: 'success',
            action: {
                type: 'create',
                metadataName: 'timelineActivityType',
                flatEntity: args.flatEntityToValidate
            }
        };
    }
    validateFlatEntityDeletion(args) {
        const validationResult = this.flatTimelineActivityTypeValidatorService.validateFlatTimelineActivityTypeDeletion(args);
        if (validationResult.errors.length > 0) {
            return {
                status: 'fail',
                ...validationResult
            };
        }
        return {
            status: 'success',
            action: {
                type: 'delete',
                metadataName: 'timelineActivityType',
                universalIdentifier: args.flatEntityToValidate.universalIdentifier
            }
        };
    }
    validateFlatEntityUpdate(args) {
        const validationResult = this.flatTimelineActivityTypeValidatorService.validateFlatTimelineActivityTypeUpdate(args);
        if (validationResult.errors.length > 0) {
            return {
                status: 'fail',
                ...validationResult
            };
        }
        const { universalIdentifier, flatEntityUpdate } = args;
        const updateTimelineActivityTypeAction = {
            type: 'update',
            metadataName: 'timelineActivityType',
            universalIdentifier,
            update: flatEntityUpdate
        };
        return {
            status: 'success',
            action: updateTimelineActivityTypeAction
        };
    }
    constructor(flatTimelineActivityTypeValidatorService){
        super(_metadata.ALL_METADATA_NAME.timelineActivityType), this.flatTimelineActivityTypeValidatorService = flatTimelineActivityTypeValidatorService;
    }
};
WorkspaceMigrationTimelineActivityTypeActionsBuilderService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _flattimelineactivitytypevalidatorservice.FlatTimelineActivityTypeValidatorService === "undefined" ? Object : _flattimelineactivitytypevalidatorservice.FlatTimelineActivityTypeValidatorService
    ])
], WorkspaceMigrationTimelineActivityTypeActionsBuilderService);

//# sourceMappingURL=workspace-migration-timeline-activity-type-actions-builder.service.js.map