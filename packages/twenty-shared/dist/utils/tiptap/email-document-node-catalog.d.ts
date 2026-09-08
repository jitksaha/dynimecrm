export declare const EMAIL_DOCUMENT_NODE_CATALOG: {
    readonly doc: {
        readonly renderMode: "children";
        readonly stringAttributes: {};
    };
    readonly paragraph: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly text: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly heading: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly variableTag: {
        readonly renderMode: "node";
        readonly stringAttributes: {
            readonly variable: "text";
        };
    };
    readonly image: {
        readonly renderMode: "node";
        readonly stringAttributes: {
            readonly src: "url";
            readonly href: "url";
            readonly alt: "text";
            readonly title: "text";
        };
    };
    readonly bulletList: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly orderedList: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly listItem: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly hardBreak: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly section: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly columns: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly column: {
        readonly renderMode: "parent";
        readonly stringAttributes: {};
    };
    readonly button: {
        readonly renderMode: "node";
        readonly stringAttributes: {
            readonly href: "url";
        };
    };
    readonly divider: {
        readonly renderMode: "node";
        readonly stringAttributes: {};
    };
    readonly html: {
        readonly renderMode: "node";
        readonly stringAttributes: {
            readonly html: "html";
        };
    };
};
export type EmailDocumentNodeType = keyof typeof EMAIL_DOCUMENT_NODE_CATALOG;
export type RenderedEmailDocumentNodeType = {
    [TNodeType in EmailDocumentNodeType]: (typeof EMAIL_DOCUMENT_NODE_CATALOG)[TNodeType]['renderMode'] extends 'node' ? TNodeType : never;
}[EmailDocumentNodeType];
export declare const isEmailDocumentNodeType: (nodeType: string) => nodeType is "bulletList" | "button" | "column" | "columns" | "divider" | "doc" | "hardBreak" | "heading" | "html" | "image" | "listItem" | "orderedList" | "paragraph" | "section" | "text" | "variableTag";
export declare const isRenderedEmailDocumentNodeType: (nodeType: string) => nodeType is RenderedEmailDocumentNodeType;
//# sourceMappingURL=email-document-node-catalog.d.ts.map