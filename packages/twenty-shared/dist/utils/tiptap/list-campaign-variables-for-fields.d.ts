import { FieldMetadataType } from '../../types';
export type CampaignVariableDefinition = {
    name: string;
    label: string;
    fieldName: string;
    fieldType: FieldMetadataType;
    subFieldName?: string;
};
type CampaignVariableEligibleField = {
    name: string;
    label: string;
    type: FieldMetadataType;
    isSystem?: boolean | null;
    isActive?: boolean | null;
};
export declare const listCampaignVariablesForFields: (fields: CampaignVariableEligibleField[]) => CampaignVariableDefinition[];
export {};
//# sourceMappingURL=list-campaign-variables-for-fields.d.ts.map