"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommandMenuItemService", {
    enumerable: true,
    get: function() {
        return CommandMenuItemService;
    }
});
const _common = require("@nestjs/common");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _applicationservice = require("../../core-modules/application/application.service");
const _commandmenuitemexception = require("./command-menu-item.exception");
const _resolveeffectiveentitypropertyutil = require("../utils/resolve-effective-entity-property.util");
const _enginecomponentkeyenum = require("./enums/engine-component-key.enum");
const _interpolatenavigationcommandmenuitemfieldutil = require("./utils/interpolate-navigation-command-menu-item-field.util");
const _fromcreatecommandmenuiteminputtoflatcommandmenuitemtocreateutil = require("../flat-command-menu-item/utils/from-create-command-menu-item-input-to-flat-command-menu-item-to-create.util");
const _fromdeletecommandmenuiteminputtoflatcommandmenuitemorthrowutil = require("../flat-command-menu-item/utils/from-delete-command-menu-item-input-to-flat-command-menu-item-or-throw.util");
const _fromflatcommandmenuitemtocommandmenuitemdtoutil = require("../flat-command-menu-item/utils/from-flat-command-menu-item-to-command-menu-item-dto.util");
const _fromupdatecommandmenuiteminputtoflatcommandmenuitemtoupdateorthrowutil = require("../flat-command-menu-item/utils/from-update-command-menu-item-input-to-flat-command-menu-item-to-update-or-throw.util");
const _workspacemanyorallflatentitymapscacheservice = require("../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _findflatentitybyidinflatentitymapsorthrowutil = require("../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps-or-throw.util");
const _findflatentitybyidinflatentitymapsutil = require("../flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util");
const _iscalleroverridingentityutil = require("../utils/is-caller-overriding-entity.util");
const _workspacemigrationbuilderexception = require("../../workspace-manager/workspace-migration/exceptions/workspace-migration-builder-exception");
const _workspacemigrationvalidatebuildandrunservice = require("../../workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service");
const _applicationtranslationcatalogservice = require("../application-translation-catalog/services/application-translation-catalog.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let CommandMenuItemService = class CommandMenuItemService {
    async findAll(workspaceId) {
        const { flatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        return Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).sort((a, b)=>a.position - b.position).map(_fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto);
    }
    async findById(id, workspaceId) {
        const { flatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        const flatCommandMenuItem = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: id,
            flatEntityMaps: flatCommandMenuItemMaps
        });
        if (!(0, _utils.isDefined)(flatCommandMenuItem)) {
            return null;
        }
        return (0, _fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto)(flatCommandMenuItem);
    }
    async findByIdOrThrow(id, workspaceId) {
        const commandMenuItem = await this.findById(id, workspaceId);
        if (!(0, _utils.isDefined)(commandMenuItem)) {
            throw new _commandmenuitemexception.CommandMenuItemException('Command menu item not found', _commandmenuitemexception.CommandMenuItemExceptionCode.COMMAND_MENU_ITEM_NOT_FOUND);
        }
        return commandMenuItem;
    }
    async create(input, workspaceId) {
        const { flatObjectMetadataMaps, flatFrontComponentMaps, flatPageLayoutMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatObjectMetadataMaps',
                'flatFrontComponentMaps',
                'flatPageLayoutMaps'
            ]
        });
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const flatCommandMenuItemToCreate = (0, _fromcreatecommandmenuiteminputtoflatcommandmenuitemtocreateutil.fromCreateCommandMenuItemInputToFlatCommandMenuItemToCreate)({
            createCommandMenuItemInput: input,
            workspaceId,
            flatApplication: workspaceCustomFlatApplication,
            flatObjectMetadataMaps,
            flatFrontComponentMaps,
            flatPageLayoutMaps
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [
                        flatCommandMenuItemToCreate
                    ],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while creating command menu item');
        }
        const { flatCommandMenuItemMaps: recomputedFlatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        return (0, _fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto)((0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: flatCommandMenuItemToCreate.id,
            flatEntityMaps: recomputedFlatCommandMenuItemMaps
        }));
    }
    async update(input, workspaceId) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps, flatObjectMetadataMaps: existingFlatObjectMetadataMaps, flatPageLayoutMaps: existingFlatPageLayoutMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps',
                'flatObjectMetadataMaps',
                'flatPageLayoutMaps'
            ]
        });
        const flatCommandMenuItemToUpdate = (0, _fromupdatecommandmenuiteminputtoflatcommandmenuitemtoupdateorthrowutil.fromUpdateCommandMenuItemInputToFlatCommandMenuItemToUpdateOrThrow)({
            flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps,
            updateCommandMenuItemInput: input,
            flatObjectMetadataMaps: existingFlatObjectMetadataMaps,
            flatPageLayoutMaps: existingFlatPageLayoutMaps,
            callerApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        flatCommandMenuItemToUpdate
                    ]
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while updating command menu item');
        }
        const { flatCommandMenuItemMaps: recomputedFlatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        return (0, _fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto)((0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: input.id,
            flatEntityMaps: recomputedFlatCommandMenuItemMaps
        }));
    }
    async reset(id, workspaceId) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        const existingFlatCommandMenuItem = (0, _findflatentitybyidinflatentitymapsutil.findFlatEntityByIdInFlatEntityMaps)({
            flatEntityId: id,
            flatEntityMaps: existingFlatCommandMenuItemMaps
        });
        if (!(0, _utils.isDefined)(existingFlatCommandMenuItem)) {
            throw new _commandmenuitemexception.CommandMenuItemException('Command menu item not found', _commandmenuitemexception.CommandMenuItemExceptionCode.COMMAND_MENU_ITEM_NOT_FOUND);
        }
        if (existingFlatCommandMenuItem.applicationUniversalIdentifier === workspaceCustomFlatApplication.universalIdentifier) {
            throw new _commandmenuitemexception.CommandMenuItemException('Custom command menu item cannot be reset to default', _commandmenuitemexception.CommandMenuItemExceptionCode.COMMAND_MENU_ITEM_CANNOT_BE_RESET);
        }
        const flatCommandMenuItemToUpdate = {
            ...existingFlatCommandMenuItem,
            isActive: true,
            overrides: null,
            universalOverrides: null,
            updatedAt: new Date().toISOString()
        };
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: [],
                    flatEntityToUpdate: [
                        flatCommandMenuItemToUpdate
                    ]
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while resetting command menu item to default');
        }
        const { flatCommandMenuItemMaps: recomputedFlatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        return (0, _fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto)((0, _findflatentitybyidinflatentitymapsorthrowutil.findFlatEntityByIdInFlatEntityMapsOrThrow)({
            flatEntityId: id,
            flatEntityMaps: recomputedFlatCommandMenuItemMaps
        }));
    }
    async delete(id, workspaceId) {
        const { workspaceCustomFlatApplication } = await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
            workspaceId
        });
        const { flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        const flatCommandMenuItemToDelete = (0, _fromdeletecommandmenuiteminputtoflatcommandmenuitemorthrowutil.fromDeleteCommandMenuItemInputToFlatCommandMenuItemOrThrow)({
            flatCommandMenuItemMaps: existingFlatCommandMenuItemMaps,
            commandMenuItemId: id
        });
        const shouldDeactivate = (0, _iscalleroverridingentityutil.isCallerOverridingEntity)({
            callerApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            entityApplicationUniversalIdentifier: flatCommandMenuItemToDelete.applicationUniversalIdentifier,
            workspaceCustomApplicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            isSystemSideEffect: flatCommandMenuItemToDelete.isSystemSideEffect
        });
        const deactivatedFlatCommandMenuItem = {
            ...flatCommandMenuItemToDelete,
            isActive: false,
            updatedAt: new Date().toISOString()
        };
        const validateAndBuildResult = await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration({
            allFlatEntityOperationByMetadataName: {
                commandMenuItem: {
                    flatEntityToCreate: [],
                    flatEntityToDelete: shouldDeactivate ? [] : [
                        flatCommandMenuItemToDelete
                    ],
                    flatEntityToUpdate: shouldDeactivate ? [
                        deactivatedFlatCommandMenuItem
                    ] : []
                }
            },
            workspaceId,
            isSystemBuild: false,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier
        });
        if (validateAndBuildResult.status === 'fail') {
            throw new _workspacemigrationbuilderexception.WorkspaceMigrationBuilderException(validateAndBuildResult, 'Multiple validation errors occurred while deleting command menu item');
        }
        return (0, _fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto)(shouldDeactivate ? deactivatedFlatCommandMenuItem : flatCommandMenuItemToDelete);
    }
    async findAllFlatCommandMenuItems(workspaceId) {
        const { flatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        return Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).filter(_utils.isDefined).sort((a, b)=>a.position - b.position);
    }
    async loadNavigationObjectMetadata({ commandMenuItem, objectMetadataLoader, workspaceId }) {
        if (commandMenuItem.engineComponentKey !== _enginecomponentkeyenum.EngineComponentKey.NAVIGATION || !(0, _utils.isDefined)(commandMenuItem.navigationTargetObjectMetadataId)) {
            return null;
        }
        return objectMetadataLoader.load({
            objectMetadataId: commandMenuItem.navigationTargetObjectMetadataId,
            workspaceId
        });
    }
    async resolveTranslatedField({ commandMenuItem, fieldName, objectMetadataLoader, loaders, workspaceId, locale }) {
        const i18nContext = await this.applicationTranslationCatalogService.buildEffectiveEntityI18nContext({
            applicationId: commandMenuItem.applicationId,
            loaders,
            locale,
            workspaceId
        });
        const effectiveValue = (0, _resolveeffectiveentitypropertyutil.resolveEffectiveEntityProperty)({
            metadataName: 'commandMenuItem',
            baseValue: commandMenuItem[fieldName],
            overrides: commandMenuItem.overrides,
            property: fieldName,
            i18nContext
        });
        // shortLabel and icon are nullable columns, and resolveEffectiveEntityProperty
        // answers "what string should this be", flattening an absent value to ''.
        // Handing that straight back would turn every null into an empty string.
        const resolvedValue = (0, _guards.isNonEmptyString)(effectiveValue) ? effectiveValue : undefined;
        const objectMetadata = await this.loadNavigationObjectMetadata({
            commandMenuItem,
            objectMetadataLoader,
            workspaceId
        });
        if (!(0, _utils.isDefined)(objectMetadata)) {
            return (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
                commandMenuItem,
                resolvedValue,
                objectMetadata: null,
                objectMetadataI18nContext: i18nContext
            });
        }
        return (0, _interpolatenavigationcommandmenuitemfieldutil.interpolateNavigationCommandMenuItemField)({
            commandMenuItem,
            resolvedValue,
            objectMetadata,
            // The navigated-to object may belong to a different application than the
            // command menu item pointing at it.
            objectMetadataI18nContext: await this.applicationTranslationCatalogService.buildEffectiveEntityI18nContext({
                applicationId: objectMetadata.applicationId,
                loaders,
                locale,
                workspaceId
            })
        });
    }
    async findByWorkflowVersionId(workflowVersionId, workspaceId) {
        const { flatCommandMenuItemMaps } = await this.workspaceManyOrAllFlatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps({
            workspaceId,
            flatMapsKeys: [
                'flatCommandMenuItemMaps'
            ]
        });
        const flatCommandMenuItem = Object.values(flatCommandMenuItemMaps.byUniversalIdentifier).find((item)=>(0, _utils.isDefined)(item) && item.workflowVersionId === workflowVersionId);
        if (!(0, _utils.isDefined)(flatCommandMenuItem)) {
            return null;
        }
        return (0, _fromflatcommandmenuitemtocommandmenuitemdtoutil.fromFlatCommandMenuItemToCommandMenuItemDto)(flatCommandMenuItem);
    }
    constructor(workspaceMigrationValidateBuildAndRunService, workspaceManyOrAllFlatEntityMapsCacheService, applicationService, applicationTranslationCatalogService){
        this.workspaceMigrationValidateBuildAndRunService = workspaceMigrationValidateBuildAndRunService;
        this.workspaceManyOrAllFlatEntityMapsCacheService = workspaceManyOrAllFlatEntityMapsCacheService;
        this.applicationService = applicationService;
        this.applicationTranslationCatalogService = applicationTranslationCatalogService;
    }
};
CommandMenuItemService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService === "undefined" ? Object : _workspacemigrationvalidatebuildandrunservice.WorkspaceMigrationValidateBuildAndRunService,
        typeof _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService === "undefined" ? Object : _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _applicationtranslationcatalogservice.ApplicationTranslationCatalogService === "undefined" ? Object : _applicationtranslationcatalogservice.ApplicationTranslationCatalogService
    ])
], CommandMenuItemService);

//# sourceMappingURL=command-menu-item.service.js.map