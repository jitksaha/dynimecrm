"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _isallowedflatviewkanbanmaingroupbyfieldutil = require("../is-allowed-flat-view-kanban-main-group-by-field.util");
const buildField = (field)=>field;
describe('isAllowedFlatViewKanbanMainGroupByField', ()=>{
    it('should allow a SELECT field', ()=>{
        expect((0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata: buildField({
                type: _types.FieldMetadataType.SELECT
            })
        })).toBe(true);
    });
    it('should allow a MANY_TO_ONE relation field', ()=>{
        expect((0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata: buildField({
                type: _types.FieldMetadataType.RELATION,
                universalSettings: {
                    relationType: _types.RelationType.MANY_TO_ONE
                }
            })
        })).toBe(true);
    });
    it('should reject a ONE_TO_MANY relation field', ()=>{
        expect((0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata: buildField({
                type: _types.FieldMetadataType.RELATION,
                universalSettings: {
                    relationType: _types.RelationType.ONE_TO_MANY
                }
            })
        })).toBe(false);
    });
    it('should reject a relation field with no relation type set', ()=>{
        expect((0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata: buildField({
                type: _types.FieldMetadataType.RELATION,
                universalSettings: {}
            })
        })).toBe(false);
    });
    it('should reject a plain scalar field', ()=>{
        expect((0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata: buildField({
                type: _types.FieldMetadataType.TEXT
            })
        })).toBe(false);
    });
    it('should reject a MULTI_SELECT field', ()=>{
        expect((0, _isallowedflatviewkanbanmaingroupbyfieldutil.isAllowedFlatViewKanbanMainGroupByField)({
            mainGroupByFieldMetadata: buildField({
                type: _types.FieldMetadataType.MULTI_SELECT
            })
        })).toBe(false);
    });
});

//# sourceMappingURL=is-allowed-flat-view-kanban-main-group-by-field.util.spec.js.map