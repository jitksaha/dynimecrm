"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _enrichcreateworkspacemigrationactionwithidsutil = require("../../../services/utils/enrich-create-workspace-migration-action-with-ids.util");
const _resolveuniversalrelationidentifierstoidsutil = require("../../../universal-flat-entity/utils/resolve-universal-relation-identifiers-to-ids.util");
const _buildpreallocatedidbyuniversalidentifierfromactionsutil = require("../build-preallocated-id-by-universal-identifier-from-actions.util");
const buildCreatePageLayoutAction = ({ pageLayoutUniversalIdentifier, defaultTabUniversalIdentifier })=>({
        type: 'create',
        metadataName: 'pageLayout',
        flatEntity: {
            universalIdentifier: pageLayoutUniversalIdentifier,
            defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: defaultTabUniversalIdentifier ?? null
        }
    });
const buildCreatePageLayoutTabAction = ({ tabUniversalIdentifier, pageLayoutUniversalIdentifier })=>({
        type: 'create',
        metadataName: 'pageLayoutTab',
        flatEntity: {
            universalIdentifier: tabUniversalIdentifier,
            pageLayoutUniversalIdentifier
        }
    });
const buildWorkspaceMigration = (actions)=>({
        applicationUniversalIdentifier: 'app',
        actions
    });
const EMPTY_FLAT_PAGE_LAYOUT_TAB_MAPS = {
    byUniversalIdentifier: {}
};
describe('buildPreallocatedIdByUniversalIdentifierFromActions', ()=>{
    it('should preallocate the id of every enriched create action', ()=>{
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                buildCreatePageLayoutAction({
                    pageLayoutUniversalIdentifier: 'layout'
                }),
                buildCreatePageLayoutTabAction({
                    tabUniversalIdentifier: 'tab',
                    pageLayoutUniversalIdentifier: 'layout'
                })
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const preallocatedIdByUniversalIdentifierByMetadataName = (0, _buildpreallocatedidbyuniversalidentifierfromactionsutil.buildPreallocatedIdByUniversalIdentifierFromActions)(workspaceMigration.actions);
        const [enrichedPageLayoutAction, enrichedPageLayoutTabAction] = workspaceMigration.actions;
        expect(preallocatedIdByUniversalIdentifierByMetadataName.pageLayout?.layout).toBe(enrichedPageLayoutAction.id);
        expect(preallocatedIdByUniversalIdentifierByMetadataName.pageLayoutTab?.tab).toBe(enrichedPageLayoutTabAction.id);
    });
    it('should let a pageLayout create resolve its default tab to the id of a tab created in the same migration', ()=>{
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                buildCreatePageLayoutAction({
                    pageLayoutUniversalIdentifier: 'layout',
                    defaultTabUniversalIdentifier: 'tab'
                }),
                buildCreatePageLayoutTabAction({
                    tabUniversalIdentifier: 'tab',
                    pageLayoutUniversalIdentifier: 'layout'
                })
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const [enrichedPageLayoutAction, enrichedPageLayoutTabAction] = workspaceMigration.actions;
        const { defaultTabToFocusOnMobileAndSidePanelId } = (0, _resolveuniversalrelationidentifierstoidsutil.resolveUniversalRelationIdentifiersToIds)({
            flatEntityMaps: {
                flatPageLayoutTabMaps: EMPTY_FLAT_PAGE_LAYOUT_TAB_MAPS
            },
            metadataName: 'pageLayout',
            universalForeignKeyValues: {
                defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: enrichedPageLayoutAction.flatEntity.defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier
            },
            preallocatedIdByUniversalIdentifierByMetadataName: (0, _buildpreallocatedidbyuniversalidentifierfromactionsutil.buildPreallocatedIdByUniversalIdentifierFromActions)(workspaceMigration.actions)
        });
        expect(defaultTabToFocusOnMobileAndSidePanelId).toBe(enrichedPageLayoutTabAction.id);
    });
});

//# sourceMappingURL=build-preallocated-id-by-universal-identifier-from-actions.util.spec.js.map