"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _responsesutils = require("../responses.utils");
describe('getFindManyResponse200', ()=>{
    it('documents the direct metadata list envelope and complete page info', ()=>{
        const response = (0, _responsesutils.getFindManyResponse200)({
            item: {
                nameSingular: 'view',
                namePlural: 'views'
            },
            isDirectDataFeatureFlagged: true
        });
        expect(response).toMatchObject({
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            data: {
                                oneOf: [
                                    {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/ViewForResponse'
                                        }
                                    },
                                    {
                                        type: 'object',
                                        properties: {
                                            views: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/ViewForResponse'
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            pageInfo: {
                                properties: {
                                    hasNextPage: {
                                        type: 'boolean'
                                    },
                                    hasPreviousPage: {
                                        type: 'boolean'
                                    },
                                    startCursor: {
                                        type: [
                                            'string',
                                            'null'
                                        ]
                                    },
                                    endCursor: {
                                        type: [
                                            'string',
                                            'null'
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });
    it('keeps the workspace record REST envelope nested', ()=>{
        const response = (0, _responsesutils.getFindManyResponse200)({
            item: {
                nameSingular: 'company',
                namePlural: 'companies'
            }
        });
        expect(response).toMatchObject({
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            data: {
                                type: 'object',
                                properties: {
                                    companies: {
                                        type: 'array'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });
});

//# sourceMappingURL=responses.utils.spec.js.map