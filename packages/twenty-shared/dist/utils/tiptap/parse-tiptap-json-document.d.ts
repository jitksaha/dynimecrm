import { type TipTapDocument } from './tiptap-document';
import { type TipTapNode } from './tiptap-node';
export declare const isTipTapNode: (value: unknown) => value is TipTapNode;
export declare const parseTipTapJsonDocument: (serializedDocument: string) => TipTapDocument | undefined;
export declare const parseCanonicalTipTapJsonDocument: (serializedDocument: string) => TipTapDocument | undefined;
//# sourceMappingURL=parse-tiptap-json-document.d.ts.map