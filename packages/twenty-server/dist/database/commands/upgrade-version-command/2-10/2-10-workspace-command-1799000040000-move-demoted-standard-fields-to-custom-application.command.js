"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MoveDemotedStandardFieldsToCustomApplicationCommand", {
    enumerable: true,
    get: function() {
        return MoveDemotedStandardFieldsToCustomApplicationCommand;
    }
});
const _nestcommander = require("nest-commander");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _provisionedworkspacecommandrunner = require("../../command-runners/provisioned-workspace.command-runner");
const _workspaceiteratorservice = require("../../command-runners/workspace-iterator.service");
const _applicationservice = require("../../../../engine/core-modules/application/application.service");
const _registeredworkspacecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-workspace-command.decorator");
const _fieldmetadataentity = require("../../../../engine/metadata-modules/field-metadata/field-metadata.entity");
const _findflatentitybyuniversalidentifierutil = require("../../../../engine/metadata-modules/flat-entity/utils/find-flat-entity-by-universal-identifier.util");
const _getmetadataflatentitymapskeyutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-flat-entity-maps-key.util");
const _getmetadatarelatedmetadatanamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-related-metadata-names.util");
const _getmetadataserializedrelationnamesutil = require("../../../../engine/metadata-modules/flat-entity/utils/get-metadata-serialized-relation-names.util");
const _workspacemetadataversionservice = require("../../../../engine/metadata-modules/workspace-metadata-version/services/workspace-metadata-version.service");
const _workspacecacheservice = require("../../../../engine/workspace-cache/services/workspace-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const DEMOTED_STANDARD_FIELDS = [
    {
        universalIdentifier: '20202020-602a-495c-9776-f5d5b11d227b',
        label: 'Company.annualRecurringRevenue'
    },
    {
        universalIdentifier: '20202020-8965-464a-8a75-74bafc152a0b',
        label: 'Company.employees'
    },
    {
        universalIdentifier: '20202020-ba6b-438a-8213-2c5ba28d76a2',
        label: 'Company.idealCustomerProfile'
    },
    {
        universalIdentifier: '20202020-6f64-4fd9-9580-9c1991c7d8c3',
        label: 'Company.xLink'
    },
    {
        universalIdentifier: '20202020-8fc2-487c-b84a-55a99b145cfd',
        label: 'Person.xLink'
    },
    {
        universalIdentifier: '20202020-5243-4ffb-afc5-2c675da41346',
        label: 'Person.city'
    }
];
let MoveDemotedStandardFieldsToCustomApplicationCommand = class MoveDemotedStandardFieldsToCustomApplicationCommand extends _provisionedworkspacecommandrunner.ProvisionedWorkspaceCommandRunner {
    async runOnWorkspace({ workspaceId, options }) {
        const isDryRun = options.dryRun ?? false;
        const { twentyStandardFlatApplication, workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatFieldMetadataMaps } = await this.workspaceCacheService.getOrRecompute(workspaceId, [
            'flatFieldMetadataMaps'
        ]);
        const fieldsToReown = [];
        for (const { universalIdentifier, label } of DEMOTED_STANDARD_FIELDS){
            const flatFieldMetadata = (0, _findflatentitybyuniversalidentifierutil.findFlatEntityByUniversalIdentifier)({
                flatEntityMaps: flatFieldMetadataMaps,
                universalIdentifier
            });
            if (!(0, _utils.isDefined)(flatFieldMetadata)) {
                continue;
            }
            const isStillOwnedByStandardApplication = flatFieldMetadata.applicationId === twentyStandardFlatApplication.id && !flatFieldMetadata.isCustom;
            if (!isStillOwnedByStandardApplication) {
                continue;
            }
            fieldsToReown.push({
                id: flatFieldMetadata.id,
                label
            });
        }
        if (fieldsToReown.length === 0) {
            this.logger.log(`No standard fields to move to the custom application for workspace ${workspaceId}`);
            return;
        }
        this.logger.log(`${isDryRun ? '[DRY RUN] ' : ''}Moving ${fieldsToReown.length} field(s) to the custom application for workspace ${workspaceId}: ${fieldsToReown.map(({ label })=>label).join(', ')}`);
        if (isDryRun) {
            return;
        }
        for (const { id } of fieldsToReown){
            await this.fieldMetadataRepository.update({
                id
            }, {
                applicationId: workspaceCustomFlatApplication.id,
                isCustom: true,
                universalIdentifier: (0, _uuid.v4)()
            });
        }
        const fieldMetadataRelatedNames = [
            'fieldMetadata',
            ...(0, _getmetadatarelatedmetadatanamesutil.getMetadataRelatedMetadataNames)('fieldMetadata'),
            ...(0, _getmetadataserializedrelationnamesutil.getMetadataSerializedRelationNames)('fieldMetadata')
        ];
        const cacheKeysToFlush = [
            ...new Set(fieldMetadataRelatedNames.map(_getmetadataflatentitymapskeyutil.getMetadataFlatEntityMapsKey))
        ];
        await this.workspaceCacheService.flush(workspaceId, cacheKeysToFlush);
        await this.workspaceMetadataVersionService.incrementMetadataVersion(workspaceId);
        this.logger.log(`Moved ${fieldsToReown.length} field(s) to the custom application for workspace ${workspaceId}`);
    }
    constructor(workspaceIteratorService, applicationService, workspaceCacheService, workspaceMetadataVersionService, fieldMetadataRepository){
        super(workspaceIteratorService), this.workspaceIteratorService = workspaceIteratorService, this.applicationService = applicationService, this.workspaceCacheService = workspaceCacheService, this.workspaceMetadataVersionService = workspaceMetadataVersionService, this.fieldMetadataRepository = fieldMetadataRepository;
    }
};
MoveDemotedStandardFieldsToCustomApplicationCommand = _ts_decorate([
    (0, _registeredworkspacecommanddecorator.RegisteredWorkspaceCommand)('2.10.0', 1799000040000),
    (0, _nestcommander.Command)({
        name: 'upgrade:2-10:move-demoted-standard-fields-to-custom-application',
        description: 'Re-own the demoted Company ARR / ICP / Employees, Company/Person X (Twitter) and Person City standard fields to the workspace custom application, preserving their data and keeping them active'
    }),
    _ts_param(4, (0, _typeorm.InjectRepository)(_fieldmetadataentity.FieldMetadataEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceiteratorservice.WorkspaceIteratorService === "undefined" ? Object : _workspaceiteratorservice.WorkspaceIteratorService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _workspacecacheservice.WorkspaceCacheService === "undefined" ? Object : _workspacecacheservice.WorkspaceCacheService,
        typeof _workspacemetadataversionservice.WorkspaceMetadataVersionService === "undefined" ? Object : _workspacemetadataversionservice.WorkspaceMetadataVersionService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository
    ])
], MoveDemotedStandardFieldsToCustomApplicationCommand);

//# sourceMappingURL=2-10-workspace-command-1799000040000-move-demoted-standard-fields-to-custom-application.command.js.map