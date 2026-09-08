import { type EmailDocument } from './email-document-schema';
type ParseEmailDocumentResult = {
    success: true;
    document: EmailDocument;
} | {
    success: false;
    error: string;
};
export declare const parseEmailDocument: (value: unknown) => ParseEmailDocumentResult;
export declare const parseCanonicalEmailDocument: (value: unknown) => ParseEmailDocumentResult;
export {};
//# sourceMappingURL=parse-email-document.d.ts.map