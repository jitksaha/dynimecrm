"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _emptyorchestratoractionsreportconstant = require("../../constant/empty-orchestrator-actions-report.constant");
const _computeorderedmigrationactionsutil = require("../compute-ordered-migration-actions.util");
describe('computeOrderedMigrationActions', ()=>{
    it('should run pageLayout updates after pageLayoutTab creates so defaultTabToFocusOnMobileAndSidePanel can reference a tab created in the same migration', ()=>{
        const pageLayoutUpdateAction = {
            type: 'update',
            metadataName: 'pageLayout',
            universalIdentifier: 'layout',
            update: {
                defaultTabToFocusOnMobileAndSidePanelUniversalIdentifier: 'tab'
            }
        };
        const pageLayoutTabCreateAction = {
            type: 'create',
            metadataName: 'pageLayoutTab',
            flatEntity: {
                universalIdentifier: 'tab',
                pageLayoutUniversalIdentifier: 'layout'
            }
        };
        const orchestratorActionsReport = (0, _emptyorchestratoractionsreportconstant.createEmptyOrchestratorActionsReport)();
        orchestratorActionsReport.pageLayout.update.push(pageLayoutUpdateAction);
        orchestratorActionsReport.pageLayoutTab.create.push(pageLayoutTabCreateAction);
        const orderedActions = (0, _computeorderedmigrationactionsutil.computeOrderedMigrationActions)(orchestratorActionsReport);
        expect(orderedActions.indexOf(pageLayoutTabCreateAction)).toBeLessThan(orderedActions.indexOf(pageLayoutUpdateAction));
    });
    it('should run pageLayout creates before pageLayoutTab creates', ()=>{
        const pageLayoutCreateAction = {
            type: 'create',
            metadataName: 'pageLayout',
            flatEntity: {
                universalIdentifier: 'layout'
            }
        };
        const pageLayoutTabCreateAction = {
            type: 'create',
            metadataName: 'pageLayoutTab',
            flatEntity: {
                universalIdentifier: 'tab',
                pageLayoutUniversalIdentifier: 'layout'
            }
        };
        const orchestratorActionsReport = (0, _emptyorchestratoractionsreportconstant.createEmptyOrchestratorActionsReport)();
        orchestratorActionsReport.pageLayout.create.push(pageLayoutCreateAction);
        orchestratorActionsReport.pageLayoutTab.create.push(pageLayoutTabCreateAction);
        const orderedActions = (0, _computeorderedmigrationactionsutil.computeOrderedMigrationActions)(orchestratorActionsReport);
        expect(orderedActions.indexOf(pageLayoutCreateAction)).toBeLessThan(orderedActions.indexOf(pageLayoutTabCreateAction));
    });
});

//# sourceMappingURL=compute-ordered-migration-actions.util.spec.js.map