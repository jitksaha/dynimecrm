import { type PartialFieldMetadataItem, type RecordGqlOperationFilter } from '../../../../types';
import { type RecordFilter } from '../../../../utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
export declare const computeGqlOperationFilterForEmails: ({ recordFilter, correspondingFieldMetadataItem, subFieldName, }: {
    recordFilter: Omit<RecordFilter, "id">;
    correspondingFieldMetadataItem: Pick<PartialFieldMetadataItem, "name" | "type">;
    subFieldName: "additionalEmails" | "additionalPhones" | "addressCity" | "addressCountry" | "addressLat" | "addressLng" | "addressPostcode" | "addressState" | "addressStreet1" | "addressStreet2" | "amountMicros" | "blocknote" | "context" | "currencyCode" | "firstName" | "lastName" | "markdown" | "name" | "primaryEmail" | "primaryLinkLabel" | "primaryLinkUrl" | "primaryPhoneCallingCode" | "primaryPhoneCountryCode" | "primaryPhoneNumber" | "secondaryLinks" | "source" | "workspaceMemberId" | null | undefined;
}) => RecordGqlOperationFilter;
//# sourceMappingURL=computeGqlOperationFilterForEmails.d.ts.map