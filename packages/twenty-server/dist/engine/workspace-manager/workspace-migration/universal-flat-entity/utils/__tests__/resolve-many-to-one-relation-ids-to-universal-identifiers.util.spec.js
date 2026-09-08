"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _flatentitymapsexception = require("../../../../../metadata-modules/flat-entity/exceptions/flat-entity-maps.exception");
const _resolvemanytoonerelationidstouniversalidentifiersutil = require("../resolve-many-to-one-relation-ids-to-universal-identifiers.util");
const buildArgs = (args)=>({
        ...args,
        entity: args.entity
    });
describe('resolveManyToOneRelationIdsToUniversalIdentifiers', ()=>{
    describe('application resolution', ()=>{
        it('should resolve only the application universal identifier when the entity has no other many-to-one relations', ()=>{
            const result = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                metadataName: 'permissionFlag',
                entity: {
                    id: 'permission-flag-id-1',
                    applicationId: 'app-id-1'
                },
                applicationIdToUniversalIdentifierMap: new Map([
                    [
                        'app-id-1',
                        'app-ui-1'
                    ]
                ])
            }));
            expect(result).toEqual({
                applicationUniversalIdentifier: 'app-ui-1'
            });
        });
        it('should throw when the applicationId is not present in the map', ()=>{
            expect(()=>(0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                    metadataName: 'permissionFlag',
                    entity: {
                        id: 'permission-flag-id-1',
                        applicationId: 'app-id-1'
                    },
                    applicationIdToUniversalIdentifierMap: new Map()
                }))).toThrow(expect.objectContaining({
                code: _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND
            }));
        });
        it('should throw when the entity has no applicationId', ()=>{
            expect(()=>(0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                    metadataName: 'permissionFlag',
                    entity: {
                        id: 'permission-flag-id-1',
                        applicationId: null
                    },
                    applicationIdToUniversalIdentifierMap: new Map([
                        [
                            'app-id-1',
                            'app-ui-1'
                        ]
                    ])
                }))).toThrow(expect.objectContaining({
                code: _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND
            }));
        });
    });
    describe('non-nullable relations', ()=>{
        it('should resolve universal identifiers for application and non-nullable foreign keys', ()=>{
            const result = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                metadataName: 'viewField',
                entity: {
                    id: 'view-field-id-1',
                    applicationId: 'app-id-1',
                    fieldMetadataId: 'field-id-1',
                    viewId: 'view-id-1',
                    viewFieldGroupId: 'view-field-group-id-1'
                },
                applicationIdToUniversalIdentifierMap: new Map([
                    [
                        'app-id-1',
                        'app-ui-1'
                    ]
                ]),
                fieldMetadataIdToUniversalIdentifierMap: new Map([
                    [
                        'field-id-1',
                        'field-ui-1'
                    ]
                ]),
                viewIdToUniversalIdentifierMap: new Map([
                    [
                        'view-id-1',
                        'view-ui-1'
                    ]
                ]),
                viewFieldGroupIdToUniversalIdentifierMap: new Map([
                    [
                        'view-field-group-id-1',
                        'view-field-group-ui-1'
                    ]
                ])
            }));
            expect(result).toEqual({
                applicationUniversalIdentifier: 'app-ui-1',
                fieldMetadataUniversalIdentifier: 'field-ui-1',
                viewUniversalIdentifier: 'view-ui-1',
                viewFieldGroupUniversalIdentifier: 'view-field-group-ui-1'
            });
        });
        it('should throw when a non-nullable foreign key id is missing from the map', ()=>{
            expect(()=>(0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                    metadataName: 'viewField',
                    entity: {
                        id: 'view-field-id-1',
                        applicationId: 'app-id-1',
                        fieldMetadataId: 'non-existent-field-id',
                        viewId: 'view-id-1',
                        viewFieldGroupId: null
                    },
                    applicationIdToUniversalIdentifierMap: new Map([
                        [
                            'app-id-1',
                            'app-ui-1'
                        ]
                    ]),
                    fieldMetadataIdToUniversalIdentifierMap: new Map(),
                    viewIdToUniversalIdentifierMap: new Map([
                        [
                            'view-id-1',
                            'view-ui-1'
                        ]
                    ]),
                    viewFieldGroupIdToUniversalIdentifierMap: new Map()
                }))).toThrow(expect.objectContaining({
                code: _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND
            }));
        });
        it('should throw a malformed-entity error when a non-nullable foreign key is itself missing', ()=>{
            expect(()=>(0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                    metadataName: 'viewField',
                    entity: {
                        id: 'view-field-id-1',
                        applicationId: 'app-id-1',
                        fieldMetadataId: null,
                        viewId: 'view-id-1',
                        viewFieldGroupId: null
                    },
                    applicationIdToUniversalIdentifierMap: new Map([
                        [
                            'app-id-1',
                            'app-ui-1'
                        ]
                    ]),
                    fieldMetadataIdToUniversalIdentifierMap: new Map([
                        [
                            'field-id-1',
                            'field-ui-1'
                        ]
                    ]),
                    viewIdToUniversalIdentifierMap: new Map([
                        [
                            'view-id-1',
                            'view-ui-1'
                        ]
                    ]),
                    viewFieldGroupIdToUniversalIdentifierMap: new Map()
                }))).toThrow(expect.objectContaining({
                code: _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_MALFORMED
            }));
        });
    });
    describe('nullable relations', ()=>{
        it('should resolve a nullable foreign key to null when its id is not defined', ()=>{
            const result = (0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                metadataName: 'viewField',
                entity: {
                    id: 'view-field-id-1',
                    applicationId: 'app-id-1',
                    fieldMetadataId: 'field-id-1',
                    viewId: 'view-id-1',
                    viewFieldGroupId: null
                },
                applicationIdToUniversalIdentifierMap: new Map([
                    [
                        'app-id-1',
                        'app-ui-1'
                    ]
                ]),
                fieldMetadataIdToUniversalIdentifierMap: new Map([
                    [
                        'field-id-1',
                        'field-ui-1'
                    ]
                ]),
                viewIdToUniversalIdentifierMap: new Map([
                    [
                        'view-id-1',
                        'view-ui-1'
                    ]
                ]),
                viewFieldGroupIdToUniversalIdentifierMap: new Map()
            }));
            expect(result).toEqual({
                applicationUniversalIdentifier: 'app-ui-1',
                fieldMetadataUniversalIdentifier: 'field-ui-1',
                viewUniversalIdentifier: 'view-ui-1',
                viewFieldGroupUniversalIdentifier: null
            });
        });
        it('should throw when a nullable foreign key has an id that is missing from the map', ()=>{
            expect(()=>(0, _resolvemanytoonerelationidstouniversalidentifiersutil.resolveManyToOneRelationIdsToUniversalIdentifiers)(buildArgs({
                    metadataName: 'viewField',
                    entity: {
                        id: 'view-field-id-1',
                        applicationId: 'app-id-1',
                        fieldMetadataId: 'field-id-1',
                        viewId: 'view-id-1',
                        viewFieldGroupId: 'non-existent-view-field-group-id'
                    },
                    applicationIdToUniversalIdentifierMap: new Map([
                        [
                            'app-id-1',
                            'app-ui-1'
                        ]
                    ]),
                    fieldMetadataIdToUniversalIdentifierMap: new Map([
                        [
                            'field-id-1',
                            'field-ui-1'
                        ]
                    ]),
                    viewIdToUniversalIdentifierMap: new Map([
                        [
                            'view-id-1',
                            'view-ui-1'
                        ]
                    ]),
                    viewFieldGroupIdToUniversalIdentifierMap: new Map()
                }))).toThrow(expect.objectContaining({
                code: _flatentitymapsexception.FlatEntityMapsExceptionCode.ENTITY_NOT_FOUND
            }));
        });
    });
});

//# sourceMappingURL=resolve-many-to-one-relation-ids-to-universal-identifiers.util.spec.js.map