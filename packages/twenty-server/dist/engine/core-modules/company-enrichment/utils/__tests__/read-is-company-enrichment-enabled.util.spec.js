"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _readiscompanyenrichmentenabledutil = require("../read-is-company-enrichment-enabled.util");
const buildConfigService = (values)=>({
        get: (key)=>values[key]
    });
describe('readIsCompanyEnrichmentEnabled', ()=>{
    it('should be enabled with the AI chat consumer and an api key', ()=>{
        expect((0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(buildConfigService({
            IS_ONBOARDING_AI_CHAT_ENABLED: true,
            PEOPLE_DATA_LABS_API_KEY: 'pdl-key'
        }))).toBe(true);
    });
    it('should be enabled with the book-call consumer and an api key', ()=>{
        expect((0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(buildConfigService({
            IS_ONBOARDING_AI_CHAT_ENABLED: false,
            CALENDAR_BOOKING_PAGE_ID: 'team/twenty/talk-to-us',
            ONBOARDING_BOOK_CALL_MIN_EMPLOYEE_COUNT: 20,
            PEOPLE_DATA_LABS_API_KEY: 'pdl-key'
        }))).toBe(true);
    });
    it('should be disabled without any consumer', ()=>{
        expect((0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(buildConfigService({
            IS_ONBOARDING_AI_CHAT_ENABLED: false,
            PEOPLE_DATA_LABS_API_KEY: 'pdl-key'
        }))).toBe(false);
    });
    it('should be disabled without an api key even when a consumer is configured', ()=>{
        expect((0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(buildConfigService({
            IS_ONBOARDING_AI_CHAT_ENABLED: true,
            PEOPLE_DATA_LABS_API_KEY: undefined
        }))).toBe(false);
    });
    it('should be disabled with neither a consumer nor an api key', ()=>{
        expect((0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(buildConfigService({}))).toBe(false);
    });
    it('should not treat an unconfigured book-call threshold as a consumer', ()=>{
        expect((0, _readiscompanyenrichmentenabledutil.readIsCompanyEnrichmentEnabled)(buildConfigService({
            IS_ONBOARDING_AI_CHAT_ENABLED: false,
            CALENDAR_BOOKING_PAGE_ID: 'team/twenty/talk-to-us',
            PEOPLE_DATA_LABS_API_KEY: 'pdl-key'
        }))).toBe(false);
    });
});

//# sourceMappingURL=read-is-company-enrichment-enabled.util.spec.js.map