import { type PartialFieldMetadataItem } from '../../../../types';
import { type RecordFilter } from '../../../../utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
export declare const computeGqlOperationFilterForLinks: ({ recordFilter, correspondingFieldMetadataItem, subFieldName, }: {
    recordFilter: Omit<RecordFilter, "id">;
    correspondingFieldMetadataItem: Pick<PartialFieldMetadataItem, "name" | "type">;
    subFieldName: "additionalEmails" | "additionalPhones" | "addressCity" | "addressCountry" | "addressLat" | "addressLng" | "addressPostcode" | "addressState" | "addressStreet1" | "addressStreet2" | "amountMicros" | "blocknote" | "context" | "currencyCode" | "firstName" | "lastName" | "markdown" | "name" | "primaryEmail" | "primaryLinkLabel" | "primaryLinkUrl" | "primaryPhoneCallingCode" | "primaryPhoneCountryCode" | "primaryPhoneNumber" | "secondaryLinks" | "source" | "workspaceMemberId" | null | undefined;
}) => {
    [x: string]: {
        [x: string]: {
            ilike: string;
        };
    };
    not?: undefined;
    or?: undefined;
    and?: undefined;
} | {
    not: {
        [x: string]: {
            [x: string]: {
                ilike: string;
            };
        };
    };
    or?: undefined;
    and?: undefined;
} | {
    [x: string]: {
        secondaryLinks: {
            like: string;
        };
    };
    not?: undefined;
    or?: undefined;
    and?: undefined;
} | {
    not?: undefined;
    or: ({
        not: {
            [x: string]: {
                secondaryLinks: {
                    like: string;
                };
            };
        };
    } | {
        [x: string]: {
            secondaryLinks: {
                is: "NULL";
            };
        };
        not?: undefined;
    })[];
    and?: undefined;
} | {
    not?: undefined;
    or: ({
        [x: string]: {
            primaryLinkUrl: {
                ilike: string;
            };
        };
    } | {
        [x: string]: {
            primaryLinkLabel: {
                ilike: string;
            };
        };
    } | {
        [x: string]: {
            secondaryLinks: {
                like: string;
            };
        };
    })[];
    and?: undefined;
} | {
    not?: undefined;
    or?: undefined;
    and: ({
        or?: undefined;
        not: {
            [x: string]: {
                primaryLinkLabel: {
                    ilike: string;
                };
            };
        };
    } | {
        or?: undefined;
        not: {
            [x: string]: {
                primaryLinkUrl: {
                    ilike: string;
                };
            };
        };
    } | {
        not?: undefined;
        or: ({
            not: {
                [x: string]: {
                    secondaryLinks: {
                        like: string;
                    };
                };
            };
        } | {
            [x: string]: {
                secondaryLinks: {
                    is: "NULL";
                };
            };
            not?: undefined;
        })[];
    })[];
};
//# sourceMappingURL=computeGqlOperationFilterForLinks.d.ts.map