import { type ObjectFieldManifest } from '../application/objectFieldManifest.type';
import { type SyncableEntityOptions } from '../application/syncableEntityOptionsType';
import { type MetadataWritability } from '../types/MetadataWritability';
import { type ObjectOpenRecordIn } from '../types/ObjectOpenRecordIn';
export type ObjectManifest = SyncableEntityOptions & {
    nameSingular: string;
    namePlural: string;
    labelSingular: string;
    labelPlural: string;
    description?: string;
    icon?: string;
    isSearchable?: boolean;
    isUICreatable?: boolean;
    isUIEditable?: boolean;
    writability?: MetadataWritability;
    openRecordIn?: ObjectOpenRecordIn;
    fields: ObjectFieldManifest[];
    labelIdentifierFieldMetadataUniversalIdentifier: string;
};
//# sourceMappingURL=objectManifestType.d.ts.map