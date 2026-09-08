"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _typeorm = require("typeorm");
const _workspacescopedrepository = require("../workspace-scoped-repository");
const WORKSPACE_ID = 'workspace-1';
const OTHER_WORKSPACE_ID = 'workspace-2';
const createMockRepository = ()=>({
        findOne: jest.fn().mockResolvedValue(null),
        findOneOrFail: jest.fn(),
        findOneBy: jest.fn().mockResolvedValue(null),
        find: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        findAndCount: jest.fn().mockResolvedValue([
            [],
            0
        ]),
        exists: jest.fn().mockResolvedValue(false),
        existsBy: jest.fn().mockResolvedValue(false),
        maximum: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
        increment: jest.fn(),
        decrement: jest.fn(),
        delete: jest.fn(),
        softDelete: jest.fn(),
        insert: jest.fn(),
        upsert: jest.fn(),
        create: jest.fn(),
        createQueryBuilder: jest.fn()
    });
describe('WorkspaceScopedRepository', ()=>{
    let repository;
    let scoped;
    beforeEach(()=>{
        repository = createMockRepository();
        scoped = new _workspacescopedrepository.WorkspaceScopedRepository(repository);
    });
    describe('workspaceId guard', ()=>{
        // TypeORM drops `undefined` values from WHERE/criteria, so a
        // missing workspaceId would otherwise produce an unscoped query.
        const unscopedCalls = [
            [
                'findOne',
                ()=>scoped.findOne(undefined, {
                        where: {}
                    })
            ],
            [
                'findOneOrFail',
                ()=>scoped.findOneOrFail(undefined, {
                        where: {}
                    })
            ],
            [
                'findOneBy',
                ()=>scoped.findOneBy(undefined, {})
            ],
            [
                'find',
                ()=>scoped.find(undefined)
            ],
            [
                'count',
                ()=>scoped.count(undefined)
            ],
            [
                'findAndCount',
                ()=>scoped.findAndCount(undefined)
            ],
            [
                'exists',
                ()=>scoped.exists(undefined)
            ],
            [
                'existsBy',
                ()=>scoped.existsBy(undefined, {})
            ],
            [
                'update',
                ()=>scoped.update(undefined, {}, {})
            ],
            [
                'increment',
                ()=>scoped.increment(undefined, {}, 'count', 1)
            ],
            [
                'decrement',
                ()=>scoped.decrement(undefined, {}, 'count', 1)
            ],
            [
                'delete',
                ()=>scoped.delete(undefined, {})
            ],
            [
                'softDelete',
                ()=>scoped.softDelete(undefined, {})
            ],
            [
                'insert',
                ()=>scoped.insert(undefined, {})
            ],
            [
                'upsert',
                ()=>scoped.upsert(undefined, {}, [
                        'id'
                    ])
            ],
            [
                'upsertAndReturnOne',
                ()=>scoped.upsertAndReturnOne(undefined, {}, [
                        'id'
                    ])
            ],
            [
                'insertAndReturnOne',
                ()=>scoped.insertAndReturnOne(undefined, {})
            ],
            [
                'maximum',
                ()=>scoped.maximum(undefined, 'id')
            ]
        ];
        it.each(unscopedCalls)('%s throws when workspaceId is undefined', async (_name, call)=>{
            await expect(Promise.resolve().then(()=>call())).rejects.toThrow(/workspaceId must be a non-empty string/);
        });
        it.each([
            null,
            ''
        ])('throws when workspaceId is %p', (badWorkspaceId)=>{
            expect(()=>scoped.findOne(badWorkspaceId, {
                    where: {}
                })).toThrow(/workspaceId must be a non-empty string/);
        });
    });
    describe('findOne', ()=>{
        it('merges workspaceId into a plain where clause', async ()=>{
            await scoped.findOne(WORKSPACE_ID, {
                where: {
                    id: 'a'
                }
            });
            expect(repository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 'a',
                    workspaceId: WORKSPACE_ID
                }
            });
        });
        it('merges workspaceId into every clause of an OR (array) where', async ()=>{
            await scoped.findOne(WORKSPACE_ID, {
                where: [
                    {
                        id: 'a'
                    },
                    {
                        status: 'queued'
                    }
                ]
            });
            expect(repository.findOne).toHaveBeenCalledWith({
                where: [
                    {
                        id: 'a',
                        workspaceId: WORKSPACE_ID
                    },
                    {
                        status: 'queued',
                        workspaceId: WORKSPACE_ID
                    }
                ]
            });
        });
        it('throws if the caller includes workspaceId in the WHERE clause', ()=>{
            expect(()=>scoped.findOne(WORKSPACE_ID, {
                    where: {
                        id: 'a',
                        workspaceId: OTHER_WORKSPACE_ID
                    }
                })).toThrow(/do not include `workspaceId`/);
            expect(repository.findOne).not.toHaveBeenCalled();
        });
        it('throws if any clause of an array WHERE includes workspaceId', ()=>{
            expect(()=>scoped.findOne(WORKSPACE_ID, {
                    where: [
                        {
                            id: 'a'
                        },
                        {
                            id: 'b',
                            workspaceId: OTHER_WORKSPACE_ID
                        }
                    ]
                })).toThrow(/do not include `workspaceId`/);
        });
        it('places workspaceId first in the merged WHERE clause', async ()=>{
            await scoped.findOne(WORKSPACE_ID, {
                where: {
                    id: 'a',
                    status: 'queued'
                }
            });
            const callArg = repository.findOne.mock.calls[0][0];
            const whereKeys = Object.keys(callArg.where);
            expect(whereKeys[0]).toBe('workspaceId');
        });
        it('preserves relations and other options', async ()=>{
            await scoped.findOne(WORKSPACE_ID, {
                where: {
                    id: 'a'
                },
                relations: [
                    'messages'
                ],
                select: [
                    'id'
                ]
            });
            expect(repository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 'a',
                    workspaceId: WORKSPACE_ID
                },
                relations: [
                    'messages'
                ],
                select: [
                    'id'
                ]
            });
        });
    });
    describe('findOneBy', ()=>{
        it('merges workspaceId into where', async ()=>{
            await scoped.findOneBy(WORKSPACE_ID, {
                id: 'a'
            });
            expect(repository.findOneBy).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            });
        });
        it('throws if the caller includes workspaceId in where', ()=>{
            expect(()=>scoped.findOneBy(WORKSPACE_ID, {
                    id: 'a',
                    workspaceId: OTHER_WORKSPACE_ID
                })).toThrow(/do not include `workspaceId`/);
            expect(repository.findOneBy).not.toHaveBeenCalled();
        });
    });
    describe('find', ()=>{
        it('adds workspaceId when no where is provided', async ()=>{
            await scoped.find(WORKSPACE_ID);
            expect(repository.find).toHaveBeenCalledWith({
                where: {
                    workspaceId: WORKSPACE_ID
                }
            });
        });
        it('merges workspaceId into provided where', async ()=>{
            await scoped.find(WORKSPACE_ID, {
                where: {
                    status: 'queued'
                }
            });
            expect(repository.find).toHaveBeenCalledWith({
                where: {
                    status: 'queued',
                    workspaceId: WORKSPACE_ID
                }
            });
        });
    });
    describe('findAndCount', ()=>{
        it('merges workspaceId into where', async ()=>{
            await scoped.findAndCount(WORKSPACE_ID, {
                where: {
                    status: 'queued'
                }
            });
            expect(repository.findAndCount).toHaveBeenCalledWith({
                where: {
                    status: 'queued',
                    workspaceId: WORKSPACE_ID
                }
            });
        });
        it('works without options', async ()=>{
            await scoped.findAndCount(WORKSPACE_ID);
            expect(repository.findAndCount).toHaveBeenCalledWith({
                where: {
                    workspaceId: WORKSPACE_ID
                }
            });
        });
    });
    describe('exists', ()=>{
        it('merges workspaceId into where', async ()=>{
            await scoped.exists(WORKSPACE_ID, {
                where: {
                    status: 'queued'
                }
            });
            expect(repository.exists).toHaveBeenCalledWith({
                where: {
                    status: 'queued',
                    workspaceId: WORKSPACE_ID
                }
            });
        });
        it('works without options', async ()=>{
            await scoped.exists(WORKSPACE_ID);
            expect(repository.exists).toHaveBeenCalledWith({
                where: {
                    workspaceId: WORKSPACE_ID
                }
            });
        });
    });
    describe('existsBy', ()=>{
        it('merges workspaceId into where', async ()=>{
            await scoped.existsBy(WORKSPACE_ID, {
                id: 'a'
            });
            expect(repository.existsBy).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            });
        });
    });
    describe('update', ()=>{
        it('merges workspaceId into the criteria, not the patch', async ()=>{
            await scoped.update(WORKSPACE_ID, {
                id: 'a'
            }, {
                status: 'completed'
            });
            expect(repository.update).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            }, {
                status: 'completed'
            });
        });
        it('throws if the caller includes workspaceId in the criteria', ()=>{
            expect(()=>scoped.update(WORKSPACE_ID, {
                    id: 'a',
                    workspaceId: OTHER_WORKSPACE_ID
                }, {
                    status: 'completed'
                })).toThrow(/do not include `workspaceId`/);
            expect(repository.update).not.toHaveBeenCalled();
        });
    });
    describe('increment and decrement', ()=>{
        it('increment merges workspaceId into criteria', async ()=>{
            await scoped.increment(WORKSPACE_ID, {
                id: 'a'
            }, 'count', 1);
            expect(repository.increment).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            }, 'count', 1);
        });
        it('increment throws if the caller includes workspaceId in the criteria', ()=>{
            expect(()=>scoped.increment(WORKSPACE_ID, {
                    id: 'a',
                    workspaceId: OTHER_WORKSPACE_ID
                }, 'count', 1)).toThrow(/do not include `workspaceId`/);
            expect(repository.increment).not.toHaveBeenCalled();
        });
        it('decrement merges workspaceId into criteria', async ()=>{
            await scoped.decrement(WORKSPACE_ID, {
                id: 'a'
            }, 'count', 1);
            expect(repository.decrement).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            }, 'count', 1);
        });
    });
    describe('delete and softDelete', ()=>{
        it('delete merges workspaceId into criteria', async ()=>{
            await scoped.delete(WORKSPACE_ID, {
                id: 'a'
            });
            expect(repository.delete).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            });
        });
        it('softDelete merges workspaceId into criteria', async ()=>{
            await scoped.softDelete(WORKSPACE_ID, {
                id: 'a'
            });
            expect(repository.softDelete).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            });
        });
    });
    describe('insert', ()=>{
        it('stamps workspaceId on a single entity', async ()=>{
            await scoped.insert(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            });
            expect(repository.insert).toHaveBeenCalledWith({
                id: 'a',
                status: 'queued',
                workspaceId: WORKSPACE_ID
            });
        });
        it('stamps workspaceId on each entity in an array', async ()=>{
            await scoped.insert(WORKSPACE_ID, [
                {
                    id: 'a',
                    status: 'queued'
                },
                {
                    id: 'b',
                    status: 'sent'
                }
            ]);
            expect(repository.insert).toHaveBeenCalledWith([
                {
                    id: 'a',
                    status: 'queued',
                    workspaceId: WORKSPACE_ID
                },
                {
                    id: 'b',
                    status: 'sent',
                    workspaceId: WORKSPACE_ID
                }
            ]);
        });
        it('overrides caller-supplied workspaceId on the entity', async ()=>{
            await scoped.insert(WORKSPACE_ID, {
                id: 'a',
                workspaceId: OTHER_WORKSPACE_ID
            });
            expect(repository.insert).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            });
        });
    });
    describe('upsert', ()=>{
        it('stamps workspaceId on a single entity and forwards conflict opts', async ()=>{
            await scoped.upsert(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            }, [
                'id'
            ]);
            expect(repository.upsert).toHaveBeenCalledWith({
                id: 'a',
                status: 'queued',
                workspaceId: WORKSPACE_ID
            }, [
                'id'
            ]);
        });
        it('stamps workspaceId on each entity in an array', async ()=>{
            await scoped.upsert(WORKSPACE_ID, [
                {
                    id: 'a',
                    status: 'queued'
                },
                {
                    id: 'b',
                    status: 'sent'
                }
            ], {
                conflictPaths: [
                    'id'
                ]
            });
            expect(repository.upsert).toHaveBeenCalledWith([
                {
                    id: 'a',
                    status: 'queued',
                    workspaceId: WORKSPACE_ID
                },
                {
                    id: 'b',
                    status: 'sent',
                    workspaceId: WORKSPACE_ID
                }
            ], {
                conflictPaths: [
                    'id'
                ]
            });
        });
    });
    describe('upsertAndReturnOne', ()=>{
        it('upserts with RETURNING and hydrates the row from generatedMaps', async ()=>{
            const persistedRow = {
                id: 'a',
                status: 'queued',
                workspaceId: WORKSPACE_ID
            };
            repository.upsert.mockResolvedValue({
                generatedMaps: [
                    persistedRow
                ]
            });
            repository.create.mockReturnValue(persistedRow);
            const result = await scoped.upsertAndReturnOne(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            }, [
                'id'
            ]);
            expect(repository.upsert).toHaveBeenCalledWith({
                id: 'a',
                status: 'queued',
                workspaceId: WORKSPACE_ID
            }, {
                conflictPaths: [
                    'id'
                ],
                returning: '*'
            });
            expect(repository.create).toHaveBeenCalledWith(persistedRow);
            expect(result).toBe(persistedRow);
        });
        it('throws instead of returning a hollow entity when no row is returned', async ()=>{
            repository.upsert.mockResolvedValue({
                generatedMaps: []
            });
            await expect(scoped.upsertAndReturnOne(WORKSPACE_ID, {
                id: 'a'
            }, [
                'id'
            ])).rejects.toThrow(/upsert returned no row/);
            expect(repository.create).not.toHaveBeenCalled();
        });
    });
    describe('insertAndReturnOne', ()=>{
        const mockInsertBuilder = (repo, raw)=>{
            const builder = {
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    raw
                })
            };
            repo.createQueryBuilder.mockReturnValue(builder);
            return builder;
        };
        it('stamps workspaceId and hydrates the row from RETURNING', async ()=>{
            const persistedRow = {
                id: 'a',
                status: 'queued',
                workspaceId: WORKSPACE_ID
            };
            const builder = mockInsertBuilder(repository, [
                persistedRow
            ]);
            repository.create.mockReturnValue(persistedRow);
            const result = await scoped.insertAndReturnOne(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            });
            expect(builder.values).toHaveBeenCalledWith({
                id: 'a',
                status: 'queued',
                workspaceId: WORKSPACE_ID
            });
            expect(builder.returning).toHaveBeenCalledWith('*');
            expect(result).toBe(persistedRow);
        });
        it('overrides a caller-supplied workspaceId on the entity', async ()=>{
            const builder = mockInsertBuilder(repository, [
                {
                    id: 'a'
                }
            ]);
            await scoped.insertAndReturnOne(WORKSPACE_ID, {
                id: 'a',
                workspaceId: OTHER_WORKSPACE_ID
            });
            expect(builder.values).toHaveBeenCalledWith({
                id: 'a',
                workspaceId: WORKSPACE_ID
            });
        });
    });
    describe('upsert conflict target guard', ()=>{
        it('refuses an upsert whose conflict target matches another workspace', async ()=>{
            repository.findOne.mockResolvedValue({
                id: 'a',
                workspaceId: OTHER_WORKSPACE_ID
            });
            await expect(scoped.upsert(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            }, [
                'id'
            ])).rejects.toThrow(/matches a row owned by another workspace/);
            expect(repository.upsert).not.toHaveBeenCalled();
        });
        it('looks the conflict target up across workspaces, including soft-deleted rows', async ()=>{
            await scoped.upsert(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            }, [
                'id'
            ]);
            expect(repository.findOne).toHaveBeenCalledWith({
                where: [
                    {
                        id: 'a',
                        workspaceId: (0, _typeorm.Not)(WORKSPACE_ID)
                    }
                ],
                withDeleted: true
            });
        });
        it('checks every entity of a batch', async ()=>{
            await scoped.upsert(WORKSPACE_ID, [
                {
                    id: 'a',
                    status: 'queued'
                },
                {
                    id: 'b',
                    status: 'sent'
                }
            ], {
                conflictPaths: [
                    'id'
                ]
            });
            expect(repository.findOne).toHaveBeenCalledWith({
                where: [
                    {
                        id: 'a',
                        workspaceId: (0, _typeorm.Not)(WORKSPACE_ID)
                    },
                    {
                        id: 'b',
                        workspaceId: (0, _typeorm.Not)(WORKSPACE_ID)
                    }
                ],
                withDeleted: true
            });
        });
        it('skips the lookup when workspaceId is part of the conflict target', async ()=>{
            await scoped.upsert(WORKSPACE_ID, {
                id: 'a',
                status: 'queued'
            }, [
                'workspaceId',
                'id'
            ]);
            expect(repository.findOne).not.toHaveBeenCalled();
            expect(repository.upsert).toHaveBeenCalled();
        });
        it('skips the lookup when the conflict target is not fully populated', async ()=>{
            await scoped.upsert(WORKSPACE_ID, {
                status: 'queued'
            }, [
                'id'
            ]);
            expect(repository.findOne).not.toHaveBeenCalled();
            expect(repository.upsert).toHaveBeenCalled();
        });
        it('guards upsertAndReturnOne as well', async ()=>{
            repository.findOne.mockResolvedValue({
                id: 'a',
                workspaceId: OTHER_WORKSPACE_ID
            });
            await expect(scoped.upsertAndReturnOne(WORKSPACE_ID, {
                id: 'a'
            }, [
                'id'
            ])).rejects.toThrow(/matches a row owned by another workspace/);
            expect(repository.upsert).not.toHaveBeenCalled();
        });
    });
    describe('count', ()=>{
        it('merges workspaceId into where', async ()=>{
            await scoped.count(WORKSPACE_ID, {
                where: {
                    status: 'queued'
                }
            });
            expect(repository.count).toHaveBeenCalledWith({
                where: {
                    status: 'queued',
                    workspaceId: WORKSPACE_ID
                }
            });
        });
        it('adds workspaceId when no options are provided', async ()=>{
            await scoped.count(WORKSPACE_ID);
            expect(repository.count).toHaveBeenCalledWith({
                where: {
                    workspaceId: WORKSPACE_ID
                }
            });
        });
    });
    describe('maximum', ()=>{
        it('calls with scoped criteria when where is provided', async ()=>{
            await scoped.maximum(WORKSPACE_ID, 'id', {
                status: 'queued'
            });
            expect(repository.maximum).toHaveBeenCalledWith('id', {
                status: 'queued',
                workspaceId: WORKSPACE_ID
            });
        });
        it('calls with only workspaceId when no where is given', async ()=>{
            await scoped.maximum(WORKSPACE_ID, 'id');
            expect(repository.maximum).toHaveBeenCalledWith('id', {
                workspaceId: WORKSPACE_ID
            });
        });
    });
    describe('createQueryBuilder', ()=>{
        it('returns the underlying QueryBuilder unchanged (escape hatch)', ()=>{
            scoped.createQueryBuilder('t');
            expect(repository.createQueryBuilder).toHaveBeenCalledWith('t');
        });
    });
    describe('withManager', ()=>{
        it('returns a new wrapper bound to the manager-provided repository', async ()=>{
            const txRepository = createMockRepository();
            const manager = {
                getRepository: jest.fn().mockReturnValue(txRepository)
            };
            repository.target = 'FakeEntity';
            const tx = scoped.withManager(manager);
            expect(tx).not.toBe(scoped);
            expect(manager.getRepository).toHaveBeenCalledWith('FakeEntity');
            await tx.findOne(WORKSPACE_ID, {
                where: {
                    id: 'a'
                }
            });
            expect(txRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 'a',
                    workspaceId: WORKSPACE_ID
                }
            });
            expect(repository.findOne).not.toHaveBeenCalled();
        });
    });
});

//# sourceMappingURL=workspace-scoped-repository.spec.js.map