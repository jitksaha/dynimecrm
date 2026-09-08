"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mapDBPartToUIMessagePart = require("../mapDBPartToUIMessagePart");
const _mapUIMessagePartsToDBParts = require("../mapUIMessagePartsToDBParts");
const dynamicToolPart = (overrides = {})=>({
        type: 'dynamic-tool',
        toolName: 'unknown_remote_tool',
        toolCallId: 'call_dyn_1',
        state: 'output-available',
        input: {
            query: 'hello'
        },
        output: {
            ok: true
        },
        ...overrides
    });
const staticToolPart = (overrides = {})=>({
        type: 'tool-execute_tool',
        toolCallId: 'call_static_1',
        state: 'output-available',
        input: {
            name: 'foo'
        },
        output: {
            ok: true
        },
        ...overrides
    });
describe('AgentMessagePart mappers — dynamic-tool support', ()=>{
    it('persists a dynamic-tool part without throwing', ()=>{
        expect(()=>(0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
                dynamicToolPart()
            ], 'message-1', 'workspace-1')).not.toThrow();
    });
    it('stores the tool name on the row for dynamic-tool parts', ()=>{
        const [row] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            dynamicToolPart()
        ], 'message-1', 'workspace-1');
        expect(row).toMatchObject({
            type: 'dynamic-tool',
            toolName: 'unknown_remote_tool',
            toolCallId: 'call_dyn_1',
            toolInput: {
                query: 'hello'
            },
            toolOutput: {
                ok: true
            }
        });
    });
    it('stores the tool name on the row for static tool parts', ()=>{
        const [row] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            staticToolPart()
        ], 'message-1', 'workspace-1');
        expect(row).toMatchObject({
            type: 'tool-execute_tool',
            toolName: 'execute_tool',
            toolCallId: 'call_static_1'
        });
    });
    it('defaults a missing tool input to an empty object on persist (issue #21695)', ()=>{
        const [row] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            staticToolPart({
                state: 'output-error',
                input: undefined,
                output: undefined,
                errorText: 'Invalid input for tool execute_tool'
            })
        ], 'message-1', 'workspace-1');
        expect(row.toolInput).toEqual({});
    });
    it('round-trips a dynamic-tool part through DB and back', ()=>{
        const original = dynamicToolPart();
        const [row] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            original
        ], 'message-1', 'workspace-1');
        const reloaded = (0, _mapDBPartToUIMessagePart.mapDBPartToUIMessagePart)(row);
        expect(reloaded).toEqual({
            type: 'dynamic-tool',
            toolName: 'unknown_remote_tool',
            toolCallId: 'call_dyn_1',
            input: {
                query: 'hello'
            },
            output: {
                ok: true
            },
            errorText: '',
            state: 'output-available'
        });
    });
    it('round-trips callProviderMetadata for provider-executed tools', ()=>{
        const original = dynamicToolPart({
            providerExecuted: true,
            callProviderMetadata: {
                anthropic: {
                    encryptedContent: 'abc123'
                }
            }
        });
        const [row] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            original
        ], 'message-1', 'workspace-1');
        expect(row).toMatchObject({
            providerExecuted: true,
            providerMetadata: {
                anthropic: {
                    encryptedContent: 'abc123'
                }
            }
        });
        const reloaded = (0, _mapDBPartToUIMessagePart.mapDBPartToUIMessagePart)(row);
        expect(reloaded).toMatchObject({
            providerExecuted: true,
            callProviderMetadata: {
                anthropic: {
                    encryptedContent: 'abc123'
                }
            }
        });
    });
    it('round-trips a static tool part through DB and back', ()=>{
        const original = staticToolPart();
        const [row] = (0, _mapUIMessagePartsToDBParts.mapUIMessagePartsToDBParts)([
            original
        ], 'message-1', 'workspace-1');
        const reloaded = (0, _mapDBPartToUIMessagePart.mapDBPartToUIMessagePart)(row);
        expect(reloaded).toMatchObject({
            type: 'tool-execute_tool',
            toolCallId: 'call_static_1',
            input: {
                name: 'foo'
            },
            output: {
                ok: true
            }
        });
        expect(reloaded).not.toHaveProperty('toolName');
    });
});

//# sourceMappingURL=map-message-parts.dynamic-tool.spec.js.map