"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _enrichcreateworkspacemigrationactionwithidsutil = require("../enrich-create-workspace-migration-action-with-ids.util");
const buildCreateFieldAction = ({ fieldUniversalIdentifier, relatedFieldUniversalIdentifier, junctionTargetFieldUniversalIdentifier })=>({
        type: 'create',
        metadataName: 'fieldMetadata',
        flatEntity: {
            universalIdentifier: fieldUniversalIdentifier,
            universalSettings: junctionTargetFieldUniversalIdentifier ? {
                junctionTargetFieldUniversalIdentifier
            } : undefined
        },
        relatedUniversalFlatFieldMetadata: relatedFieldUniversalIdentifier ? {
            universalIdentifier: relatedFieldUniversalIdentifier
        } : undefined
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
describe('enrichCreateWorkspaceMigrationActionsWithIds', ()=>{
    it('should assign an id to a create field action that has none', ()=>{
        const action = buildCreateFieldAction({
            fieldUniversalIdentifier: 'a'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                action
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const [enrichedAction] = workspaceMigration.actions;
        expect(enrichedAction.id).toEqual(expect.any(String));
    });
    it('should stamp a field id and a related field id consistently', ()=>{
        const action = buildCreateFieldAction({
            fieldUniversalIdentifier: 'source',
            relatedFieldUniversalIdentifier: 'target'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                action
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const [enrichedAction] = workspaceMigration.actions;
        expect(enrichedAction.id).toEqual(expect.any(String));
        expect(enrichedAction.relatedFieldId).toEqual(expect.any(String));
        expect(enrichedAction.id).not.toBe(enrichedAction.relatedFieldId);
    });
    it('should resolve a junction target field id to the same id the target action is created with', ()=>{
        const targetAction = buildCreateFieldAction({
            fieldUniversalIdentifier: 'target'
        });
        const junctionAction = buildCreateFieldAction({
            fieldUniversalIdentifier: 'junction',
            junctionTargetFieldUniversalIdentifier: 'target'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                junctionAction,
                targetAction
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const [enrichedJunctionAction, enrichedTargetAction] = workspaceMigration.actions;
        expect(enrichedJunctionAction.fieldIdByUniversalIdentifier?.target).toBe(enrichedTargetAction.id);
    });
    it('should set relatedFieldId to the id already minted for the target by an earlier action', ()=>{
        const targetAction = buildCreateFieldAction({
            fieldUniversalIdentifier: 'target'
        });
        const junctionAction = buildCreateFieldAction({
            fieldUniversalIdentifier: 'junction',
            relatedFieldUniversalIdentifier: 'target'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                targetAction,
                junctionAction
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const [enrichedTargetAction, enrichedJunctionAction] = workspaceMigration.actions;
        expect(enrichedJunctionAction.relatedFieldId).toBe(enrichedTargetAction.id);
    });
    it('should use the provided external id over a generated one', ()=>{
        const action = buildCreateFieldAction({
            fieldUniversalIdentifier: 'a'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                action
            ]),
            idByUniversalIdentifierByMetadataName: {
                fieldMetadata: {
                    a: 'external-id'
                }
            }
        });
        const [enrichedAction] = workspaceMigration.actions;
        expect(enrichedAction.id).toBe('external-id');
    });
    it('should mint an id for any create action so same-migration references can be preallocated', ()=>{
        const pageLayoutTabAction = buildCreatePageLayoutTabAction({
            tabUniversalIdentifier: 'tab',
            pageLayoutUniversalIdentifier: 'layout'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                pageLayoutTabAction
            ]),
            idByUniversalIdentifierByMetadataName: {}
        });
        const [enrichedAction] = workspaceMigration.actions;
        expect(enrichedAction.id).toEqual(expect.any(String));
    });
    it('should use the provided id over a generated one for any create action', ()=>{
        const pageLayoutTabAction = buildCreatePageLayoutTabAction({
            tabUniversalIdentifier: 'tab',
            pageLayoutUniversalIdentifier: 'layout'
        });
        const workspaceMigration = (0, _enrichcreateworkspacemigrationactionwithidsutil.enrichCreateWorkspaceMigrationActionsWithIds)({
            workspaceMigration: buildWorkspaceMigration([
                pageLayoutTabAction
            ]),
            idByUniversalIdentifierByMetadataName: {
                pageLayoutTab: {
                    tab: 'external-tab-id'
                }
            }
        });
        const [enrichedAction] = workspaceMigration.actions;
        expect(enrichedAction.id).toBe('external-tab-id');
    });
});

//# sourceMappingURL=enrich-create-workspace-migration-action-with-ids.util.spec.js.map