"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _buildlambdaresourcenameutil = require("../build-lambda-resource-name.util");
describe('buildLambdaResourceName', ()=>{
    it('joins prefix, namespace and checksum', ()=>{
        expect((0, _buildlambdaresourcenameutil.buildLambdaResourceName)({
            resourceNamePrefix: 'twenty-builder',
            namespace: 'abc123',
            checksum: 'def456'
        })).toBe('twenty-builder-abc123-def456');
    });
    it('omits the namespace segment when it is undefined', ()=>{
        expect((0, _buildlambdaresourcenameutil.buildLambdaResourceName)({
            resourceNamePrefix: 'deps',
            checksum: 'def456'
        })).toBe('deps-def456');
    });
    it('omits the namespace segment when it is an empty string', ()=>{
        expect((0, _buildlambdaresourcenameutil.buildLambdaResourceName)({
            resourceNamePrefix: 'deps',
            namespace: '',
            checksum: 'def456'
        })).toBe('deps-def456');
    });
});

//# sourceMappingURL=build-lambda-resource-name.util.spec.js.map