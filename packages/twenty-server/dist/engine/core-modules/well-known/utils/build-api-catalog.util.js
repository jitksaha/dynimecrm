"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildApiCatalog", {
    enumerable: true,
    get: function() {
        return buildApiCatalog;
    }
});
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const API_DOCS_URL = `${_constants.DOCUMENTATION_BASE_URL}/developers/extend/api`;
const MCP_DOCS_URL = `${_constants.DOCUMENTATION_BASE_URL}/user-guide/ai/capabilities/mcp`;
const buildApiCatalog = (baseUrl)=>({
        linkset: [
            {
                anchor: `${baseUrl}/${_types.ApiPath.Rest}`,
                'service-desc': [
                    {
                        href: `${baseUrl}/${_types.ApiPath.Rest}/open-api/core`,
                        type: 'application/json'
                    }
                ],
                'service-doc': [
                    {
                        href: API_DOCS_URL,
                        type: 'text/html'
                    }
                ],
                'service-meta': [
                    {
                        href: `${baseUrl}/${_types.ApiPath.WellKnown}/oauth-protected-resource`,
                        type: 'application/json'
                    }
                ]
            },
            {
                anchor: `${baseUrl}/${_types.ApiPath.Rest}/metadata`,
                'service-desc': [
                    {
                        href: `${baseUrl}/${_types.ApiPath.Rest}/open-api/metadata`,
                        type: 'application/json'
                    }
                ],
                'service-doc': [
                    {
                        href: API_DOCS_URL,
                        type: 'text/html'
                    }
                ]
            },
            {
                anchor: `${baseUrl}/${_types.ApiPath.GraphQL}`,
                'service-doc': [
                    {
                        href: API_DOCS_URL,
                        type: 'text/html'
                    }
                ]
            },
            {
                anchor: `${baseUrl}/${_types.ApiPath.Mcp}`,
                'service-desc': [
                    {
                        href: `${baseUrl}/${_types.ApiPath.WellKnown}/mcp/server-card.json`,
                        type: 'application/json'
                    }
                ],
                'service-doc': [
                    {
                        href: MCP_DOCS_URL,
                        type: 'text/html'
                    }
                ]
            }
        ]
    });

//# sourceMappingURL=build-api-catalog.util.js.map