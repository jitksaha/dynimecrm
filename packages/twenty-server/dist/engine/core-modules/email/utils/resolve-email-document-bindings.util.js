"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveEmailDocumentBindings", {
    enumerable: true,
    get: function() {
        return resolveEmailDocumentBindings;
    }
});
const _utils = require("twenty-shared/utils");
const textToInlineNodes = (text, marks)=>text.split('\n').flatMap((line, index, lines)=>[
            ...line === '' ? [] : [
                {
                    type: _utils.TIPTAP_NODE_TYPES.TEXT,
                    text: line,
                    ...marks && {
                        marks
                    }
                }
            ],
            ...index < lines.length - 1 ? [
                {
                    type: _utils.TIPTAP_NODE_TYPES.HARD_BREAK,
                    ...marks && {
                        marks
                    }
                }
            ] : []
        ]);
const resolveNode = (node, resolve)=>{
    if (node.type === _utils.TIPTAP_NODE_TYPES.VARIABLE_TAG) {
        const variable = node.attrs?.variable;
        if (typeof variable !== 'string') {
            return [
                node
            ];
        }
        const resolvedNode = (0, _utils.transformEmailDocumentStrings)({
            type: _utils.TIPTAP_NODE_TYPES.TEXT,
            marks: node.marks
        }, resolve);
        return textToInlineNodes(resolve(variable, 'text'), resolvedNode.marks);
    }
    if (node.type === _utils.TIPTAP_NODE_TYPES.TEXT && typeof node.text === 'string') {
        const resolvedNode = (0, _utils.transformEmailDocumentStrings)(node, (value, context)=>context === 'text' ? value : resolve(value, context));
        return textToInlineNodes(resolve(node.text, 'text'), resolvedNode.marks);
    }
    const { content, ...nodeWithoutContent } = node;
    const resolvedNode = (0, _utils.transformEmailDocumentStrings)(nodeWithoutContent, resolve);
    return [
        {
            ...resolvedNode,
            ...content && {
                content: content.flatMap((childNode)=>resolveNode(childNode, resolve))
            }
        }
    ];
};
const resolveEmailDocumentBindings = (document, resolve)=>{
    const [resolvedDocument] = resolveNode(document, resolve);
    return resolvedDocument;
};

//# sourceMappingURL=resolve-email-document-bindings.util.js.map