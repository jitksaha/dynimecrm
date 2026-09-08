"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _relationtypeinterface = require("../../../../metadata-modules/field-metadata/interfaces/relation-type.interface");
const _findrelationpathstopersonutil = require("../find-relation-paths-to-person.util");
const fieldId = (objectNameSingular, fieldName)=>`${objectNameSingular}.${fieldName}`;
const invertRelationType = (relationType)=>relationType === _relationtypeinterface.RelationType.MANY_TO_ONE ? _relationtypeinterface.RelationType.ONE_TO_MANY : _relationtypeinterface.RelationType.MANY_TO_ONE;
const buildGraphFixtures = (graph, options = {})=>{
    const systemObjectNames = options.systemObjectNames ?? [];
    const specsByObjectNameSingular = Object.fromEntries(Object.entries(graph).map(([objectNameSingular, relationSpecs])=>[
            objectNameSingular,
            [
                ...relationSpecs
            ]
        ]));
    for (const [objectNameSingular, relationSpecs] of Object.entries(graph)){
        for (const spec of relationSpecs){
            const inverseSpecs = specsByObjectNameSingular[spec.targetObjectNameSingular];
            if (!(0, _utils.isDefined)(inverseSpecs) || inverseSpecs.some((inverseSpec)=>inverseSpec.fieldName === spec.inverseFieldName)) {
                continue;
            }
            inverseSpecs.push({
                fieldName: spec.inverseFieldName,
                relationType: invertRelationType(spec.relationType),
                targetObjectNameSingular: objectNameSingular,
                inverseFieldName: spec.fieldName
            });
        }
    }
    const flatObjectMetadataMaps = {
        byUniversalIdentifier: {},
        universalIdentifierById: {}
    };
    const flatFieldMetadataMaps = {
        byUniversalIdentifier: {},
        universalIdentifierById: {}
    };
    for (const [objectNameSingular, relationSpecs] of Object.entries(specsByObjectNameSingular)){
        flatObjectMetadataMaps.byUniversalIdentifier[objectNameSingular] = {
            id: objectNameSingular,
            universalIdentifier: objectNameSingular,
            nameSingular: objectNameSingular,
            namePlural: `${objectNameSingular}s`,
            isSystem: systemObjectNames.includes(objectNameSingular),
            fieldIds: relationSpecs.map((spec)=>fieldId(objectNameSingular, spec.fieldName))
        };
        flatObjectMetadataMaps.universalIdentifierById[objectNameSingular] = objectNameSingular;
        for (const spec of relationSpecs){
            const id = fieldId(objectNameSingular, spec.fieldName);
            flatFieldMetadataMaps.byUniversalIdentifier[id] = {
                id,
                universalIdentifier: id,
                name: spec.fieldName,
                objectMetadataId: objectNameSingular,
                type: (0, _utils.isDefined)(spec.morphId) ? _types.FieldMetadataType.MORPH_RELATION : _types.FieldMetadataType.RELATION,
                morphId: spec.morphId ?? null,
                isActive: true,
                isSystem: false,
                relationTargetFieldMetadataId: fieldId(spec.targetObjectNameSingular, spec.inverseFieldName),
                settings: {
                    relationType: spec.relationType
                },
                universalSettings: {
                    relationType: spec.relationType
                }
            };
            flatFieldMetadataMaps.universalIdentifierById[id] = id;
        }
    }
    return {
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    };
};
describe('findRelationPathsToPerson', ()=>{
    it('returns the empty path for the person object itself', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            person: []
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'person',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            []
        ]);
    });
    it('resolves a direct relation to person, querying person by its foreign key', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            company: [
                {
                    fieldName: 'people',
                    relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetObjectNameSingular: 'person',
                    inverseFieldName: 'company'
                }
            ],
            person: [
                {
                    fieldName: 'company',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'company',
                    inverseFieldName: 'people'
                }
            ]
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'company',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            [
                {
                    direction: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    queryObjectNameSingular: 'person',
                    joinColumnName: 'companyId'
                }
            ]
        ]);
    });
    it('resolves person through a two-hop join object', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            peopleList: [
                {
                    fieldName: 'peopleListMemberships',
                    relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetObjectNameSingular: 'peopleListMembership',
                    inverseFieldName: 'peopleList'
                }
            ],
            peopleListMembership: [
                {
                    fieldName: 'peopleList',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'peopleList',
                    inverseFieldName: 'peopleListMemberships'
                },
                {
                    fieldName: 'person',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'person',
                    inverseFieldName: 'peopleListMemberships'
                }
            ],
            person: [
                {
                    fieldName: 'peopleListMemberships',
                    relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetObjectNameSingular: 'peopleListMembership',
                    inverseFieldName: 'person'
                }
            ]
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'peopleList',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            [
                {
                    direction: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    queryObjectNameSingular: 'peopleListMembership',
                    joinColumnName: 'peopleListId'
                },
                {
                    direction: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    queryObjectNameSingular: 'peopleListMembership',
                    joinColumnName: 'personId'
                }
            ]
        ]);
    });
    it('collects both a direct and a longer relation chain to person (opportunity)', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            opportunity: [
                {
                    fieldName: 'pointOfContact',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'person',
                    inverseFieldName: 'pointOfContactForOpportunities'
                },
                {
                    fieldName: 'company',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'company',
                    inverseFieldName: 'opportunities'
                }
            ],
            company: [
                {
                    fieldName: 'people',
                    relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetObjectNameSingular: 'person',
                    inverseFieldName: 'company'
                }
            ],
            person: []
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'opportunity',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            [
                {
                    direction: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    queryObjectNameSingular: 'opportunity',
                    joinColumnName: 'pointOfContactId'
                }
            ],
            [
                {
                    direction: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    queryObjectNameSingular: 'opportunity',
                    joinColumnName: 'companyId'
                },
                {
                    direction: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    queryObjectNameSingular: 'person',
                    joinColumnName: 'companyId'
                }
            ]
        ]);
    });
    it('targets the morph field owning the join column rather than the morph group name', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            note: [],
            task: [],
            person: [
                {
                    fieldName: 'lastActivityItemNote',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'note',
                    inverseFieldName: 'peopleWithLastActivityItem',
                    morphId: 'lastActivityItem'
                },
                {
                    fieldName: 'lastActivityItemTask',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'task',
                    inverseFieldName: 'peopleWithLastActivityItem',
                    morphId: 'lastActivityItem'
                }
            ]
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'note',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            [
                {
                    direction: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    queryObjectNameSingular: 'person',
                    joinColumnName: 'lastActivityItemNoteId'
                }
            ]
        ]);
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'task',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            [
                {
                    direction: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    queryObjectNameSingular: 'person',
                    joinColumnName: 'lastActivityItemTaskId'
                }
            ]
        ]);
    });
    it('does not traverse system objects while looking for related people', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            opportunity: [
                {
                    fieldName: 'pointOfContact',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'person',
                    inverseFieldName: 'pointOfContactForOpportunities'
                },
                {
                    fieldName: 'owner',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'workspaceMember',
                    inverseFieldName: 'ownedOpportunities'
                }
            ],
            workspaceMember: [
                {
                    fieldName: 'messageParticipants',
                    relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetObjectNameSingular: 'messageParticipant',
                    inverseFieldName: 'workspaceMember'
                }
            ],
            messageParticipant: [
                {
                    fieldName: 'person',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'person',
                    inverseFieldName: 'messageParticipants'
                }
            ],
            person: []
        }, {
            systemObjectNames: [
                'workspaceMember',
                'messageParticipant'
            ]
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'opportunity',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([
            [
                {
                    direction: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    queryObjectNameSingular: 'opportunity',
                    joinColumnName: 'pointOfContactId'
                }
            ]
        ]);
    });
    it('returns no path when person is unreachable, terminating on relation cycles', ()=>{
        const { flatObjectMetadataMaps, flatFieldMetadataMaps } = buildGraphFixtures({
            rocket: [
                {
                    fieldName: 'cells',
                    relationType: _relationtypeinterface.RelationType.ONE_TO_MANY,
                    targetObjectNameSingular: 'rocketCell',
                    inverseFieldName: 'rocket'
                }
            ],
            rocketCell: [
                {
                    fieldName: 'rocket',
                    relationType: _relationtypeinterface.RelationType.MANY_TO_ONE,
                    targetObjectNameSingular: 'rocket',
                    inverseFieldName: 'cells'
                }
            ],
            person: []
        });
        expect((0, _findrelationpathstopersonutil.findRelationPathsToPerson)({
            rootObjectNameSingular: 'rocket',
            flatObjectMetadataMaps,
            flatFieldMetadataMaps
        })).toEqual([]);
    });
});

//# sourceMappingURL=find-relation-paths-to-person.util.spec.js.map