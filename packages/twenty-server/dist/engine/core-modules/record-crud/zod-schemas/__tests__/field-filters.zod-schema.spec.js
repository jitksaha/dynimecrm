"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _fieldfilterszodschema = require("../field-filters.zod-schema");
const _relationtypeinterface = require("../../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const fieldOfType = (type, name = 'body', settings)=>({
        type,
        name,
        settings
    });
describe('generateFieldFilterZodSchema', ()=>{
    describe('TEXT', ()=>{
        it('exposes scalar pattern operators at the field root', ()=>{
            const schema = (0, _fieldfilterszodschema.generateFieldFilterZodSchema)(fieldOfType(_types.FieldMetadataType.TEXT));
            expect(schema).not.toBeNull();
            expect(schema.parse({
                ilike: '%foo%'
            })).toEqual({
                ilike: '%foo%'
            });
        });
    });
    describe('RICH_TEXT', ()=>{
        // Regression for the AI find-records bug: RICH_TEXT is a composite
        // (`markdown` / `blocknote` sub-fields). Advertising root-level scalar
        // operators made the agent emit `{ ilike }`, which the query layer rejects
        // with `Sub field "ilike" not found for composite type: RICH_TEXT`.
        it('routes pattern operators onto the markdown sub-field', ()=>{
            const schema = (0, _fieldfilterszodschema.generateFieldFilterZodSchema)(fieldOfType(_types.FieldMetadataType.RICH_TEXT));
            expect(schema).not.toBeNull();
            expect(schema.parse({
                markdown: {
                    ilike: '%hello%'
                }
            })).toEqual({
                markdown: {
                    ilike: '%hello%'
                }
            });
        });
        it('no longer accepts scalar operators at the composite root', ()=>{
            const schema = (0, _fieldfilterszodschema.generateFieldFilterZodSchema)(fieldOfType(_types.FieldMetadataType.RICH_TEXT));
            // Root-level operators are stripped (unknown keys), so the malformed
            // `{ ilike }` filter never reaches the query runner.
            expect(schema.parse({
                ilike: '%hello%'
            })).toEqual({});
        });
    });
    describe('MORPH_RELATION', ()=>{
        // Regression: morph relations (e.g. noteTarget.targetPerson) are filtered
        // by their join column (`${name}Id`). Without a dedicated case they hit the
        // text default and advertise like/ilike, which the runner rejects when it
        // resolves the relation (`Object person doesn't have any "ilike" field`).
        const uuid = '7def8b6a-ec89-48f1-9835-ec2f7c726ef0';
        it('filters by the related record id and rejects text operators', ()=>{
            const schema = (0, _fieldfilterszodschema.generateFieldFilterZodSchema)(fieldOfType(_types.FieldMetadataType.MORPH_RELATION, 'targetPerson', {
                relationType: _relationtypeinterface.RelationType.MANY_TO_ONE
            }));
            expect(schema).not.toBeNull();
            expect(schema.parse({
                eq: uuid
            })).toEqual({
                eq: uuid
            });
            // `ilike` is not a valid operator for a relation id — stripped.
            expect(schema.parse({
                ilike: '%Tom%'
            })).toEqual({});
        });
    });
});

//# sourceMappingURL=field-filters.zod-schema.spec.js.map