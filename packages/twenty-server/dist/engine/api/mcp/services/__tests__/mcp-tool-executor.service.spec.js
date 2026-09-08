"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _mcptoolexecutorservice = require("../mcp-tool-executor.service");
const _metricsservice = require("../../../../core-modules/metrics/metrics.service");
const _metricskeystype = require("../../../../core-modules/metrics/types/metrics-keys.type");
describe('McpToolExecutorService', ()=>{
    let service;
    let metricsService;
    const buildToolSet = (execute)=>({
            create_person: {
                description: 'Create a person',
                inputSchema: {},
                execute
            }
        });
    beforeEach(async ()=>{
        metricsService = {
            incrementCounterBy: jest.fn(),
            recordHistogram: jest.fn()
        };
        const module = await _testing.Test.createTestingModule({
            providers: [
                _mcptoolexecutorservice.McpToolExecutorService,
                {
                    provide: _metricsservice.MetricsService,
                    useValue: metricsService
                }
            ]
        }).compile();
        service = module.get(_mcptoolexecutorservice.McpToolExecutorService);
    });
    afterEach(()=>{
        jest.clearAllMocks();
    });
    describe('handleToolCall', ()=>{
        it('should return isError false and count a success when the tool output succeeds', async ()=>{
            const toolOutput = {
                success: true,
                message: 'Created'
            };
            const toolSet = buildToolSet(jest.fn().mockResolvedValue(toolOutput));
            const response = await service.handleToolCall(1, toolSet, {
                name: 'create_person',
                arguments: {}
            });
            expect(response).toEqual({
                id: 1,
                jsonrpc: '2.0',
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(toolOutput)
                        }
                    ],
                    isError: false
                }
            });
            expect(metricsService.incrementCounterBy).toHaveBeenCalledWith(expect.objectContaining({
                key: _metricskeystype.MetricsKeys.McpToolExecutionSucceeded
            }));
        });
        it('should return isError true and count a failure when the tool output resolves with success false', async ()=>{
            const toolOutput = {
                success: false,
                message: 'Validation failed',
                error: 'Missing required field'
            };
            const toolSet = buildToolSet(jest.fn().mockResolvedValue(toolOutput));
            const response = await service.handleToolCall(1, toolSet, {
                name: 'create_person',
                arguments: {}
            });
            expect(response).toEqual({
                id: 1,
                jsonrpc: '2.0',
                result: {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(toolOutput)
                        }
                    ],
                    isError: true
                }
            });
            expect(metricsService.incrementCounterBy).toHaveBeenCalledWith(expect.objectContaining({
                key: _metricskeystype.MetricsKeys.McpToolExecutionFailed
            }));
        });
        it('should return isError true and count a failure when the tool throws', async ()=>{
            const toolSet = buildToolSet(jest.fn().mockRejectedValue(new Error('Database unavailable')));
            const response = await service.handleToolCall(1, toolSet, {
                name: 'create_person',
                arguments: {}
            });
            expect(response).toEqual({
                id: 1,
                jsonrpc: '2.0',
                result: {
                    content: [
                        {
                            type: 'text',
                            text: 'Database unavailable'
                        }
                    ],
                    isError: true
                }
            });
            expect(metricsService.incrementCounterBy).toHaveBeenCalledWith(expect.objectContaining({
                key: _metricskeystype.MetricsKeys.McpToolExecutionFailed
            }));
        });
    });
});

//# sourceMappingURL=mcp-tool-executor.service.spec.js.map