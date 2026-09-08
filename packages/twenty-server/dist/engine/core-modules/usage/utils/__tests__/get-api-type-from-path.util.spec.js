"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getapitypefrompathutil = require("../get-api-type-from-path.util");
describe('getApiTypeFromPath', ()=>{
    it.each([
        [
            '/graphql',
            'CORE_GQL'
        ],
        [
            '/rest/people',
            'CORE_REST'
        ],
        [
            '/rest/batch/people',
            'CORE_REST'
        ],
        [
            '/mcp',
            'MCP'
        ]
    ])('reads the api type of %s', (path, expected)=>{
        expect((0, _getapitypefrompathutil.getApiTypeFromPath)(path)).toBe(expected);
    });
    it.each([
        '/metadata',
        '/auth/token',
        '/files/logo.png',
        '/'
    ])('leaves %s unattributed', (path)=>{
        expect((0, _getapitypefrompathutil.getApiTypeFromPath)(path)).toBeUndefined();
    });
});

//# sourceMappingURL=get-api-type-from-path.util.spec.js.map