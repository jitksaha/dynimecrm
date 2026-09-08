"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _cursorsutil = require("../cursors.util");
const buildMockField = (id, name, type, overrides = {})=>({
        id,
        universalIdentifier: id,
        name,
        type,
        ...overrides,
        objectMetadataId: 'obj-id',
        workspaceId: 'ws-id',
        label: name,
        isNullable: true,
        isLabelSyncedWithName: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        viewFieldIds: [],
        viewFilterIds: [],
        kanbanAggregateOperationViewIds: [],
        calendarViewIds: [],
        applicationId: null
    });
const nameField = buildMockField('name-id', 'name', _types.FieldMetadataType.TEXT);
const fullNameField = buildMockField('fullname-id', 'fullName', _types.FieldMetadataType.FULL_NAME);
const companyField = buildMockField('company-id', 'company', _types.FieldMetadataType.RELATION, {
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    }
});
const ownerField = buildMockField('owner-id', 'owner', _types.FieldMetadataType.MORPH_RELATION, {
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    }
});
const flatFieldMetadataMaps = {
    byUniversalIdentifier: {
        'name-id': nameField,
        'fullname-id': fullNameField,
        'company-id': companyField,
        'owner-id': ownerField
    },
    universalIdentifierById: {
        'name-id': 'name-id',
        'fullname-id': 'fullname-id',
        'company-id': 'company-id',
        'owner-id': 'owner-id'
    },
    universalIdentifiersByApplicationId: {}
};
const flatObjectMetadata = {
    id: 'obj-id',
    universalIdentifier: 'obj-id',
    workspaceId: 'ws-id',
    nameSingular: 'person',
    namePlural: 'people',
    labelSingular: 'Person',
    labelPlural: 'People',
    targetTableName: 'person',
    isRemote: false,
    isActive: true,
    isSystem: false,
    isAuditLogged: false,
    isSearchable: false,
    icon: 'Icon123',
    createdAt: new Date(),
    updatedAt: new Date(),
    fieldIds: [
        'name-id',
        'fullname-id',
        'company-id',
        'owner-id'
    ],
    indexMetadataIds: [],
    viewIds: [],
    applicationId: null
};
const callEncodeCursor = (record, orderBy)=>(0, _cursorsutil.encodeCursor)({
        objectRecord: record,
        order: orderBy,
        flatObjectMetadata,
        flatFieldMetadataMaps
    });
describe('encodeCursor', ()=>{
    it('should encode scalar fields from the orderBy', ()=>{
        const record = {
            id: 'abc',
            name: 'John',
            age: 30
        };
        const orderBy = [
            {
                name: _types.OrderByDirection.AscNullsLast
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            name: 'John',
            id: 'abc'
        });
    });
    it('should always include id even if not in orderBy', ()=>{
        const record = {
            id: 'abc',
            name: 'John'
        };
        const orderBy = [
            {
                name: _types.OrderByDirection.AscNullsLast
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toHaveProperty('id', 'abc');
    });
    it('should only include ordered sub-fields for composite fields', ()=>{
        const record = {
            id: 'abc',
            fullName: {
                firstName: 'Katherine',
                lastName: 'Abbott'
            }
        };
        const orderBy = [
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            fullName: {
                firstName: 'Katherine'
            },
            id: 'abc'
        });
        expect(decoded.fullName).not.toHaveProperty('lastName');
    });
    it('should include all sub-fields when all are in the orderBy', ()=>{
        const record = {
            id: 'abc',
            fullName: {
                firstName: 'Katherine',
                lastName: 'Abbott'
            }
        };
        const orderBy = [
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsLast,
                    lastName: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            fullName: {
                firstName: 'Katherine',
                lastName: 'Abbott'
            },
            id: 'abc'
        });
    });
    it('should deep-merge two separate entries for the same composite parent', ()=>{
        const record = {
            id: 'abc',
            fullName: {
                firstName: 'Katherine',
                lastName: 'Watts'
            }
        };
        const orderBy = [
            {
                fullName: {
                    firstName: _types.OrderByDirection.AscNullsFirst
                }
            },
            {
                fullName: {
                    lastName: _types.OrderByDirection.DescNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            fullName: {
                firstName: 'Katherine',
                lastName: 'Watts'
            },
            id: 'abc'
        });
    });
    it('should not filter sub-fields for scalar fields', ()=>{
        const record = {
            id: 'abc',
            name: 'John'
        };
        const orderBy = [
            {
                name: _types.OrderByDirection.AscNullsLast
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            name: 'John',
            id: 'abc'
        });
    });
    it('should preserve null sort values in the cursor', ()=>{
        const record = {
            id: 'abc',
            name: null
        };
        const orderBy = [
            {
                name: _types.OrderByDirection.AscNullsLast
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            name: null,
            id: 'abc'
        });
    });
    it('should carry only the ordered sub-field of a loaded relation', ()=>{
        const record = {
            id: 'abc',
            company: {
                id: 'company-1',
                name: 'Acme',
                employees: 10
            }
        };
        const orderBy = [
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            company: {
                name: 'Acme'
            },
            id: 'abc'
        });
    });
    it('should carry null for a relation orderBy entry when there is no related record', ()=>{
        const record = {
            id: 'abc',
            company: null
        };
        const orderBy = [
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            company: {
                name: null
            },
            id: 'abc'
        });
    });
    it('should leave the relation orderBy entry out when the relation is not loaded', ()=>{
        const record = {
            id: 'abc'
        };
        const orderBy = [
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            id: 'abc'
        });
    });
    it('should prefer relation order values from the ordering join over the loaded record', ()=>{
        const record = {
            id: 'abc'
        };
        const orderBy = [
            {
                company: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)((0, _cursorsutil.encodeCursor)({
            objectRecord: record,
            order: orderBy,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            orderByValuesFromScan: {
                company: {
                    name: 'Acme'
                }
            }
        }));
        expect(decoded).toEqual({
            company: {
                name: 'Acme'
            },
            id: 'abc'
        });
    });
    it('should nest composite target values of a relation orderBy', ()=>{
        const record = {
            id: 'abc'
        };
        const orderBy = [
            {
                company: {
                    contactName: {
                        firstName: _types.OrderByDirection.AscNullsLast
                    }
                }
            },
            {
                company: {
                    contactName: {
                        lastName: _types.OrderByDirection.AscNullsLast
                    }
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)((0, _cursorsutil.encodeCursor)({
            objectRecord: record,
            order: orderBy,
            flatObjectMetadata,
            flatFieldMetadataMaps,
            orderByValuesFromScan: {
                company: {
                    contactName: {
                        firstName: 'Ada',
                        lastName: null
                    }
                }
            }
        }));
        expect(decoded).toEqual({
            company: {
                contactName: {
                    firstName: 'Ada',
                    lastName: null
                }
            },
            id: 'abc'
        });
    });
    it('should encode join column values when ordering by the foreign key', ()=>{
        const record = {
            id: 'abc',
            companyId: 'company-1'
        };
        const orderBy = [
            {
                companyId: _types.OrderByDirection.AscNullsLast
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            companyId: 'company-1',
            id: 'abc'
        });
    });
    it('should carry morph relation sub-field values like relation ones', ()=>{
        const record = {
            id: 'abc',
            owner: {
                id: 'owner-1',
                name: 'Morph target'
            }
        };
        const orderBy = [
            {
                owner: {
                    name: _types.OrderByDirection.AscNullsLast
                }
            }
        ];
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, orderBy));
        expect(decoded).toEqual({
            owner: {
                name: 'Morph target'
            },
            id: 'abc'
        });
    });
    it('should handle undefined orderBy', ()=>{
        const record = {
            id: 'abc',
            name: 'John'
        };
        const decoded = (0, _cursorsutil.decodeCursor)(callEncodeCursor(record, undefined));
        expect(decoded).toEqual({
            id: 'abc'
        });
    });
});

//# sourceMappingURL=cursors.util.spec.js.map