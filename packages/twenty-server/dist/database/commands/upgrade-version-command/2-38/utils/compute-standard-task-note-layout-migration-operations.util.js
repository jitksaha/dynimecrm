"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardTaskNoteLayoutMigrationOperations", {
    enumerable: true,
    get: function() {
        return computeStandardTaskNoteLayoutMigrationOperations;
    }
});
const _utils = require("twenty-shared/utils");
const _standardtasknotelayoutmigrationtargetsconstant = require("../constants/standard-task-note-layout-migration-targets.constant");
const hasWorkspaceCustomization = (flatEntity, standardApplicationId)=>flatEntity.applicationId !== standardApplicationId || (0, _utils.isDefined)(flatEntity.overrides) || !flatEntity.isActive;
const hasSameUniversalIdentifiers = (actualUniversalIdentifiers, expectedUniversalIdentifiers)=>actualUniversalIdentifiers.length === expectedUniversalIdentifiers.length && actualUniversalIdentifiers.every((universalIdentifier)=>expectedUniversalIdentifiers.includes(universalIdentifier));
const matchesExpectedMigrationState = ({ targetLayout, tabUniversalIdentifiers, widgetUniversalIdentifiers, viewFieldUniversalIdentifiers, viewFieldGroupUniversalIdentifiers })=>{
    const matchesState = (state)=>hasSameUniversalIdentifiers(tabUniversalIdentifiers, targetLayout[`${state}TabUniversalIdentifiers`]) && hasSameUniversalIdentifiers(widgetUniversalIdentifiers, targetLayout[`${state}WidgetUniversalIdentifiers`]) && hasSameUniversalIdentifiers(viewFieldUniversalIdentifiers, targetLayout[`${state}ViewFieldUniversalIdentifiers`]) && hasSameUniversalIdentifiers(viewFieldGroupUniversalIdentifiers, targetLayout[`${state}ViewFieldGroupUniversalIdentifiers`]);
    return matchesState('preMigration') || matchesState('postMigration');
};
const computeStandardTaskNoteLayoutMigrationOperations = ({ flatMaps: { flatPageLayoutMaps, flatPageLayoutTabMaps, flatPageLayoutWidgetMaps, flatViewMaps, flatViewFieldMaps, flatViewFieldGroupMaps }, standardApplicationId })=>{
    const pageLayoutTabsToDelete = [];
    const viewFieldsToDelete = [];
    const viewFieldGroupsToDelete = [];
    const skippedLayouts = [];
    for (const targetLayout of _standardtasknotelayoutmigrationtargetsconstant.STANDARD_TASK_NOTE_LAYOUT_MIGRATION_TARGETS){
        const existingPageLayout = flatPageLayoutMaps.byUniversalIdentifier[targetLayout.pageLayoutUniversalIdentifier];
        const existingFieldsView = flatViewMaps.byUniversalIdentifier[targetLayout.fieldsViewUniversalIdentifier];
        if (!(0, _utils.isDefined)(existingPageLayout) || !(0, _utils.isDefined)(existingFieldsView)) {
            skippedLayouts.push({
                label: targetLayout.label,
                reason: 'incomplete'
            });
            continue;
        }
        const existingTabs = existingPageLayout.tabUniversalIdentifiers.map((universalIdentifier)=>flatPageLayoutTabMaps.byUniversalIdentifier[universalIdentifier]);
        const existingWidgets = existingTabs.flatMap((tab)=>(0, _utils.isDefined)(tab) ? tab.widgetUniversalIdentifiers.map((universalIdentifier)=>flatPageLayoutWidgetMaps.byUniversalIdentifier[universalIdentifier]) : []);
        const existingViewFields = existingFieldsView.viewFieldUniversalIdentifiers.map((universalIdentifier)=>flatViewFieldMaps.byUniversalIdentifier[universalIdentifier]);
        const existingViewFieldGroups = existingFieldsView.viewFieldGroupUniversalIdentifiers.map((universalIdentifier)=>flatViewFieldGroupMaps.byUniversalIdentifier[universalIdentifier]);
        const allExistingChildren = [
            ...existingTabs,
            ...existingWidgets,
            ...existingViewFields,
            ...existingViewFieldGroups
        ];
        if (allExistingChildren.some((flatEntity)=>!(0, _utils.isDefined)(flatEntity))) {
            skippedLayouts.push({
                label: targetLayout.label,
                reason: 'incomplete'
            });
            continue;
        }
        const definedExistingTabs = existingTabs.filter(_utils.isDefined);
        const definedExistingWidgets = existingWidgets.filter(_utils.isDefined);
        const definedExistingViewFields = existingViewFields.filter(_utils.isDefined);
        const definedExistingViewFieldGroups = existingViewFieldGroups.filter(_utils.isDefined);
        const hasExpectedChildSets = matchesExpectedMigrationState({
            targetLayout,
            tabUniversalIdentifiers: existingPageLayout.tabUniversalIdentifiers,
            widgetUniversalIdentifiers: definedExistingWidgets.map((widget)=>widget.universalIdentifier),
            viewFieldUniversalIdentifiers: existingFieldsView.viewFieldUniversalIdentifiers,
            viewFieldGroupUniversalIdentifiers: existingFieldsView.viewFieldGroupUniversalIdentifiers
        });
        const hasCustomizedMetadata = [
            ...definedExistingTabs,
            ...definedExistingWidgets,
            existingFieldsView,
            ...definedExistingViewFields,
            ...definedExistingViewFieldGroups
        ].some((flatEntity)=>hasWorkspaceCustomization(flatEntity, standardApplicationId));
        const hasFieldsViewConfiguration = existingFieldsView.viewFilterUniversalIdentifiers.length > 0 || existingFieldsView.viewFilterGroupUniversalIdentifiers.length > 0 || existingFieldsView.viewGroupUniversalIdentifiers.length > 0 || existingFieldsView.viewSortUniversalIdentifiers.length > 0;
        if (existingPageLayout.applicationId !== standardApplicationId || !hasExpectedChildSets || hasCustomizedMetadata || hasFieldsViewConfiguration) {
            skippedLayouts.push({
                label: targetLayout.label,
                reason: 'customized'
            });
            continue;
        }
        pageLayoutTabsToDelete.push(...targetLayout.removedTabUniversalIdentifiers.map((universalIdentifier)=>flatPageLayoutTabMaps.byUniversalIdentifier[universalIdentifier]).filter((tab)=>(0, _utils.isDefined)(tab)));
        viewFieldsToDelete.push(...targetLayout.removedViewFieldUniversalIdentifiers.map((universalIdentifier)=>flatViewFieldMaps.byUniversalIdentifier[universalIdentifier]).filter((viewField)=>(0, _utils.isDefined)(viewField)));
        viewFieldGroupsToDelete.push(...targetLayout.removedViewFieldGroupUniversalIdentifiers.map((universalIdentifier)=>flatViewFieldGroupMaps.byUniversalIdentifier[universalIdentifier]).filter((viewFieldGroup)=>(0, _utils.isDefined)(viewFieldGroup)));
    }
    return {
        pageLayoutTabsToDelete,
        viewFieldsToDelete,
        viewFieldGroupsToDelete,
        skippedLayouts
    };
};

//# sourceMappingURL=compute-standard-task-note-layout-migration-operations.util.js.map