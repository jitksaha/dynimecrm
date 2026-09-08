"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TimelineActivityTypeService", {
    enumerable: true,
    get: function() {
        return TimelineActivityTypeService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _applicationservice = require("../../core-modules/application/application.service");
const _workspacemanyorallflatentitymapscacheservice = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsutil = require("../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _timelineactivitytypeexceptioncodeenum = require("./enums/timeline-activity-type-exception-code.enum");
const _timelineactivitytypeexception = require("./timeline-activity-type.exception");
const _fromflattimelineactivitytypetotimelineactivitytypedtoutil = require("./utils/from-flat-timeline-activity-type-to-timeline-activity-type-dto.util");
const _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil = require("./utils/from-update-timeline-activity-type-input-to-flat-timeline-activity-type-to-update-or-throw.util");
const _workspacemigrationbuilderexception = require("../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TimelineActivityTypeService = class TimelineActivityTypeService {
    async findAll({ workspaceId }) {
        const { flatTimelineActivityTypeMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatTimelineActivityTypeMaps'
            ]
        });
        return Object.values(flatTimelineActivityTypeMaps.byUniversalIdentifier).filter(_utils.isDefined).sort((a, b)=>a.name.localeCompare(b.name)).map(_fromflattimelineactivitytypetotimelineactivitytypedtoutil.fromFlatTimelineActivityTypeToTimelineActivityTypeDto);
    }
    async update({ input, workspaceId }) {
        const { workspaceCustomFlatApplication, flatTimelineActivityTypeMaps } = await this.getWorkspaceUpdateContext(workspaceId);
        const flatTimelineActivityTypeToUpdate = (0, _fromupdatetimelineactivitytypeinputtoflattimelineactivitytypetoupdateorthrowutil.fromUpdateTimelineActivityTypeInputToFlatTimelineActivityTypeToUpdateOrThrow)({
            flatTimelineActivityTypeMaps,
            updateTimelineActivityTypeInput: input,
            callerApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        return this.persistUpdate({
            flatTimelineActivityTypeToUpdate,
            workspaceId,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
    }
    async reset({ id, workspaceId }) {
        const { workspaceCustomFlatApplication, flatTimelineActivityTypeMaps } = await this.getWorkspaceUpdateContext(workspaceId);
        const existingFlatTimelineActivityType = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: id,
            flatEntityMaps: flatTimelineActivityTypeMaps
        });
        if (!(0, _utils.isDefined)(existingFlatTimelineActivityType)) {
            throw new _timelineactivitytypeexception.TimelineActivityTypeException('Timeline activity type not found', _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_NOT_FOUND);
        }
        if (existingFlatTimelineActivityType.applicationUniversalIdentifier === workspaceCustomFlatApplication.universalIdentifier) {
            throw new _timelineactivitytypeexception.TimelineActivityTypeException('Custom timeline activity type cannot be reset to default', _timelineactivitytypeexceptioncodeenum.TimelineActivityTypeExceptionCode.TIMELINE_ACTIVITY_TYPE_CANNOT_BE_RESET);
        }
        return this.persistUpdate({
            flatTimelineActivityTypeToUpdate: {
                ...existingFlatTimelineActivityType,
                overrides: null,
                isActive: true,
                updatedAt: new Date().toISOString()
            },
            workspaceId,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
    }
    async getWorkspaceUpdateContext(workspaceId) {
        const [applicationContext, metadataMaps] = await Promise.all([
            this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
                workspaceId
            }),
            this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
                workspaceId,
                flatMapsKeys: [
                    'flatTimelineActivityTypeMaps'
                ]
            })
        ]);
        return {
            workspaceCustomFlatApplication: applicationContext.workspaceCustomFlatApplication,
            flatTimelineActivityTypeMaps: metadataMaps.flatTimelineActivityTypeMaps
        };
    }
    async persistUpdate({ flatTimelineActivityTypeToUpdate, workspaceId, applicationUniversalIdentifier }) {
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                timelineActivityType: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        flatTimelineActivityTypeToUpdate
                    ]
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while updating timeline activity type');
        }
        const { flatTimelineActivityTypeMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatTimelineActivityTypeMaps'
            ]
        });
        return (0, _fromflattimelineactivitytypetotimelineactivitytypedtoutil.fromFlatTimelineActivityTypeToTimelineActivityTypeDto)((0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: flatTimelineActivityTypeToUpdate.id,
            flatEntityMaps: flatTimelineActivityTypeMaps
        }));
    }
    constructor(workspaceManyOrAllFlatEntityMapsCacheService, workspaceMigrationValidateBuildAndRunService, applicationService){
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.applicationService = applicationService;
    }
};
TimelineActivityTypeService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService
    ])
], TimelineActivityTypeService);

//# sourceMappingURL=timeline-activity-type.service.js.map