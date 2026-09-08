"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getlambdadepslayernameutil = require("../get-lambda-deps-layer-name.util");
const buildFlatApplication = (overrides = {})=>({
        yarnLockChecksum: 'abc123',
        ...overrides
    });
describe('getLambdaDepsLayerName', ()=>{
    it('returns deps-<checksum> when yarnLockChecksum is set', ()=>{
        expect((0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication: buildFlatApplication()
        })).toBe('deps-abc123');
    });
    it('falls back to deps-default when yarnLockChecksum is undefined', ()=>{
        expect((0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication: buildFlatApplication({
                yarnLockChecksum: undefined
            })
        })).toBe('deps-default');
    });
    it('falls back to deps-default when yarnLockChecksum is null', ()=>{
        expect((0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication: buildFlatApplication({
                yarnLockChecksum: null
            })
        })).toBe('deps-default');
    });
    it('inserts the namespace segment when provided', ()=>{
        expect((0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication: buildFlatApplication(),
            namespace: 'ns123'
        })).toBe('deps-ns123-abc123');
    });
    it('omits the namespace segment when it is an empty string', ()=>{
        expect((0, _getlambdadepslayernameutil.getLambdaDepsLayerName)({
            flatApplication: buildFlatApplication(),
            namespace: ''
        })).toBe('deps-abc123');
    });
});

//# sourceMappingURL=get-lambda-deps-layer-name.util.spec.js.map