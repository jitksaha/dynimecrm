"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMcpServerCard", {
    enumerable: true,
    get: function() {
        return buildMcpServerCard;
    }
});
const _mcpprotocolversionconst = require("../../../api/mcp/constants/mcp-protocol-version.const");
const buildMcpServerCard = ({ baseUrl, version })=>({
        $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
        name: 'com.twenty/twenty',
        version,
        title: 'Twenty CRM',
        description: 'Read and write your Twenty CRM data - companies, people, opportunities, tasks, notes and any custom objects - from AI assistants. Tools are discovered at runtime and scoped to the authenticated workspace.',
        websiteUrl: 'https://twenty.com',
        repository: {
            url: 'https://github.com/twentyhq/twenty',
            source: 'github'
        },
        remotes: [
            {
                type: 'streamable-http',
                url: `${baseUrl}/mcp`,
                supportedProtocolVersions: [
                    _mcpprotocolversionconst.MCP_PROTOCOL_VERSION
                ],
                headers: [
                    {
                        name: 'Authorization',
                        description: "Optional. Bearer <api-key> for static API-key auth. Omit to use OAuth 2.1, auto-discovered from this host's /.well-known/oauth-protected-resource and /.well-known/oauth-authorization-server.",
                        isRequired: false,
                        isSecret: true
                    }
                ]
            }
        ]
    });

//# sourceMappingURL=build-mcp-server-card.util.js.map