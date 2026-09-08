"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CampaignVariableService", {
    enumerable: true,
    get: function() {
        return CampaignVariableService;
    }
});
const _common = require("@nestjs/common");
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _emailingdomainexception = require("../../../engine/core-modules/emailing-domain/exceptions/emailing-domain.exception");
const _getflatfieldsforflatobjectmetadatautil = require("../../../engine/api/graphql/workspace-schema-builder/utils/get-flat-fields-for-flat-object-metadata.util");
const _workspacemanyorallflatentitymapscacheservice = require("../../../engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const COMPUTED_VARIABLE_NAMES = [
    'fullName',
    'personId'
];
const MAX_VARIABLES_IN_ERROR_MESSAGE = 40;
let CampaignVariableService = class CampaignVariableService {
    async getPersonCampaignVariables(workspaceId) {
        const fields = await this.getPersonFields(workspaceId);
        const definitions = (0, _utils.listCampaignVariablesForFields)(fields);
        const knownVariableNames = new Set([
            ...definitions.map((definition)=>definition.name),
            ...COMPUTED_VARIABLE_NAMES
        ]);
        return {
            definitions,
            knownVariableNames
        };
    }
    async assertKnownVariables(workspaceId, usedVariableNames) {
        const { definitions, knownVariableNames } = await this.getPersonCampaignVariables(workspaceId);
        const unknownVariables = [
            ...usedVariableNames
        ].filter((variableName)=>!knownVariableNames.has(variableName));
        if (unknownVariables.length === 0) {
            return;
        }
        const availableList = [
            ...COMPUTED_VARIABLE_NAMES,
            ...definitions.map((definition)=>definition.name)
        ].slice(0, MAX_VARIABLES_IN_ERROR_MESSAGE).join(', ');
        throw new _emailingdomainexception.EmailingDomainException(`Unknown campaign variables: ${unknownVariables.join(', ')}. ` + `Available variables: ${availableList}`, _emailingdomainexception.EmailingDomainExceptionCode.MESSAGE_CAMPAIGN_NOT_SENDABLE);
    }
    async buildVariablesForPerson(workspaceId, person) {
        const { definitions } = await this.getPersonCampaignVariables(workspaceId);
        const fieldsByName = await this.getPersonFieldsByName(workspaceId);
        const variables = {};
        for (const definition of definitions){
            variables[definition.name] = this.formatValue(this.resolveValue(person, definition.name), definition, fieldsByName.get(definition.fieldName));
        }
        variables.personId = this.stringify(this.resolveValue(person, 'id'));
        variables.fullName = [
            this.stringify(this.resolveValue(person, 'name.firstName')),
            this.stringify(this.resolveValue(person, 'name.lastName'))
        ].filter(Boolean).join(' ');
        return variables;
    }
    async getPersonFields(workspaceId) {
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFieldMetadataMaps'
            ]
        });
        const personFlatObject = flatObjectMetadataMaps.byUniversalIdentifier[_metadata.STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person];
        if (!(0, _utils.isDefined)(personFlatObject)) {
            return [];
        }
        return (0, _getflatfieldsforflatobjectmetadatautil.getFlatFieldsFromFlatObjectMetadata)(personFlatObject, flatFieldMetadataMaps);
    }
    async getPersonFieldsByName(workspaceId) {
        const fields = await this.getPersonFields(workspaceId);
        return new Map(fields.map((field)=>[
                field.name,
                field
            ]));
    }
    resolveValue(person, path) {
        if (!(0, _utils.isDefined)(person)) {
            return null;
        }
        return path.split('.').reduce((value, segment)=>typeof value === 'object' && value !== null ? value[segment] : null, person);
    }
    formatValue(value, definition, field) {
        if (!(0, _utils.isDefined)(value) || value === '') {
            return '';
        }
        switch(definition.fieldType){
            case _types.FieldMetadataType.DATE:
            case _types.FieldMetadataType.DATE_TIME:
                {
                    const date = new Date(value);
                    return Number.isNaN(date.getTime()) ? this.stringify(value) : date.toISOString().slice(0, 10);
                }
            case _types.FieldMetadataType.SELECT:
            case _types.FieldMetadataType.RATING:
                {
                    const option = field?.options?.find((fieldOption)=>fieldOption.value === value);
                    return option?.label ?? this.stringify(value);
                }
            default:
                return this.stringify(value);
        }
    }
    stringify(value) {
        return (0, _utils.isDefined)(value) ? String(value) : '';
    }
    constructor(flatEntityMapsCacheService){
        this.flatEntityMapsCacheService = flatEntityMapsCacheService;
    }
};
CampaignVariableService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService
    ])
], CampaignVariableService);

//# sourceMappingURL=campaign-variable.service.js.map