"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getprogresstokenutil = require("../get-progress-token.util");
describe('getProgressToken', ()=>{
    it.each([
        [
            'abc123'
        ],
        [
            4
        ],
        [
            0
        ],
        [
            -7
        ]
    ])('should return the token %p supplied by the client', (progressToken)=>{
        expect((0, _getprogresstokenutil.getProgressToken)({
            _meta: {
                progressToken
            }
        })).toBe(progressToken);
    });
    it('should return undefined when params carry no _meta', ()=>{
        expect((0, _getprogresstokenutil.getProgressToken)({
            name: 'learn_tools'
        })).toBeUndefined();
    });
    it('should return undefined when _meta carries no progressToken', ()=>{
        expect((0, _getprogresstokenutil.getProgressToken)({
            _meta: {
                other: 'value'
            }
        })).toBeUndefined();
    });
    it.each([
        [
            null
        ],
        [
            'abc123'
        ]
    ])('should return undefined when _meta is %p', (meta)=>{
        expect((0, _getprogresstokenutil.getProgressToken)({
            _meta: meta
        })).toBeUndefined();
    });
    it.each([
        [
            true
        ],
        [
            {}
        ],
        [
            []
        ],
        [
            null
        ],
        [
            1.5
        ],
        [
            -0.25
        ],
        [
            Number.NaN
        ],
        [
            Number.POSITIVE_INFINITY
        ]
    ])('should return undefined for the non conformant token %p', (progressToken)=>{
        expect((0, _getprogresstokenutil.getProgressToken)({
            _meta: {
                progressToken
            }
        })).toBeUndefined();
    });
});

//# sourceMappingURL=get-progress-token.util.spec.js.map