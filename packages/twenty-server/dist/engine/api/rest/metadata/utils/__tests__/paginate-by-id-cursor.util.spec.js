"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _ismetadatarestrequestutil = require("../is-metadata-rest-request.util");
const _paginatemetadatarestitemsutil = require("../paginate-metadata-rest-items.util");
const _parsemetadatarestpaginationutil = require("../parse-metadata-rest-pagination.util");
const UUID_A = '00000000-0000-4000-8000-00000000000a';
const UUID_B = '00000000-0000-4000-8000-00000000000b';
const UUID_C = '00000000-0000-4000-8000-00000000000c';
const requestWithQuery = (query)=>({
        query
    });
describe('paginateMetadataRestItems', ()=>{
    it('uses the shared REST default and maximum page size', ()=>{
        expect((0, _parsemetadatarestpaginationutil.parseMetadataRestPagination)(requestWithQuery({})).limit).toBe(_constants.QUERY_DEFAULT_LIMIT_RECORDS);
        expect((0, _parsemetadatarestpaginationutil.parseMetadataRestPagination)(requestWithQuery({
            limit: `${_constants.QUERY_MAX_RECORDS + 1}`
        })).limit).toBe(_constants.QUERY_MAX_RECORDS);
    });
    it('parses REST arguments and returns the unified direct envelope', ()=>{
        const page = (0, _paginatemetadatarestitemsutil.paginateMetadataRestItems)({
            items: [
                {
                    id: UUID_A
                },
                {
                    id: UUID_B
                },
                {
                    id: UUID_C
                }
            ],
            request: requestWithQuery({
                limit: '1',
                starting_after: UUID_A
            })
        });
        expect(page).toEqual({
            data: [
                {
                    id: UUID_B
                }
            ],
            pageInfo: {
                hasNextPage: true,
                hasPreviousPage: true,
                startCursor: UUID_B,
                endCursor: UUID_B
            },
            totalCount: 3
        });
    });
    it('rejects mutually exclusive cursors', ()=>{
        expect(()=>(0, _paginatemetadatarestitemsutil.paginateMetadataRestItems)({
                items: [],
                request: requestWithQuery({
                    starting_after: UUID_A,
                    ending_before: UUID_B
                })
            })).toThrow(_common.BadRequestException);
    });
    it('rejects malformed identity cursors', ()=>{
        expect(()=>(0, _paginatemetadatarestitemsutil.paginateMetadataRestItems)({
                items: [],
                request: requestWithQuery({
                    starting_after: 'not-a-uuid'
                })
            })).toThrow('Invalid cursor');
    });
});
describe('isMetadataRestRequest', ()=>{
    it('distinguishes metadata routes from deprecated aliases', ()=>{
        expect((0, _ismetadatarestrequestutil.isMetadataRestRequest)({
            originalUrl: '/rest/metadata/webhooks?limit=1'
        })).toBe(true);
        expect((0, _ismetadatarestrequestutil.isMetadataRestRequest)({
            originalUrl: '/rest/webhooks?limit=1'
        })).toBe(false);
    });
});

//# sourceMappingURL=paginate-by-id-cursor.util.spec.js.map