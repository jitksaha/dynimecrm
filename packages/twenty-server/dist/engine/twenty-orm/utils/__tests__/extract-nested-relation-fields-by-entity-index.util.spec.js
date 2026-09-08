"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _extractnestedrelationfieldsbyentityindexutil = require("../extract-nested-relation-fields-by-entity-index.util");
describe('extractNestedRelationFieldsByEntityIndex', ()=>{
    it('extracts nested create fields by record index', ()=>{
        expect((0, _extractnestedrelationfieldsbyentityindexutil.extractNestedRelationFieldsByEntityIndex)([
            {
                name: 'Pivot',
                targetPerson: {
                    create: {
                        id: 'target-id',
                        name: 'Target'
                    }
                }
            }
        ], new Set([
            'targetPerson'
        ])).relationCreateQueryFieldsByEntityIndex).toEqual({
            0: {
                targetPerson: {
                    create: {
                        id: 'target-id',
                        name: 'Target'
                    }
                }
            }
        });
    });
    it('rejects multiple operations on the same relation field', ()=>{
        expect(()=>(0, _extractnestedrelationfieldsbyentityindexutil.extractNestedRelationFieldsByEntityIndex)([
                {
                    targetPerson: {
                        create: {
                            id: 'target-id'
                        },
                        connect: {
                            where: {
                                id: 'existing-id'
                            }
                        }
                    }
                }
            ], new Set([
                'targetPerson'
            ]))).toThrow('Cannot combine create, connect, and disconnect');
    });
    it('leaves create-shaped values on non-relation fields untouched', ()=>{
        expect((0, _extractnestedrelationfieldsbyentityindexutil.extractNestedRelationFieldsByEntityIndex)([
            {
                extraData: {
                    create: {
                        arbitrary: 'json'
                    }
                },
                targetPerson: {
                    create: {
                        id: 'target-id'
                    }
                }
            }
        ], new Set([
            'targetPerson'
        ])).relationCreateQueryFieldsByEntityIndex).toEqual({
            0: {
                targetPerson: {
                    create: {
                        id: 'target-id'
                    }
                }
            }
        });
    });
});

//# sourceMappingURL=extract-nested-relation-fields-by-entity-index.util.spec.js.map