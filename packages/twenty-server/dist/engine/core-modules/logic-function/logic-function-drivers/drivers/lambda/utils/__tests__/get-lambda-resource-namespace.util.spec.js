"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getlambdaresourcenamespaceutil = require("../get-lambda-resource-namespace.util");
describe('getLambdaResourceNamespace', ()=>{
    it('returns a stable 10-character hex namespace for a role ARN', ()=>{
        const lambdaRoleArn = 'arn:aws:iam::123456789012:role/twenty-lambda';
        const namespace = (0, _getlambdaresourcenamespaceutil.getLambdaResourceNamespace)({
            lambdaRoleArn
        });
        expect(namespace).toMatch(/^[0-9a-f]{10}$/);
        expect((0, _getlambdaresourcenamespaceutil.getLambdaResourceNamespace)({
            lambdaRoleArn
        })).toBe(namespace);
    });
    it('produces different namespaces for different role ARNs', ()=>{
        const namespaceA = (0, _getlambdaresourcenamespaceutil.getLambdaResourceNamespace)({
            lambdaRoleArn: 'arn:aws:iam::111111111111:role/twenty-lambda'
        });
        const namespaceB = (0, _getlambdaresourcenamespaceutil.getLambdaResourceNamespace)({
            lambdaRoleArn: 'arn:aws:iam::222222222222:role/twenty-lambda'
        });
        expect(namespaceA).not.toBe(namespaceB);
    });
    it.each([
        undefined,
        ''
    ])('falls back to a stable sentinel namespace when the role is missing (%p)', (lambdaRoleArn)=>{
        const namespace = (0, _getlambdaresourcenamespaceutil.getLambdaResourceNamespace)({
            lambdaRoleArn
        });
        expect(namespace).toMatch(/^[0-9a-f]{10}$/);
        expect((0, _getlambdaresourcenamespaceutil.getLambdaResourceNamespace)({
            lambdaRoleArn
        })).toBe(namespace);
    });
});

//# sourceMappingURL=get-lambda-resource-namespace.util.spec.js.map