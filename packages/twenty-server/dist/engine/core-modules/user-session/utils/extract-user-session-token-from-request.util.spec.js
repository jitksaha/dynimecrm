"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _usersessioncookienameconstant = require("../constants/user-session-cookie-name.constant");
const _usersessionsecurecookienameconstant = require("../constants/user-session-secure-cookie-name.constant");
const _extractusersessiontokenfromrequestutil = require("./extract-user-session-token-from-request.util");
const buildRequest = (cookieHeader)=>({
        headers: cookieHeader === undefined ? {} : {
            cookie: cookieHeader
        }
    });
const extractOnHttpDeployment = (cookieHeader)=>(0, _extractusersessiontokenfromrequestutil.extractUserSessionTokenFromRequestCookie)(buildRequest(cookieHeader), {
        secureCookieName: _usersessionsecurecookienameconstant.USER_SESSION_SECURE_COOKIE_NAME,
        insecureCookieName: _usersessioncookienameconstant.USER_SESSION_COOKIE_NAME,
        allowInsecureCookieName: true
    });
const extractOnHttpsDeployment = (cookieHeader)=>(0, _extractusersessiontokenfromrequestutil.extractUserSessionTokenFromRequestCookie)(buildRequest(cookieHeader), {
        secureCookieName: _usersessionsecurecookienameconstant.USER_SESSION_SECURE_COOKIE_NAME,
        insecureCookieName: _usersessioncookienameconstant.USER_SESSION_COOKIE_NAME,
        allowInsecureCookieName: false
    });
describe('extractUserSessionTokenFromRequestCookie', ()=>{
    it('should return undefined without a cookie header', ()=>{
        expect(extractOnHttpDeployment()).toBe(undefined);
    });
    it('should read the plain cookie name when the deployment cannot set Secure', ()=>{
        expect(extractOnHttpDeployment('foo=bar; twenty-session=sess_abc; other=1')).toBe('sess_abc');
    });
    it('should ignore the plain cookie name on a secure deployment', ()=>{
        expect(extractOnHttpsDeployment('twenty-session=sess_tossed')).toBe(undefined);
    });
    it('should read the __Host- cookie name on a secure deployment', ()=>{
        expect(extractOnHttpsDeployment('__Host-twenty-session=sess_abc')).toBe('sess_abc');
    });
    it('should prefer the __Host- cookie name', ()=>{
        expect(extractOnHttpDeployment('twenty-session=sess_old; __Host-twenty-session=sess_new')).toBe('sess_new');
    });
    it('should ignore values without the session token prefix', ()=>{
        expect(extractOnHttpDeployment('twenty-session=not-a-session-token')).toBe(undefined);
    });
    it('should ignore lookalike cookie names', ()=>{
        expect(extractOnHttpDeployment('not-twenty-session=sess_abc')).toBe(undefined);
    });
});

//# sourceMappingURL=extract-user-session-token-from-request.util.spec.js.map