"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _wellknowncontroller = require("../well-known.controller");
const _twentyconfigservice = require("../../../twenty-config/twenty-config.service");
describe('WellKnownController', ()=>{
    let controller;
    const configGet = jest.fn();
    const buildMockRequest = (host, protocol = 'https')=>({
            protocol,
            get: (header)=>header.toLowerCase() === 'host' ? host : undefined
        });
    beforeEach(async ()=>{
        configGet.mockReset();
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _wellknowncontroller.WellKnownController
            ],
            providers: [
                {
                    provide: _twentyconfigservice.TwentyConfigService,
                    useValue: {
                        get: configGet
                    }
                }
            ]
        }).compile();
        controller = module.get(_wellknowncontroller.WellKnownController);
    });
    describe('getMcpServerCard', ()=>{
        it('builds the card for the request host', ()=>{
            configGet.mockReturnValue('1.2.3');
            const card = controller.getMcpServerCard(buildMockRequest('workspace.twenty.com'));
            expect(card.remotes[0].url).toBe('https://workspace.twenty.com/mcp');
            expect(card.version).toBe('1.2.3');
        });
        it('falls back to 0.0.0 when APP_VERSION is unset', ()=>{
            configGet.mockReturnValue(undefined);
            const card = controller.getMcpServerCard(buildMockRequest('workspace.twenty.com'));
            expect(card.version).toBe('0.0.0');
        });
    });
    describe('getApiCatalog', ()=>{
        it('returns a parseable linkset anchored on the request host', ()=>{
            const body = controller.getApiCatalog(buildMockRequest('workspace.twenty.com'));
            const parsed = JSON.parse(body);
            expect(parsed.linkset.map((entry)=>entry.anchor)).toContain('https://workspace.twenty.com/rest');
        });
        it('respects the forwarded protocol', ()=>{
            const body = controller.getApiCatalog(buildMockRequest('localhost:3000', 'http'));
            expect(JSON.parse(body).linkset[0].anchor).toBe('http://localhost:3000/rest');
        });
    });
});

//# sourceMappingURL=well-known.controller.spec.js.map