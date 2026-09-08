import { type SyncableEntityOptions } from '../application/syncableEntityOptionsType';
import { FieldMetadataType } from '../types/FieldMetadataType';
export declare const APPLICATION_VARIABLE_FIELD_METADATA_TYPES: readonly [FieldMetadataType.TEXT, FieldMetadataType.ARRAY, FieldMetadataType.BOOLEAN, FieldMetadataType.DATE, FieldMetadataType.DATE_TIME, FieldMetadataType.NUMBER, FieldMetadataType.NUMERIC, FieldMetadataType.RAW_JSON, FieldMetadataType.RICH_TEXT, FieldMetadataType.SELECT, FieldMetadataType.MULTI_SELECT];
export type ApplicationVariableType = (typeof APPLICATION_VARIABLE_FIELD_METADATA_TYPES)[number];
export type ApplicationVariableOption = {
    label: string;
    value: string;
};
export type ApplicationVariableValue = string | number | boolean | string[] | Record<string, unknown> | null;
type TypedApplicationVariable = {
    label?: string;
    type?: ApplicationVariableType;
    options?: ApplicationVariableOption[];
    isDeprecated?: boolean;
};
type SecretApplicationVariable = SyncableEntityOptions & TypedApplicationVariable & {
    description?: string;
    isSecret: true;
};
type NonSecretApplicationVariable = SyncableEntityOptions & TypedApplicationVariable & {
    value?: ApplicationVariableValue;
    description?: string;
    isSecret?: false;
};
export type ApplicationVariable = SecretApplicationVariable | NonSecretApplicationVariable;
export type ApplicationVariables = Record<string, ApplicationVariable>;
export {};
//# sourceMappingURL=applicationVariablesType.d.ts.map