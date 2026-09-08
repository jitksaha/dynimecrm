export declare const EMAIL_DOCUMENT_MARK_CATALOG: {
    readonly bold: {
        readonly stringAttributes: {};
    };
    readonly italic: {
        readonly stringAttributes: {};
    };
    readonly underline: {
        readonly stringAttributes: {};
    };
    readonly strike: {
        readonly stringAttributes: {};
    };
    readonly link: {
        readonly stringAttributes: {
            readonly href: "url";
        };
    };
};
export type EmailDocumentMarkType = keyof typeof EMAIL_DOCUMENT_MARK_CATALOG;
export declare const isEmailDocumentMarkType: (markType: string) => markType is "bold" | "italic" | "link" | "strike" | "underline";
//# sourceMappingURL=email-document-mark-catalog.d.ts.map