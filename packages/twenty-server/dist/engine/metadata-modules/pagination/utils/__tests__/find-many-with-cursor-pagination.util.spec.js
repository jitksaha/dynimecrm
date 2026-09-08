"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphqlerrorsutil = require("../../../../core-modules/graphql/utils/graphql-errors.util");
const _cursorsutil = require("../../../../api/graphql/graphql-query-runner/utils/cursors.util");
const _findmanyitemswithcursorpaginationutil = require("../find-many-items-with-cursor-pagination.util");
const _findmanywithcursorpaginationutil = require("../find-many-with-cursor-pagination.util");
const UUID_A = '00000000-0000-4000-8000-00000000000a';
const UUID_B = '00000000-0000-4000-8000-00000000000b';
const UUID_C = '00000000-0000-4000-8000-00000000000c';
const UUID_D = '00000000-0000-4000-8000-00000000000d';
const createFakeQueryBuilder = (rows)=>{
    const calls = {
        orderBy: [],
        andWhere: [],
        take: []
    };
    let takenAmount;
    const queryBuilder = {
        orderBy (column, direction) {
            calls.orderBy.push([
                column,
                direction
            ]);
            return queryBuilder;
        },
        andWhere (condition, parameters) {
            calls.andWhere.push([
                condition,
                parameters
            ]);
            return queryBuilder;
        },
        take (amount) {
            calls.take.push(amount);
            takenAmount = amount;
            return queryBuilder;
        },
        // Rows are supplied in the order the query would return them, so honouring
        // take keeps the fake faithful to a real keyset window.
        getMany: async ()=>rows.slice(0, takenAmount ?? rows.length)
    };
    return {
        queryBuilder: queryBuilder,
        calls
    };
};
const paginate = (rows, paging)=>{
    const { queryBuilder, calls } = createFakeQueryBuilder(rows);
    return {
        calls,
        result: (0, _findmanywithcursorpaginationutil.findManyWithCursorPagination)({
            queryBuilder,
            alias: 'entity',
            paging,
            defaultResultSize: 10,
            maxResultsSize: 1000
        })
    };
};
const cursorFor = (id)=>(0, _cursorsutil.encodeCursorData)({
        id
    });
describe('findManyWithCursorPagination', ()=>{
    it.each([
        [
            {
                first: 1,
                last: 1
            }
        ],
        [
            {
                first: 1,
                before: cursorFor(UUID_A)
            }
        ],
        [
            {
                last: 1,
                after: cursorFor(UUID_A)
            }
        ],
        [
            {
                after: cursorFor(UUID_A),
                before: cursorFor(UUID_B)
            }
        ],
        [
            {
                first: -1
            }
        ],
        [
            {
                last: -1
            }
        ],
        [
            {
                first: 1001
            }
        ]
    ])('rejects invalid paging %j', async (paging)=>{
        await expect(paginate([], paging).result).rejects.toThrow(_graphqlerrorsutil.UserInputError);
    });
    it.each([
        [
            'not-base64-json'
        ],
        [
            Buffer.from('null').toString('base64')
        ],
        [
            Buffer.from('42').toString('base64')
        ],
        [
            Buffer.from('[]').toString('base64')
        ],
        [
            Buffer.from('{"noId":true}').toString('base64')
        ],
        [
            Buffer.from('{"id":42}').toString('base64')
        ],
        [
            Buffer.from('{"id":"not-a-uuid"}').toString('base64')
        ]
    ])('rejects malformed cursor %s as user input error', async (after)=>{
        await expect(paginate([], {
            after
        }).result).rejects.toThrow(_graphqlerrorsutil.UserInputError);
    });
    it('pages forward with id DESC ordering and a keyset condition', async ()=>{
        const rows = [
            {
                id: UUID_C
            },
            {
                id: UUID_B
            },
            {
                id: UUID_A
            }
        ];
        const { result, calls } = paginate(rows, {
            first: 2,
            after: cursorFor(UUID_D)
        });
        const connection = await result;
        expect(calls.orderBy).toEqual([
            [
                '"entity"."id"',
                'DESC'
            ]
        ]);
        expect(calls.andWhere).toEqual([
            [
                '"entity"."id" < :metadataPaginationCursorId',
                {
                    metadataPaginationCursorId: UUID_D
                }
            ]
        ]);
        expect(calls.take).toEqual([
            3
        ]);
        expect(connection.edges.map(({ node })=>node.id)).toEqual([
            UUID_C,
            UUID_B
        ]);
        expect(connection.pageInfo).toEqual({
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: cursorFor(UUID_C),
            endCursor: cursorFor(UUID_B)
        });
    });
    it('reports no previous page when paging forward from the start', async ()=>{
        const { result } = paginate([
            {
                id: UUID_B
            },
            {
                id: UUID_A
            }
        ], {
            first: 10
        });
        const connection = await result;
        expect(connection.pageInfo.hasNextPage).toBe(false);
        expect(connection.pageInfo.hasPreviousPage).toBe(false);
    });
    it('pages backward with reversed ordering and reversed results', async ()=>{
        const rows = [
            {
                id: UUID_B
            },
            {
                id: UUID_C
            },
            {
                id: UUID_D
            }
        ];
        const { result, calls } = paginate(rows, {
            last: 2,
            before: cursorFor(UUID_A)
        });
        const connection = await result;
        expect(calls.orderBy).toEqual([
            [
                '"entity"."id"',
                'ASC'
            ]
        ]);
        expect(calls.andWhere).toEqual([
            [
                '"entity"."id" > :metadataPaginationCursorId',
                {
                    metadataPaginationCursorId: UUID_A
                }
            ]
        ]);
        expect(connection.edges.map(({ node })=>node.id)).toEqual([
            UUID_C,
            UUID_B
        ]);
        expect(connection.pageInfo.hasPreviousPage).toBe(true);
        expect(connection.pageInfo.hasNextPage).toBe(true);
    });
    it('supports fetching the last page without a before cursor', async ()=>{
        // Presentation order is id DESC, so the last page holds the smallest ids.
        // Rows are listed ASC because that is the order the backward query walks,
        // and the dataset is larger than the page so the window is not trivial.
        const rows = [
            {
                id: UUID_A
            },
            {
                id: UUID_B
            },
            {
                id: UUID_C
            },
            {
                id: UUID_D
            }
        ];
        const { result, calls } = paginate(rows, {
            last: 2
        });
        const connection = await result;
        expect(calls.orderBy).toEqual([
            [
                '"entity"."id"',
                'ASC'
            ]
        ]);
        expect(calls.andWhere).toEqual([]);
        expect(connection.edges.map(({ node })=>node.id)).toEqual([
            UUID_B,
            UUID_A
        ]);
        expect(connection.pageInfo).toMatchObject({
            hasNextPage: false,
            hasPreviousPage: true
        });
        const fullDatasetConnection = (0, _findmanyitemswithcursorpaginationutil.findManyItemsWithCursorPagination)({
            items: [
                {
                    id: UUID_D
                },
                {
                    id: UUID_C
                },
                {
                    id: UUID_B
                },
                {
                    id: UUID_A
                }
            ],
            paging: {
                last: 2
            }
        });
        expect(fullDatasetConnection.edges.map(({ node })=>node.id)).toEqual([
            UUID_B,
            UUID_A
        ]);
    });
    it('uses the default result size when paging is omitted', async ()=>{
        const { result, calls } = paginate([
            {
                id: UUID_A
            }
        ], undefined);
        await result;
        expect(calls.take).toEqual([
            11
        ]);
    });
    it('returns null cursors for an empty page', async ()=>{
        const connection = await paginate([], {
            first: 5
        }).result;
        expect(connection.edges).toEqual([]);
        expect(connection.pageInfo.startCursor).toBeNull();
        expect(connection.pageInfo.endCursor).toBeNull();
    });
    it('uses the same cursor semantics for batched relation items', ()=>{
        const connection = (0, _findmanyitemswithcursorpaginationutil.findManyItemsWithCursorPagination)({
            items: [
                {
                    id: UUID_A
                },
                {
                    id: UUID_D
                },
                {
                    id: UUID_B
                },
                {
                    id: UUID_C
                }
            ],
            paging: {
                first: 2,
                after: cursorFor(UUID_D)
            },
            defaultResultSize: 10,
            maxResultsSize: 1000
        });
        expect(connection.edges.map(({ node })=>node.id)).toEqual([
            UUID_C,
            UUID_B
        ]);
        expect(connection.pageInfo).toMatchObject({
            hasNextPage: true,
            hasPreviousPage: true
        });
    });
});

//# sourceMappingURL=find-many-with-cursor-pagination.util.spec.js.map