"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _types = require("twenty-shared/types");
const _workspacemanyorallflatentitymapscacheservice = require("../../../flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service");
const _viewfieldservice = require("../../../view-field/services/view-field.service");
const _viewfilterservice = require("../../../view-filter/services/view-filter.service");
const _viewsortservice = require("../../../view-sort/services/view-sort.service");
const _completeviewupsertservice = require("../services/complete-view-upsert.service");
const _viewqueryparamsservice = require("../../services/view-query-params.service");
const _viewservice = require("../../services/view.service");
const _viewtoolsfactory = require("../view-tools.factory");
describe('ViewToolsFactory', ()=>{
    let viewToolsFactory;
    let viewService;
    let completeViewUpsertService;
    let viewFieldService;
    let viewQueryParamsService;
    const mockWorkspaceId = 'workspace-id';
    const mockUserWorkspaceId = 'user-workspace-id';
    const mockViewId = 'view-id';
    const mockObjectMetadataId = 'object-metadata-id';
    const mockObjectNameSingular = 'company';
    const mockCalendarFieldMetadataId = 'calendar-field-metadata-id';
    const mockCalendarEndFieldMetadataId = 'calendar-end-field-metadata-id';
    const mockNameFieldMetadataId = 'name-field-metadata-id';
    const mockStageFieldMetadataId = 'stage-field-metadata-id';
    const mockFlatFieldMetadataMaps = {
        byUniversalIdentifier: {
            'field-universal-id': {
                id: mockCalendarFieldMetadataId,
                name: 'dueAt',
                type: _types.FieldMetadataType.DATE_TIME,
                objectMetadataId: mockObjectMetadataId,
                universalIdentifier: 'field-universal-id'
            },
            'end-field-universal-id': {
                id: mockCalendarEndFieldMetadataId,
                name: 'endsAt',
                type: _types.FieldMetadataType.DATE_TIME,
                objectMetadataId: mockObjectMetadataId,
                universalIdentifier: 'end-field-universal-id'
            },
            'name-field-universal-id': {
                id: mockNameFieldMetadataId,
                name: 'name',
                type: _types.FieldMetadataType.TEXT,
                objectMetadataId: mockObjectMetadataId,
                universalIdentifier: 'name-field-universal-id'
            },
            'stage-field-universal-id': {
                id: mockStageFieldMetadataId,
                name: 'stage',
                type: _types.FieldMetadataType.SELECT,
                objectMetadataId: mockObjectMetadataId,
                universalIdentifier: 'stage-field-universal-id'
            }
        }
    };
    const mockView = {
        id: mockViewId,
        name: 'All Companies',
        objectMetadataId: mockObjectMetadataId,
        type: _types.ViewType.TABLE,
        icon: 'IconBuilding',
        visibility: _types.ViewVisibility.WORKSPACE,
        position: 0,
        createdByUserWorkspaceId: mockUserWorkspaceId
    };
    const mockFlatObjectMetadataMaps = {
        byUniversalIdentifier: {
            'object-universal-id': {
                id: mockObjectMetadataId,
                nameSingular: mockObjectNameSingular,
                namePlural: 'companies',
                labelSingular: 'Company',
                labelPlural: 'Companies',
                universalIdentifier: 'object-universal-id'
            }
        },
        universalIdentifierById: {
            [mockObjectMetadataId]: 'object-universal-id'
        },
        universalIdentifiersByApplicationId: {}
    };
    const callExecute = async (tool, input)=>{
        return tool.execute(input);
    };
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _viewtoolsfactory.ViewToolsFactory,
                {
                    provide: _viewservice.ViewService,
                    useValue: {
                        findByWorkspaceId: jest.fn(),
                        findByObjectMetadataId: jest.fn(),
                        findById: jest.fn(),
                        findByIdWithRelations: jest.fn(),
                        createOne: jest.fn(),
                        updateOne: jest.fn(),
                        deleteOne: jest.fn()
                    }
                },
                {
                    provide: _completeviewupsertservice.CompleteViewUpsertService,
                    useValue: {
                        upsertCompleteView: jest.fn()
                    }
                },
                {
                    provide: _viewfieldservice.ViewFieldService,
                    useValue: {
                        createMany: jest.fn().mockResolvedValue([]),
                        findByViewId: jest.fn().mockResolvedValue([]),
                        deleteOne: jest.fn()
                    }
                },
                {
                    provide: _viewfilterservice.ViewFilterService,
                    useValue: {
                        createOne: jest.fn(),
                        findByViewId: jest.fn().mockResolvedValue([]),
                        deleteOne: jest.fn()
                    }
                },
                {
                    provide: _viewsortservice.ViewSortService,
                    useValue: {
                        createOne: jest.fn(),
                        findByViewId: jest.fn().mockResolvedValue([]),
                        deleteOne: jest.fn()
                    }
                },
                {
                    provide: _viewqueryparamsservice.ViewQueryParamsService,
                    useValue: {
                        resolveViewToQueryParams: jest.fn()
                    }
                },
                {
                    provide: _workspacemanyorallflatentitymapscacheservice.WorkspaceManyOrAllFlatEntityMapsCacheService,
                    useValue: {
                        getOrRecomputeManyOrAllFlatEntityMaps: jest.fn().mockResolvedValue({
                            flatObjectMetadataMaps: mockFlatObjectMetadataMaps,
                            flatFieldMetadataMaps: mockFlatFieldMetadataMaps
                        })
                    }
                }
            ]
        }).compile();
        viewToolsFactory = module.get(_viewtoolsfactory.ViewToolsFactory);
        viewService = module.get(_viewservice.ViewService);
        completeViewUpsertService = module.get(_completeviewupsertservice.CompleteViewUpsertService);
        viewFieldService = module.get(_viewfieldservice.ViewFieldService);
        viewQueryParamsService = module.get(_viewqueryparamsservice.ViewQueryParamsService);
    });
    it('should be defined', ()=>{
        expect(viewToolsFactory).toBeDefined();
    });
    describe('generateReadTools', ()=>{
        it('should generate get-views and get-view-query-parameters tools', ()=>{
            const tools = viewToolsFactory.generateReadTools(mockWorkspaceId);
            expect(tools).toHaveProperty('get_views');
            expect(tools).toHaveProperty('get_view_query_parameters');
            expect(tools['get_views']).toHaveProperty('description');
            expect(tools['get_views']).toHaveProperty('inputSchema');
            expect(tools['get_views']).toHaveProperty('execute');
            expect(tools['get_view_query_parameters']).toHaveProperty('description');
            expect(tools['get_view_query_parameters']).toHaveProperty('inputSchema');
            expect(tools['get_view_query_parameters']).toHaveProperty('execute');
        });
        describe('get_views tool', ()=>{
            it('should return all views when no objectNameSingular filter', async ()=>{
                const mockViews = [
                    mockView
                ];
                viewService.findByWorkspaceId.mockResolvedValue(mockViews);
                const tools = viewToolsFactory.generateReadTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['get_views'], {
                    limit: 50
                });
                expect(viewService.findByWorkspaceId).toHaveBeenCalledWith(mockWorkspaceId, mockUserWorkspaceId);
                expect(result).toHaveLength(1);
                expect(result[0]).toEqual({
                    id: mockViewId,
                    name: 'All Companies',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.TABLE,
                    icon: 'IconBuilding',
                    visibility: _types.ViewVisibility.WORKSPACE,
                    position: 0
                });
            });
            it('should filter views by objectNameSingular', async ()=>{
                const mockViews = [
                    mockView
                ];
                viewService.findByObjectMetadataId.mockResolvedValue(mockViews);
                const tools = viewToolsFactory.generateReadTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['get_views'], {
                    objectNameSingular: mockObjectNameSingular,
                    limit: 50
                });
                expect(viewService.findByObjectMetadataId).toHaveBeenCalledWith(mockWorkspaceId, mockObjectMetadataId, mockUserWorkspaceId);
                expect(result).toHaveLength(1);
            });
            it('should respect limit parameter', async ()=>{
                const mockViews = [
                    {
                        ...mockView,
                        id: 'view-1'
                    },
                    {
                        ...mockView,
                        id: 'view-2'
                    },
                    {
                        ...mockView,
                        id: 'view-3'
                    }
                ];
                viewService.findByWorkspaceId.mockResolvedValue(mockViews);
                const tools = viewToolsFactory.generateReadTools(mockWorkspaceId);
                const result = await callExecute(tools['get_views'], {
                    limit: 2
                });
                expect(result).toHaveLength(2);
            });
        });
        describe('get-view-query-parameters tool', ()=>{
            it('should return query parameters for a view', async ()=>{
                const mockQueryParams = {
                    objectNameSingular: 'company',
                    filter: {
                        name: {
                            ilike: '%Acme%'
                        }
                    },
                    orderBy: [
                        {
                            name: _types.OrderByDirection.AscNullsFirst
                        }
                    ],
                    viewName: 'All Companies',
                    viewType: _types.ViewType.TABLE
                };
                viewQueryParamsService.resolveViewToQueryParams.mockResolvedValue(mockQueryParams);
                const tools = viewToolsFactory.generateReadTools(mockWorkspaceId, mockUserWorkspaceId, 'workspace-member-id');
                const result = await callExecute(tools['get_view_query_parameters'], {
                    viewId: mockViewId
                });
                expect(viewQueryParamsService.resolveViewToQueryParams).toHaveBeenCalledWith(mockViewId, mockWorkspaceId, 'workspace-member-id');
                expect(result).toEqual(mockQueryParams);
            });
        });
    });
    describe('generateWriteTools', ()=>{
        it('should generate create-view, update-view, and delete-view tools', ()=>{
            const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId);
            expect(tools).toHaveProperty('create_view');
            expect(tools).toHaveProperty('update_view');
            expect(tools).toHaveProperty('delete_view');
        });
        describe('create_view tool', ()=>{
            it('should create a new view', async ()=>{
                const createdView = {
                    id: 'new-view-id',
                    name: 'New View',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.TABLE,
                    icon: 'IconTable',
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.createOne.mockResolvedValue(createdView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['create_view'], {
                    name: 'New View',
                    objectNameSingular: mockObjectNameSingular,
                    icon: 'IconTable'
                });
                expect(viewService.createOne).toHaveBeenCalledWith({
                    createViewInput: {
                        name: 'New View',
                        objectMetadataId: mockObjectMetadataId,
                        icon: 'IconTable',
                        type: _types.ViewType.TABLE,
                        visibility: _types.ViewVisibility.WORKSPACE
                    },
                    workspaceId: mockWorkspaceId,
                    createdByUserWorkspaceId: mockUserWorkspaceId
                });
                expect(result).toEqual({
                    id: 'new-view-id',
                    name: 'New View',
                    objectNameSingular: mockObjectNameSingular,
                    type: _types.ViewType.TABLE,
                    icon: 'IconTable',
                    visibility: _types.ViewVisibility.WORKSPACE
                });
            });
            it('should create view fields when fieldNames is provided', async ()=>{
                const createdView = {
                    id: 'new-view-id',
                    name: 'Kanban View',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.KANBAN,
                    icon: 'IconLayoutKanban',
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.createOne.mockResolvedValue(createdView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await callExecute(tools['create_view'], {
                    name: 'Kanban View',
                    objectNameSingular: mockObjectNameSingular,
                    icon: 'IconLayoutKanban',
                    type: _types.ViewType.KANBAN,
                    mainGroupByFieldName: 'stage',
                    fieldNames: [
                        'name',
                        'stage'
                    ]
                });
                expect(viewFieldService.createMany).toHaveBeenCalledWith({
                    createViewFieldInputs: [
                        {
                            viewId: 'new-view-id',
                            fieldMetadataId: mockNameFieldMetadataId,
                            isVisible: true,
                            size: 150,
                            position: 0
                        },
                        {
                            viewId: 'new-view-id',
                            fieldMetadataId: mockStageFieldMetadataId,
                            isVisible: true,
                            size: 150,
                            position: 1
                        }
                    ],
                    workspaceId: mockWorkspaceId
                });
            });
            it('should throw when KANBAN view missing mainGroupByFieldName', async ()=>{
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['create_view'], {
                    name: 'Kanban View',
                    objectNameSingular: mockObjectNameSingular,
                    type: _types.ViewType.KANBAN
                })).rejects.toThrow('KANBAN views require mainGroupByFieldName');
            });
            it('should throw when CALENDAR view missing calendarFieldName', async ()=>{
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['create_view'], {
                    name: 'Calendar View',
                    objectNameSingular: mockObjectNameSingular,
                    type: _types.ViewType.CALENDAR,
                    calendarLayout: _types.ViewCalendarLayout.WEEK
                })).rejects.toThrow('CALENDAR views require calendarFieldName');
            });
            it('should throw when CALENDAR view missing calendarLayout', async ()=>{
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['create_view'], {
                    name: 'Calendar View',
                    objectNameSingular: mockObjectNameSingular,
                    type: _types.ViewType.CALENDAR,
                    calendarFieldName: 'dueAt'
                })).rejects.toThrow('CALENDAR views require calendarLayout');
            });
            it('should not create view fields when fieldNames is not provided', async ()=>{
                const createdView = {
                    id: 'new-view-id',
                    name: 'New View',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.TABLE,
                    icon: 'IconTable',
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.createOne.mockResolvedValue(createdView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await callExecute(tools['create_view'], {
                    name: 'New View',
                    objectNameSingular: mockObjectNameSingular,
                    icon: 'IconTable'
                });
                expect(viewFieldService.createMany).not.toHaveBeenCalled();
            });
            it('should create a calendar view with layout and field', async ()=>{
                const createdView = {
                    id: 'new-calendar-view-id',
                    name: 'Calendar View',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.CALENDAR,
                    icon: 'IconCalendar',
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.createOne.mockResolvedValue(createdView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['create_view'], {
                    name: 'Calendar View',
                    objectNameSingular: mockObjectNameSingular,
                    icon: 'IconCalendar',
                    type: _types.ViewType.CALENDAR,
                    calendarLayout: _types.ViewCalendarLayout.WEEK,
                    calendarFieldName: 'dueAt'
                });
                expect(viewService.createOne).toHaveBeenCalledWith({
                    createViewInput: {
                        name: 'Calendar View',
                        objectMetadataId: mockObjectMetadataId,
                        icon: 'IconCalendar',
                        type: _types.ViewType.CALENDAR,
                        visibility: _types.ViewVisibility.WORKSPACE,
                        calendarLayout: _types.ViewCalendarLayout.WEEK,
                        calendarFieldMetadataId: mockCalendarFieldMetadataId
                    },
                    workspaceId: mockWorkspaceId,
                    createdByUserWorkspaceId: mockUserWorkspaceId
                });
                expect(result).toEqual({
                    id: 'new-calendar-view-id',
                    name: 'Calendar View',
                    objectNameSingular: mockObjectNameSingular,
                    type: _types.ViewType.CALENDAR,
                    icon: 'IconCalendar',
                    visibility: _types.ViewVisibility.WORKSPACE
                });
            });
        });
        describe('update-view tool', ()=>{
            it('should update a workspace view', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                const updatedView = {
                    ...existingView,
                    name: 'Updated Name'
                };
                viewService.findById.mockResolvedValue(existingView);
                viewService.updateOne.mockResolvedValue(updatedView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['update_view'], {
                    id: mockViewId,
                    name: 'Updated Name'
                });
                expect(viewService.updateOne).toHaveBeenCalled();
                expect(result.name).toBe('Updated Name');
            });
            it('should allow updating own unlisted view', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.UNLISTED,
                    createdByUserWorkspaceId: mockUserWorkspaceId
                };
                const updatedView = {
                    ...existingView,
                    name: 'Updated Name'
                };
                viewService.findById.mockResolvedValue(existingView);
                viewService.updateOne.mockResolvedValue(updatedView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['update_view'], {
                    id: mockViewId,
                    name: 'Updated Name'
                });
                expect(result.name).toBe('Updated Name');
            });
            it('should reject updating another users unlisted view', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.UNLISTED,
                    createdByUserWorkspaceId: 'other-user-workspace-id'
                };
                viewService.findById.mockResolvedValue(existingView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['update_view'], {
                    id: mockViewId,
                    name: 'Updated Name'
                })).rejects.toThrow('You can only update your own unlisted views');
            });
            it('should throw error when view not found', async ()=>{
                viewService.findById.mockResolvedValue(null);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId);
                await expect(callExecute(tools['update_view'], {
                    id: 'non-existent-id',
                    name: 'Updated Name'
                })).rejects.toThrow('View with id non-existent-id not found');
            });
        });
        describe('upsert_complete_view tool', ()=>{
            it('should be generated alongside the other write tools', ()=>{
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId);
                expect(tools).toHaveProperty('upsert_complete_view');
                expect(tools['upsert_complete_view']).toHaveProperty('description');
                expect(tools['upsert_complete_view']).toHaveProperty('inputSchema');
                expect(tools['upsert_complete_view']).toHaveProperty('execute');
            });
            it('should create a view with fields, filters, and sorts referenced by name in a single upsert call', async ()=>{
                completeViewUpsertService.upsertCompleteView.mockResolvedValue({
                    id: 'new-view-id',
                    name: 'Pipeline',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.TABLE,
                    icon: 'IconTable',
                    visibility: _types.ViewVisibility.WORKSPACE,
                    viewFields: [
                        {},
                        {}
                    ],
                    viewFilters: [
                        {}
                    ],
                    viewSorts: [
                        {}
                    ]
                });
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['upsert_complete_view'], {
                    objectNameSingular: mockObjectNameSingular,
                    name: 'Pipeline',
                    type: _types.ViewType.TABLE,
                    fields: [
                        {
                            fieldName: 'name'
                        },
                        {
                            fieldName: 'stage'
                        }
                    ],
                    filters: [
                        {
                            fieldName: 'stage',
                            operand: 'IS_NOT',
                            value: [
                                'WON'
                            ]
                        }
                    ],
                    sorts: [
                        {
                            fieldName: 'name',
                            direction: 'DESC'
                        }
                    ]
                });
                expect(viewService.createOne).not.toHaveBeenCalled();
                expect(completeViewUpsertService.upsertCompleteView).toHaveBeenCalledWith(expect.objectContaining({
                    workspaceId: mockWorkspaceId,
                    userWorkspaceId: mockUserWorkspaceId,
                    existingViewId: undefined,
                    objectMetadataId: mockObjectMetadataId,
                    name: 'Pipeline',
                    type: _types.ViewType.TABLE,
                    fields: [
                        {
                            fieldMetadataId: mockNameFieldMetadataId,
                            isVisible: true,
                            size: 150
                        },
                        {
                            fieldMetadataId: mockStageFieldMetadataId,
                            isVisible: true,
                            size: 150
                        }
                    ],
                    filters: [
                        {
                            fieldMetadataId: mockStageFieldMetadataId,
                            operand: 'IS_NOT',
                            value: [
                                'WON'
                            ],
                            subFieldName: undefined
                        }
                    ],
                    sorts: [
                        {
                            fieldMetadataId: mockNameFieldMetadataId,
                            direction: 'DESC'
                        }
                    ]
                }));
                expect(result).toEqual({
                    id: 'new-view-id',
                    name: 'Pipeline',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.TABLE,
                    icon: 'IconTable',
                    visibility: _types.ViewVisibility.WORKSPACE,
                    fieldCount: 2,
                    filterCount: 1,
                    sortCount: 1
                });
            });
            it('should accept a field referenced by fieldMetadataId without name resolution', async ()=>{
                completeViewUpsertService.upsertCompleteView.mockResolvedValue({
                    id: 'new-view-id',
                    name: 'By Id',
                    objectMetadataId: mockObjectMetadataId,
                    type: _types.ViewType.TABLE,
                    icon: 'IconTable',
                    visibility: _types.ViewVisibility.WORKSPACE,
                    viewFields: [
                        {}
                    ]
                });
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await callExecute(tools['upsert_complete_view'], {
                    objectNameSingular: mockObjectNameSingular,
                    name: 'By Id',
                    fields: [
                        {
                            fieldMetadataId: mockStageFieldMetadataId
                        }
                    ]
                });
                expect(completeViewUpsertService.upsertCompleteView).toHaveBeenCalledWith(expect.objectContaining({
                    fields: [
                        {
                            fieldMetadataId: mockStageFieldMetadataId,
                            isVisible: true,
                            size: 150
                        }
                    ]
                }));
            });
            it('should require objectNameSingular when creating', async ()=>{
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['upsert_complete_view'], {
                    name: 'Missing object',
                    fields: [
                        {
                            fieldName: 'name'
                        }
                    ]
                })).rejects.toThrow('objectNameSingular is required');
            });
            it('should delegate filter replacement to upsertCompleteView when updating', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.findById.mockResolvedValue(existingView);
                completeViewUpsertService.upsertCompleteView.mockResolvedValue({
                    ...existingView,
                    viewFilters: [
                        {}
                    ]
                });
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await callExecute(tools['upsert_complete_view'], {
                    id: mockViewId,
                    filters: [
                        {
                            fieldName: 'stage',
                            operand: 'IS',
                            value: [
                                'WON'
                            ]
                        }
                    ]
                });
                expect(completeViewUpsertService.upsertCompleteView).toHaveBeenCalledWith(expect.objectContaining({
                    existingViewId: mockViewId,
                    objectMetadataId: mockObjectMetadataId,
                    filters: [
                        {
                            fieldMetadataId: mockStageFieldMetadataId,
                            operand: 'IS',
                            value: [
                                'WON'
                            ],
                            subFieldName: undefined
                        }
                    ]
                }));
                expect(viewService.createOne).not.toHaveBeenCalled();
            });
            it('should resolve and update the calendar end field on an existing view', async ()=>{
                const existingView = {
                    ...mockView,
                    type: _types.ViewType.CALENDAR,
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.findById.mockResolvedValue(existingView);
                completeViewUpsertService.upsertCompleteView.mockResolvedValue({
                    ...existingView,
                    calendarEndFieldMetadataId: mockCalendarEndFieldMetadataId
                });
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await callExecute(tools['upsert_complete_view'], {
                    id: mockViewId,
                    calendarEndFieldName: 'endsAt'
                });
                expect(completeViewUpsertService.upsertCompleteView).toHaveBeenCalledWith(expect.objectContaining({
                    existingViewId: mockViewId,
                    objectMetadataId: mockObjectMetadataId,
                    calendarEndFieldMetadataId: mockCalendarEndFieldMetadataId
                }));
            });
            it('should pass an empty sorts array through to upsertCompleteView on update', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                viewService.findById.mockResolvedValue(existingView);
                completeViewUpsertService.upsertCompleteView.mockResolvedValue({
                    ...existingView,
                    viewSorts: []
                });
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await callExecute(tools['upsert_complete_view'], {
                    id: mockViewId,
                    sorts: []
                });
                expect(completeViewUpsertService.upsertCompleteView).toHaveBeenCalledWith(expect.objectContaining({
                    existingViewId: mockViewId,
                    sorts: []
                }));
            });
            it('should reject updating another users unlisted view', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.UNLISTED,
                    createdByUserWorkspaceId: 'other-user-workspace-id'
                };
                viewService.findById.mockResolvedValue(existingView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['upsert_complete_view'], {
                    id: mockViewId,
                    name: 'Updated'
                })).rejects.toThrow('You can only update your own unlisted views');
            });
        });
        describe('delete-view tool', ()=>{
            it('should delete a workspace view', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.WORKSPACE
                };
                const deletedView = {
                    id: mockViewId,
                    name: 'All Companies'
                };
                viewService.findById.mockResolvedValue(existingView);
                viewService.deleteOne.mockResolvedValue(deletedView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                const result = await callExecute(tools['delete_view'], {
                    id: mockViewId
                });
                expect(viewService.deleteOne).toHaveBeenCalledWith({
                    deleteViewInput: {
                        id: mockViewId
                    },
                    workspaceId: mockWorkspaceId
                });
                expect(result).toEqual({
                    id: mockViewId,
                    name: 'All Companies',
                    deleted: true
                });
            });
            it('should reject deleting another users unlisted view', async ()=>{
                const existingView = {
                    ...mockView,
                    visibility: _types.ViewVisibility.UNLISTED,
                    createdByUserWorkspaceId: 'other-user-workspace-id'
                };
                viewService.findById.mockResolvedValue(existingView);
                const tools = viewToolsFactory.generateWriteTools(mockWorkspaceId, mockUserWorkspaceId);
                await expect(callExecute(tools['delete_view'], {
                    id: mockViewId
                })).rejects.toThrow('You can only delete your own unlisted views');
            });
        });
    });
});

//# sourceMappingURL=view-tools.factory.spec.js.map