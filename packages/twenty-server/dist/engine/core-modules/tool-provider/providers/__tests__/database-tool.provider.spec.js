"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _databasetoolprovider = require("../database-tool.provider");
const _createemptyflatentitymapsconstant = require("../../../../metadata-modules/flat-entity/constant/create-empty-flat-entity-maps.constant");
const _getflatobjectmetadatamock = require("../../../../metadata-modules/flat-object-metadata/__mocks__/get-flat-object-metadata.mock");
const roleId = 'role-id';
const workspaceId = 'workspace-id';
const allObjectPermissions = {
    canReadObjectRecords: true,
    canUpdateObjectRecords: true,
    canSoftDeleteObjectRecords: true,
    canDestroyObjectRecords: true,
    restrictedFields: {},
    rowLevelPermissionPredicates: [],
    rowLevelPermissionPredicateGroups: []
};
const createFlatObject = (overrides)=>(0, _getflatobjectmetadatamock.getFlatObjectMetadataMock)({
        universalIdentifier: overrides.nameSingular,
        labelSingular: overrides.nameSingular,
        labelPlural: overrides.namePlural,
        ...overrides
    });
describe('DatabaseToolProvider', ()=>{
    const generateDescriptors = async (objects, options)=>{
        const flatObjectMetadataMaps = (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)();
        for (const object of objects){
            flatObjectMetadataMaps.byUniversalIdentifier[object.universalIdentifier] = object;
            flatObjectMetadataMaps.universalIdentifierById[object.id] = object.universalIdentifier;
        }
        const explicitPermissionRows = options?.explicitPermissionRows ?? objects.map((object)=>({
                objectMetadataId: object.id,
                canReadObjectRecords: true,
                canUpdateObjectRecords: true,
                canSoftDeleteObjectRecords: true
            }));
        const workspaceCacheService = {
            getOrRecompute: jest.fn().mockResolvedValue({
                rolesPermissions: {
                    [roleId]: Object.fromEntries(objects.map((object)=>[
                            object.id,
                            allObjectPermissions
                        ]))
                },
                flatObjectPermissionMaps: {
                    byUniversalIdentifier: Object.fromEntries(explicitPermissionRows.map((row, index)=>[
                            `object-permission-${index}`,
                            {
                                roleId,
                                ...row
                            }
                        ]))
                }
            })
        };
        const flatEntityMapsCacheService = {
            getOrRecomputeManyOrAllFlatEntityMaps: jest.fn().mockResolvedValue({
                flatObjectMetadataMaps,
                flatFieldMetadataMaps: (0, _createemptyflatentitymapsconstant.createEmptyFlatEntityMaps)()
            })
        };
        // Returns the messageId so the label util falls back to the English source,
        // mirroring the runtime behavior when no translation exists for the locale.
        // getI18nInstance resolves verb descriptors to their English source message.
        const i18nService = {
            translateMessage: jest.fn(({ messageId })=>messageId),
            getI18nInstance: jest.fn(()=>({
                    _: (descriptor)=>typeof descriptor === 'string' ? descriptor : descriptor.message ?? descriptor.id
                }))
        };
        const provider = new _databasetoolprovider.DatabaseToolProvider(workspaceCacheService, flatEntityMapsCacheService, i18nService);
        return await provider.generateDescriptors({
            workspaceId,
            roleId,
            rolePermissionConfig: {
                unionOf: [
                    roleId
                ]
            },
            requireExplicitObjectGrants: options?.requireExplicitObjectGrants
        }, {
            includeSchemas: false
        });
    };
    const generateDescriptorNames = async (objects, options)=>{
        const descriptors = await generateDescriptors(objects, options);
        return descriptors.map((descriptor)=>descriptor.name);
    };
    it('advertises write tools for join/system objects allowed by automation', async ()=>{
        const descriptorNames = await generateDescriptorNames([
            createFlatObject({
                nameSingular: 'noteTarget',
                namePlural: 'noteTargets',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'taskTarget',
                namePlural: 'taskTargets',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'attachment',
                namePlural: 'attachments',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'timelineActivity',
                namePlural: 'timelineActivities',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'person',
                namePlural: 'people'
            })
        ]);
        expect(descriptorNames).toEqual(expect.arrayContaining([
            'create_one_note_target',
            'create_many_note_targets',
            'update_one_note_target',
            'update_many_note_targets',
            'delete_one_note_target',
            'create_one_task_target',
            'create_one_attachment',
            'create_one_timeline_activity',
            'create_one_person'
        ]));
    });
    it('does not advertise write tools for objects blocked from automation', async ()=>{
        const descriptorNames = await generateDescriptorNames([
            createFlatObject({
                nameSingular: 'workspaceMember',
                namePlural: 'workspaceMembers',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'message',
                namePlural: 'messages',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'calendarEvent',
                namePlural: 'calendarEvents',
                isSystem: true
            }),
            createFlatObject({
                nameSingular: 'dashboard',
                namePlural: 'dashboards'
            })
        ]);
        expect(descriptorNames).toEqual(expect.arrayContaining([
            'find_many_workspace_members',
            'find_many_messages',
            'find_many_calendar_events',
            'find_many_dashboards'
        ]));
        expect(descriptorNames).toEqual(expect.not.arrayContaining([
            'create_one_workspace_member',
            'update_one_workspace_member',
            'delete_one_workspace_member',
            'create_one_message',
            'update_one_message',
            'delete_one_message',
            'create_one_calendar_event',
            'update_one_calendar_event',
            'delete_one_calendar_event',
            'create_one_dashboard',
            'update_one_dashboard',
            'delete_one_dashboard'
        ]));
    });
    it('generates labels from operation verb and object metadata labels', async ()=>{
        const descriptors = await generateDescriptors([
            createFlatObject({
                nameSingular: 'company',
                namePlural: 'companies',
                labelSingular: 'Company',
                labelPlural: 'Companies'
            })
        ]);
        const labelByName = new Map(descriptors.map((d)=>[
                d.name,
                d.label
            ]));
        expect(labelByName.get('find_many_companies')).toBe('Search companies');
        expect(labelByName.get('find_one_company')).toBe('Find company');
        expect(labelByName.get('group_by_companies')).toBe('Group companies');
        expect(labelByName.get('create_one_company')).toBe('Create company');
        expect(labelByName.get('create_many_companies')).toBe('Create companies');
        expect(labelByName.get('update_one_company')).toBe('Update company');
        expect(labelByName.get('update_many_companies')).toBe('Update companies');
        expect(labelByName.get('upsert_many_companies')).toBe('Upsert companies');
        expect(labelByName.get('delete_one_company')).toBe('Delete company');
        expect(labelByName.get('delete_many_companies')).toBe('Delete companies');
    });
    it('uses the object labelSingular/labelPlural from metadata, not the programmatic name', async ()=>{
        const descriptors = await generateDescriptors([
            createFlatObject({
                nameSingular: 'person',
                namePlural: 'people',
                labelSingular: 'Contact',
                labelPlural: 'Contacts'
            })
        ]);
        const labelByName = new Map(descriptors.map((d)=>[
                d.name,
                d.label
            ]));
        expect(labelByName.get('find_many_people')).toBe('Search contacts');
        expect(labelByName.get('find_one_person')).toBe('Find contact');
        expect(labelByName.get('create_one_person')).toBe('Create contact');
        expect(labelByName.get('delete_one_person')).toBe('Delete contact');
    });
    it('includes label on every generated descriptor', async ()=>{
        const descriptors = await generateDescriptors([
            createFlatObject({
                nameSingular: 'task',
                namePlural: 'tasks',
                labelSingular: 'Task',
                labelPlural: 'Tasks'
            })
        ]);
        for (const descriptor of descriptors){
            expect(descriptor.label).toBeDefined();
            expect(descriptor.label.length).toBeGreaterThan(0);
        }
    });
    describe('requireExplicitObjectGrants', ()=>{
        const personObject = createFlatObject({
            nameSingular: 'person',
            namePlural: 'people'
        });
        const companyObject = createFlatObject({
            nameSingular: 'company',
            namePlural: 'companies'
        });
        it('emits no tools for objects without an explicit permission row', async ()=>{
            const descriptorNames = await generateDescriptorNames([
                personObject,
                companyObject
            ], {
                requireExplicitObjectGrants: true,
                explicitPermissionRows: [
                    {
                        objectMetadataId: personObject.id,
                        canReadObjectRecords: true
                    }
                ]
            });
            expect(descriptorNames).toContain('find_many_people');
            expect(descriptorNames).not.toContain('find_many_companies');
        });
        it('emits only the verbs granted by the explicit row', async ()=>{
            const descriptorNames = await generateDescriptorNames([
                personObject
            ], {
                requireExplicitObjectGrants: true,
                explicitPermissionRows: [
                    {
                        objectMetadataId: personObject.id,
                        canReadObjectRecords: true,
                        canUpdateObjectRecords: false,
                        canSoftDeleteObjectRecords: false
                    }
                ]
            });
            expect(descriptorNames).toContain('find_many_people');
            expect(descriptorNames).not.toContain('create_one_person');
            expect(descriptorNames).not.toContain('delete_one_person');
        });
        it('keeps composed permissions when the flag is not set even without explicit rows', async ()=>{
            const descriptorNames = await generateDescriptorNames([
                personObject
            ], {
                explicitPermissionRows: []
            });
            expect(descriptorNames).toContain('find_many_people');
            expect(descriptorNames).toContain('create_one_person');
        });
    });
});

//# sourceMappingURL=database-tool.provider.spec.js.map