export declare const TIPTAP_MARK_TYPES: {
    readonly BOLD: "bold";
    readonly ITALIC: "italic";
    readonly UNDERLINE: "underline";
    readonly STRIKE: "strike";
    readonly LINK: "link";
};
export type TipTapMarkType = (typeof TIPTAP_MARK_TYPES)[keyof typeof TIPTAP_MARK_TYPES];
export interface LinkMarkAttributes {
    href?: string;
    target?: string;
    rel?: string;
}
export interface TipTapMark {
    type: TipTapMarkType;
    attrs?: LinkMarkAttributes | Record<string, unknown>;
}
//# sourceMappingURL=tiptap-mark-types.d.ts.map