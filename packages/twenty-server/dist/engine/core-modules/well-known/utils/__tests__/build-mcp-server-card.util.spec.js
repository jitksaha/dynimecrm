"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _mcpprotocolversionconst = require("../../../../api/mcp/constants/mcp-protocol-version.const");
const _buildmcpservercardutil = require("../build-mcp-server-card.util");
describe('buildMcpServerCard', ()=>{
    it('advertises the streamable-http endpoint on the given host', ()=>{
        const card = (0, _buildmcpservercardutil.buildMcpServerCard)({
            baseUrl: 'https://mycompany.twenty.com',
            version: '1.2.3'
        });
        expect(card.remotes).toHaveLength(1);
        expect(card.remotes[0]).toMatchObject({
            type: 'streamable-http',
            url: 'https://mycompany.twenty.com/mcp',
            supportedProtocolVersions: [
                _mcpprotocolversionconst.MCP_PROTOCOL_VERSION
            ]
        });
    });
    it('carries the registry schema, stable identity and passed version', ()=>{
        const card = (0, _buildmcpservercardutil.buildMcpServerCard)({
            baseUrl: 'https://api.twenty.com',
            version: '0.42.0'
        });
        expect(card.$schema).toBe('https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json');
        expect(card.name).toBe('com.twenty/twenty');
        expect(card.version).toBe('0.42.0');
        expect(card.repository.source).toBe('github');
    });
    it('marks the Authorization header optional and secret (OAuth or API key)', ()=>{
        const card = (0, _buildmcpservercardutil.buildMcpServerCard)({
            baseUrl: 'https://mycompany.twenty.com',
            version: '1.0.0'
        });
        expect(card.remotes[0].headers).toEqual([
            expect.objectContaining({
                name: 'Authorization',
                isRequired: false,
                isSecret: true
            })
        ]);
    });
});

//# sourceMappingURL=build-mcp-server-card.util.spec.js.map