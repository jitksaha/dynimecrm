"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _otplib = require("otplib");
const _otpconstants = require("../otp.constants");
const _twofactorauthenticationexception = require("../../../two-factor-authentication.exception");
const _totpstrategy = require("./totp.strategy");
const _totpstrategyconstants = require("./constants/totp.strategy.constants");
const FIXED_EPOCH_MS = 1_700_000_000_000;
const STEP_DURATION_MS = 30 * 1000;
const generateTokenAtEpoch = (secret, epochMs)=>_otplib.authenticator.clone({
        epoch: epochMs
    }).generate(secret);
describe('TOTPStrategy Configuration', ()=>{
    let strategy;
    let secret;
    let context;
    beforeEach(()=>{
        secret = _otplib.authenticator.generateSecret();
    });
    describe('Valid Configurations', ()=>{
        it('should create a strategy with default options', ()=>{
            expect(()=>new _totpstrategy.TotpStrategy()).not.toThrow();
        });
        it('should create a strategy with valid custom options', ()=>{
            const validOptions = {
                algorithm: _totpstrategyconstants.TOTPHashAlgorithms.SHA1,
                digits: 6,
                step: 30,
                window: 1
            };
            expect(()=>new _totpstrategy.TotpStrategy(validOptions)).not.toThrow();
        });
        it('should accept a large window', ()=>{
            expect(()=>new _totpstrategy.TotpStrategy({
                    window: 10
                })).not.toThrow();
        });
    });
    describe('Invalid Configurations', ()=>{
        it('should throw for a negative window', ()=>{
            expect(()=>new _totpstrategy.TotpStrategy({
                    window: -1
                })).toThrow(_twofactorauthenticationexception.TwoFactorAuthenticationException);
        });
        it('should throw for digits below the minimum', ()=>{
            expect(()=>new _totpstrategy.TotpStrategy({
                    digits: 4
                })).toThrow(_twofactorauthenticationexception.TwoFactorAuthenticationException);
        });
    });
    describe('initiate', ()=>{
        beforeEach(()=>{
            strategy = new _totpstrategy.TotpStrategy();
        });
        it('should generate a valid TOTP URI', ()=>{
            const result = strategy.initiate('test@example.com', 'TestApp');
            expect(result.uri).toMatch(/^otpauth:\/\/totp\//);
            expect(result.uri).toContain('test%40example.com'); // URL encoded email
            expect(result.uri).toContain('TestApp');
            expect(result.context.status).toBe(_otpconstants.OTPStatus.PENDING);
            expect(result.context.secret).toBeDefined();
        });
        it('should generate different secrets for each call', ()=>{
            const result1 = strategy.initiate('test1@example.com', 'TestApp');
            const result2 = strategy.initiate('test2@example.com', 'TestApp');
            expect(result1.context.secret).not.toBe(result2.context.secret);
        });
    });
    describe('validate', ()=>{
        beforeEach(()=>{
            strategy = new _totpstrategy.TotpStrategy({
                window: 1,
                epoch: FIXED_EPOCH_MS
            });
            context = {
                status: _otpconstants.OTPStatus.VERIFIED,
                secret: secret
            };
        });
        it('should return true for a valid token at the current counter', ()=>{
            const token = generateTokenAtEpoch(secret, FIXED_EPOCH_MS);
            const result = strategy.validate(token, context);
            expect(result.isValid).toBe(true);
        });
        it('should return false for an invalid token', ()=>{
            const token = '000000';
            const result = strategy.validate(token, context);
            expect(result.isValid).toBe(false);
        });
        it('should accept the previous token within the window', ()=>{
            const previousToken = generateTokenAtEpoch(secret, FIXED_EPOCH_MS - STEP_DURATION_MS);
            const result = strategy.validate(previousToken, context);
            expect(result.isValid).toBe(true);
        });
        it('should accept the next token within the window', ()=>{
            const nextToken = generateTokenAtEpoch(secret, FIXED_EPOCH_MS + STEP_DURATION_MS);
            const result = strategy.validate(nextToken, context);
            expect(result.isValid).toBe(true);
        });
        it('should reject a token generated outside the window', ()=>{
            const staleToken = generateTokenAtEpoch(secret, FIXED_EPOCH_MS - 2 * STEP_DURATION_MS);
            const result = strategy.validate(staleToken, context);
            expect(result.isValid).toBe(false);
        });
        it('should reject the previous token when no window is configured', ()=>{
            const strategyWithoutWindow = new _totpstrategy.TotpStrategy({
                epoch: FIXED_EPOCH_MS
            });
            const previousToken = generateTokenAtEpoch(secret, FIXED_EPOCH_MS - STEP_DURATION_MS);
            const result = strategyWithoutWindow.validate(previousToken, context);
            expect(result.isValid).toBe(false);
        });
        it('should handle invalid secret gracefully', ()=>{
            const invalidContext = {
                status: _otpconstants.OTPStatus.VERIFIED,
                secret: 'invalid-secret'
            };
            const result = strategy.validate('123456', invalidContext);
            expect(result.isValid).toBe(false);
        });
        it('should handle empty secret gracefully', ()=>{
            const invalidContext = {
                status: _otpconstants.OTPStatus.VERIFIED,
                secret: ''
            };
            const result = strategy.validate('123456', invalidContext);
            expect(result.isValid).toBe(false);
        });
        it('should return the original context on validation success', ()=>{
            const initResult = strategy.initiate('test@example.com', 'TestApp');
            const token = generateTokenAtEpoch(initResult.context.secret, FIXED_EPOCH_MS);
            const result = strategy.validate(token, initResult.context);
            expect(result.context).toBe(initResult.context);
            expect(result.context.status).toBe(_otpconstants.OTPStatus.PENDING); // initiate returns PENDING
        });
        it('should return the original context on validation failure', ()=>{
            const token = '000000';
            const result = strategy.validate(token, context);
            expect(result.context).toBe(context);
            expect(result.context.status).toBe(_otpconstants.OTPStatus.VERIFIED);
        });
    });
    describe('Error Handling', ()=>{
        beforeEach(()=>{
            strategy = new _totpstrategy.TotpStrategy();
        });
        it('should handle empty token gracefully', ()=>{
            const errorHandlingContext = {
                status: _otpconstants.OTPStatus.VERIFIED,
                secret: secret
            };
            const result = strategy.validate('', errorHandlingContext);
            expect(result.isValid).toBe(false);
            expect(result.context.status).toBe(_otpconstants.OTPStatus.VERIFIED);
        });
        it('should handle null token gracefully', ()=>{
            const errorHandlingContext = {
                status: _otpconstants.OTPStatus.VERIFIED,
                secret: secret
            };
            const result = strategy.validate(null, errorHandlingContext);
            expect(result.isValid).toBe(false);
            expect(result.context.status).toBe(_otpconstants.OTPStatus.VERIFIED);
        });
    });
});

//# sourceMappingURL=totp.strategy.spec.js.map