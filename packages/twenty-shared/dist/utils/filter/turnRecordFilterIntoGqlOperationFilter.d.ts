import { FieldMetadataType, type RecordFilterValueDependencies, type RecordGqlOperationFilter, type RelationType } from '../../types';
import { type RecordFilter } from '../../utils';
type FieldSharedMorphRelation = {
    type: RelationType;
    targetObjectMetadata: {
        id: string;
        nameSingular: string;
        namePlural: string;
    };
};
export type FieldShared = {
    id: string;
    name: string;
    type: FieldMetadataType;
    label: string;
    relation?: {
        sourceObjectMetadata: {
            id: string;
        };
    } | null;
    morphRelations?: FieldSharedMorphRelation[] | null;
};
type TurnRecordFilterIntoRecordGqlOperationFilterParams = {
    filterValueDependencies: RecordFilterValueDependencies;
    recordFilter: Omit<RecordFilter, 'id'>;
    fieldMetadataItemById: Map<string, FieldShared>;
};
export declare const turnRecordFilterIntoRecordGqlOperationFilter: ({ recordFilter, fieldMetadataItemById, filterValueDependencies, }: TurnRecordFilterIntoRecordGqlOperationFilterParams) => RecordGqlOperationFilter | undefined;
export {};
//# sourceMappingURL=turnRecordFilterIntoGqlOperationFilter.d.ts.map