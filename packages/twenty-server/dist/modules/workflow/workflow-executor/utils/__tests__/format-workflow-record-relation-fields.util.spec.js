"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _formatworkflowrecordrelationfieldsutil = require("../format-workflow-record-relation-fields.util");
const ASSIGNEE_ID = 'e1c3f8a0-0000-4000-8000-000000000000';
const assigneeFlatFieldMetadata = {
    id: 'assignee-field-metadata-id',
    universalIdentifier: 'assignee-field-universal-identifier',
    name: 'assignee',
    type: _types.FieldMetadataType.RELATION,
    settings: {
        relationType: _types.RelationType.MANY_TO_ONE
    },
    relationTargetObjectMetadataId: 'workspace-member-object-metadata-id'
};
const titleFlatFieldMetadata = {
    id: 'title-field-metadata-id',
    universalIdentifier: 'title-field-universal-identifier',
    name: 'title',
    type: _types.FieldMetadataType.TEXT
};
const taskFlatObjectMetadata = {
    id: 'task-object-metadata-id',
    universalIdentifier: 'task-object-universal-identifier',
    nameSingular: 'task',
    namePlural: 'tasks',
    fieldIds: [
        assigneeFlatFieldMetadata.id,
        titleFlatFieldMetadata.id
    ]
};
const buildFlatEntityMaps = (flatEntities)=>({
        byUniversalIdentifier: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.universalIdentifier,
                flatEntity
            ])),
        universalIdentifierById: Object.fromEntries(flatEntities.map((flatEntity)=>[
                flatEntity.id,
                flatEntity.universalIdentifier
            ])),
        universalIdentifiersByApplicationId: {}
    });
const objectMetadataInfo = {
    flatObjectMetadata: taskFlatObjectMetadata,
    flatFieldMetadataMaps: buildFlatEntityMaps([
        assigneeFlatFieldMetadata,
        titleFlatFieldMetadata
    ]),
    flatObjectMetadataMaps: buildFlatEntityMaps([
        taskFlatObjectMetadata
    ])
};
const format = (record)=>(0, _formatworkflowrecordrelationfieldsutil.formatWorkflowRecordRelationFields)(record, objectMetadataInfo).formattedRecord;
describe('formatWorkflowRecordRelationFields', ()=>{
    it('maps a relation wrapped as an id object to its join column', ()=>{
        expect(format({
            assignee: {
                id: ASSIGNEE_ID
            }
        })).toEqual({
            assigneeId: ASSIGNEE_ID
        });
    });
    it.each([
        [
            null
        ],
        [
            {
                id: null
            }
        ],
        [
            {
                id: null,
                name: 'Unassigned'
            }
        ]
    ])('nullifies the join column when the relation resolves to %p', (value)=>{
        expect(format({
            title: 'Follow up',
            assignee: value
        })).toEqual({
            title: 'Follow up',
            assigneeId: null
        });
    });
    it('keeps an explicitly provided join column over a null relation', ()=>{
        expect(format({
            assignee: {
                id: null
            },
            assigneeId: ASSIGNEE_ID
        })).toEqual({
            assigneeId: ASSIGNEE_ID
        });
    });
    it('writes no join column when the relation id is undefined', ()=>{
        expect(Object.keys(format({
            assignee: {
                id: undefined
            }
        }))).toEqual([
            'assignee'
        ]);
    });
    it('keeps an empty id so it is rejected downstream', ()=>{
        expect(format({
            assignee: {
                id: ''
            }
        })).toEqual({
            assigneeId: ''
        });
    });
    it('leaves nested relation operations untouched', ()=>{
        const record = {
            assignee: {
                connect: {
                    where: {
                        id: ASSIGNEE_ID
                    }
                }
            }
        };
        expect(format(record)).toEqual(record);
    });
    it('leaves non-relation fields untouched', ()=>{
        expect(format({
            title: null
        })).toEqual({
            title: null
        });
    });
});

//# sourceMappingURL=format-workflow-record-relation-fields.util.spec.js.map