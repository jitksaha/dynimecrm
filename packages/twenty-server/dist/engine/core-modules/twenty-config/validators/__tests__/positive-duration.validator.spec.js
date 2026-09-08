"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _positivedurationvalidator = require("../positive-duration.validator");
describe('PositiveDurationConstraint', ()=>{
    const constraint = new _positivedurationvalidator.PositiveDurationConstraint();
    const validate = (duration, isZeroAllowed)=>constraint.validate(duration, {
            constraints: [
                isZeroAllowed
            ]
        });
    describe.each([
        [
            'zero disallowed',
            false
        ],
        [
            'zero allowed',
            true
        ]
    ])('%s', (_label, isZeroAllowed)=>{
        it.each([
            '30d',
            '12h',
            '10m',
            '1s',
            '0.5ms'
        ])('should accept the positive duration %s', (duration)=>{
            expect(validate(duration, isZeroAllowed)).toBe(true);
        });
        it.each([
            '-1s',
            '-10m'
        ])('should reject the negative duration %s', (duration)=>{
            expect(validate(duration, isZeroAllowed)).toBe(false);
        });
        it.each([
            '1Month',
            'not-a-duration',
            '',
            undefined,
            null,
            42
        ])('should reject %s, which ms cannot parse', (duration)=>{
            expect(validate(duration, isZeroAllowed)).toBe(false);
        });
    });
    it('should reject zero when zero is not allowed', ()=>{
        expect(validate('0s', false)).toBe(false);
    });
    it('should accept zero when zero is allowed', ()=>{
        expect(validate('0s', true)).toBe(true);
    });
});

//# sourceMappingURL=positive-duration.validator.spec.js.map