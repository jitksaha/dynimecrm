"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getlambdasdklayernameutil = require("../get-lambda-sdk-layer-name.util");
describe('getLambdaSdkLayerName', ()=>{
    it('joins prefix with workspaceId and applicationUniversalIdentifier', ()=>{
        expect((0, _getlambdasdklayernameutil.getLambdaSdkLayerName)({
            workspaceId: 'ws-1',
            applicationUniversalIdentifier: 'app-2'
        })).toBe('sdk-ws-1-app-2');
    });
    it('produces distinct names for distinct identifiers', ()=>{
        const a = (0, _getlambdasdklayernameutil.getLambdaSdkLayerName)({
            workspaceId: 'a',
            applicationUniversalIdentifier: 'x'
        });
        const b = (0, _getlambdasdklayernameutil.getLambdaSdkLayerName)({
            workspaceId: 'b',
            applicationUniversalIdentifier: 'x'
        });
        expect(a).not.toBe(b);
    });
});

//# sourceMappingURL=get-lambda-sdk-layer-name.util.spec.js.map