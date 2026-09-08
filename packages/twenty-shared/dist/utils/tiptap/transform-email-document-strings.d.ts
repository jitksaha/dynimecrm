import { type EmailDocumentNode } from './email-document-node';
import { type EmailDocumentStringContext } from './email-document-string-context';
type StringTransformer = (value: string, context: EmailDocumentStringContext) => string;
export declare const transformEmailDocumentStrings: <TNode extends EmailDocumentNode>(node: TNode, transform: StringTransformer) => TNode;
export {};
//# sourceMappingURL=transform-email-document-strings.d.ts.map