"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _createemptyflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _flatentitymapsexception = require("../../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _addflatentitytoflatentitymapsthroughmutationorthrowutil = require("../add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util");
const createMaps = ()=>(0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
const makeFlatEntity = (id, universalIdentifier, applicationId)=>({
        id,
        universalIdentifier,
        applicationId
    });
describe('addFlatEntityToFlatEntityMapsThroughMutationOrThrow', ()=>{
    it('should index a new entity by universalIdentifier and id', ()=>{
        const flatEntityMapsToMutate = createMaps();
        const flatEntity = makeFlatEntity('id-1', 'uid-1', 'app-1');
        (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
            flatEntity,
            flatEntityMapsToMutate
        });
        expect(flatEntityMapsToMutate.byUniversalIdentifier['uid-1']).toBe(flatEntity);
        expect(flatEntityMapsToMutate.universalIdentifierById['id-1']).toBe('uid-1');
        expect(flatEntityMapsToMutate.universalIdentifiersByApplicationId['app-1']).toEqual([
            'uid-1'
        ]);
    });
    it('should append entities that share an applicationId without duplicating', ()=>{
        const flatEntityMapsToMutate = createMaps();
        (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
            flatEntity: makeFlatEntity('id-1', 'uid-1', 'app-1'),
            flatEntityMapsToMutate
        });
        (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
            flatEntity: makeFlatEntity('id-2', 'uid-2', 'app-1'),
            flatEntityMapsToMutate
        });
        const universalIdentifiers = flatEntityMapsToMutate.universalIdentifiersByApplicationId['app-1'];
        expect(universalIdentifiers).toEqual([
            'uid-1',
            'uid-2'
        ]);
        expect(new Set(universalIdentifiers).size).toBe(universalIdentifiers?.length);
    });
    it('should not index entities that have no applicationId', ()=>{
        const flatEntityMapsToMutate = createMaps();
        (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
            flatEntity: makeFlatEntity('id-1', 'uid-1'),
            flatEntityMapsToMutate
        });
        expect(flatEntityMapsToMutate.universalIdentifiersByApplicationId).toEqual({});
    });
    it('should throw when the universalIdentifier already exists', ()=>{
        const flatEntityMapsToMutate = createMaps();
        (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
            flatEntity: makeFlatEntity('id-1', 'uid-1', 'app-1'),
            flatEntityMapsToMutate
        });
        expect(()=>(0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: makeFlatEntity('id-1-bis', 'uid-1', 'app-1'),
                flatEntityMapsToMutate
            })).toThrow(expect.objectContaining({
            code: _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_ALREADY_EXISTS
        }));
    });
    it('should retain every identifier when many entities share an applicationId', ()=>{
        const flatEntityMapsToMutate = createMaps();
        const entityCount = 20_000;
        for(let index = 0; index < entityCount; index++){
            (0, _addflatentitytoflatentitymapsthroughmutationorthrowutil.addFlatEntityToFlatEntityMapsThroughMutationOrThrow)({
                flatEntity: makeFlatEntity(`id-${index}`, `uid-${index}`, 'app-1'),
                flatEntityMapsToMutate
            });
        }
        expect(flatEntityMapsToMutate.universalIdentifiersByApplicationId['app-1']).toHaveLength(entityCount);
    });
});

//# sourceMappingURL=add-flat-entity-to-flat-entity-maps-through-mutation-or-throw.util.spec.js.map