"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _218workspacecommand1799200000000normalizelegacyindexnamescommand = require("../2-18-workspace-command-1799200000000-normalize-legacy-index-names.command");
const _doesphysicalindexexistutil = require("../utils/does-physical-index-exist.util");
const _getphysicalindexdefinitionutil = require("../utils/get-physical-index-definition.util");
const _generateflatindexutil = require("../../../../../engine/metadata-modules/index-metadata/utils/generate-flat-index.util");
const _indexactionhandlerutils = require("../../../../../engine/workspace-manager/workspace-migration/workspace-migration-runner/action-handlers/index/utils/index-action-handler.utils");
jest.mock('src/engine/metadata-modules/index-metadata/utils/generate-flat-index.util');
jest.mock('src/engine/workspace-manager/workspace-migration/workspace-migration-runner/action-handlers/index/utils/index-action-handler.utils');
jest.mock('src/database/commands/upgrade-version-command/2-18/utils/does-physical-index-exist.util');
jest.mock('src/database/commands/upgrade-version-command/2-18/utils/get-physical-index-definition.util');
const generateFlatIndexMetadataWithNameOrThrowMock = _generateflatindexutil.generateFlatIndexMetadataWithNameOrThrow;
const deleteIndexMetadataMock = _indexactionhandlerutils.deleteIndexMetadata;
const dropIndexFromWorkspaceSchemaMock = _indexactionhandlerutils.dropIndexFromWorkspaceSchema;
const doesPhysicalIndexExistMock = _doesphysicalindexexistutil.doesPhysicalIndexExist;
const getPhysicalIndexDefinitionMock = _getphysicalindexdefinitionutil.getPhysicalIndexDefinition;
const WORKSPACE_ID = '20202020-0000-0000-0000-000000000001';
const buildFlatEntityMaps = (indexes)=>{
    const flatIndexMaps = {
        byUniversalIdentifier: Object.fromEntries(indexes.map((index)=>[
                index.universalIdentifier,
                {
                    universalIdentifier: index.universalIdentifier,
                    id: index.id,
                    name: index.name,
                    objectMetadataId: 'object-1'
                }
            ]))
    };
    const flatObjectMetadataMaps = {
        byUniversalIdentifier: {
            'object-uid': {
                universalIdentifier: 'object-uid',
                nameSingular: 'myObject',
                indexMetadataUniversalIdentifiers: indexes.map((index)=>index.universalIdentifier),
                fieldUniversalIdentifiers: []
            }
        }
    };
    const flatFieldMetadataMaps = {
        byUniversalIdentifier: {}
    };
    // Drive expected names per index via the mocked generator.
    generateFlatIndexMetadataWithNameOrThrowMock.mockImplementation(({ flatIndex })=>{
        const match = indexes.find((index)=>index.id === flatIndex.id);
        return {
            name: match?.expectedName ?? flatIndex.id
        };
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
        flatIndexMaps,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps
    };
};
const buildQueryRunner = ()=>{
    const query = jest.fn();
    const commit = jest.fn();
    const rollback = jest.fn();
    const queryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: commit,
        rollbackTransaction: rollback,
        release: jest.fn(),
        query
    };
    return {
        queryRunner,
        query,
        commit,
        rollback
    };
};
describe('NormalizeLegacyIndexNamesCommand', ()=>{
    let command;
    let renameIndexMock;
    let dropIndexMock;
    let getOrRecomputeMock;
    let invalidateAndRecomputeMock;
    const setPhysicalIndexes = (physicalIndexNames)=>{
        doesPhysicalIndexExistMock.mockImplementation(({ indexName })=>Promise.resolve(physicalIndexNames.includes(indexName)));
    };
    const setPhysicalIndexDefinitions = (definitionsByName)=>{
        getPhysicalIndexDefinitionMock.mockImplementation(({ indexName })=>Promise.resolve(definitionsByName[indexName] ?? null));
    };
    beforeEach(()=>{
        jest.clearAllMocks();
        renameIndexMock = jest.fn();
        dropIndexMock = jest.fn();
        getOrRecomputeMock = jest.fn();
        invalidateAndRecomputeMock = jest.fn();
        const workspaceIteratorService = {};
        const workspaceCacheService = {
            getOrRecompute: getOrRecomputeMock,
            invalidateAndRecompute: invalidateAndRecomputeMock
        };
        const workspaceSchemaManagerService = {
            indexManager: {
                renameIndexWithoutRebuild: renameIndexMock,
                dropIndex: dropIndexMock
            }
        };
        command = new _218workspacecommand1799200000000normalizelegacyindexnamescommand.NormalizeLegacyIndexNamesCommand(workspaceIteratorService, workspaceCacheService, workspaceSchemaManagerService);
    });
    const runOnWorkspace = (dataSource, dryRun = false)=>command.runOnWorkspace({
            workspaceId: WORKSPACE_ID,
            dataSource: dataSource,
            options: {
                dryRun
            },
            index: 0,
            total: 1
        });
    it('renames a legacy-named index and updates its metadata row, then invalidates the cache', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        setPhysicalIndexes([
            'legacyhash'
        ]);
        const { queryRunner, query, commit } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(renameIndexMock).toHaveBeenCalledWith(expect.objectContaining({
            fromIndexName: 'legacyhash',
            toIndexName: 'IDX_UNIQUE_new'
        }));
        expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_new',
            'index-1',
            WORKSPACE_ID
        ]);
        expect(dropIndexFromWorkspaceSchemaMock).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
    });
    it('drops the redundant duplicate and renames the survivor when two indexes collide', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-a',
                id: 'index-a',
                name: 'legacyA',
                expectedName: 'IDX_UNIQUE_shared'
            },
            {
                universalIdentifier: 'idx-b',
                id: 'index-b',
                name: 'legacyB',
                expectedName: 'IDX_UNIQUE_shared'
            }
        ]));
        setPhysicalIndexes([
            'legacyA',
            'legacyB'
        ]);
        const { queryRunner } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(renameIndexMock).toHaveBeenCalledTimes(1);
        expect(renameIndexMock).toHaveBeenCalledWith(expect.objectContaining({
            fromIndexName: 'legacyA',
            toIndexName: 'IDX_UNIQUE_shared'
        }));
        expect(dropIndexFromWorkspaceSchemaMock).toHaveBeenCalledTimes(1);
        expect(dropIndexFromWorkspaceSchemaMock).toHaveBeenCalledWith(expect.objectContaining({
            indexName: 'legacyB'
        }));
        expect(deleteIndexMetadataMock).toHaveBeenCalledWith(expect.objectContaining({
            entityId: 'index-b',
            workspaceId: WORKSPACE_ID
        }));
    });
    it('does nothing when all index names already match', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'IDX_ok',
                expectedName: 'IDX_ok'
            }
        ]));
        const createQueryRunner = jest.fn();
        const dataSource = {
            createQueryRunner
        };
        await runOnWorkspace(dataSource);
        expect(createQueryRunner).not.toHaveBeenCalled();
        expect(renameIndexMock).not.toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).not.toHaveBeenCalled();
    });
    it('does not write anything in dry-run mode', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        const createQueryRunner = jest.fn();
        const dataSource = {
            createQueryRunner
        };
        await runOnWorkspace(dataSource, true);
        expect(createQueryRunner).not.toHaveBeenCalled();
        expect(renameIndexMock).not.toHaveBeenCalled();
        expect(dropIndexFromWorkspaceSchemaMock).not.toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).not.toHaveBeenCalled();
    });
    it('reconciles metadata without renaming when the physical index already carries the expected name', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        // Metadata drift: the physical index was already renamed to the v2 name.
        setPhysicalIndexes([
            'IDX_UNIQUE_new'
        ]);
        const { queryRunner, query, commit } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(renameIndexMock).not.toHaveBeenCalled();
        expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_new',
            'index-1',
            WORKSPACE_ID
        ]);
        expect(commit).toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
    });
    it('skips the physical rename but still reconciles metadata when neither source nor target index exists', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        setPhysicalIndexes([]);
        const { queryRunner, query, commit } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(renameIndexMock).not.toHaveBeenCalled();
        expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_new',
            'index-1',
            WORKSPACE_ID
        ]);
        expect(commit).toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
    });
    it('drops the duplicate legacy index when both source and target exist with the same definition', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        setPhysicalIndexes([
            'legacyhash',
            'IDX_UNIQUE_new'
        ]);
        setPhysicalIndexDefinitions({
            legacyhash: 'CREATE UNIQUE INDEX legacyhash ON workspace_test."myObject" USING btree (name)',
            IDX_UNIQUE_new: 'CREATE UNIQUE INDEX "IDX_UNIQUE_new" ON workspace_test."myObject" USING btree (name)'
        });
        const { queryRunner, query, commit } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(renameIndexMock).not.toHaveBeenCalled();
        expect(dropIndexMock).toHaveBeenCalledWith(expect.objectContaining({
            indexName: 'legacyhash'
        }));
        expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_new',
            'index-1',
            WORKSPACE_ID
        ]);
        expect(commit).toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
    });
    it('leaves the orphan source index in place when both exist but with different definitions', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        setPhysicalIndexes([
            'legacyhash',
            'IDX_UNIQUE_new'
        ]);
        setPhysicalIndexDefinitions({
            legacyhash: 'CREATE INDEX legacyhash ON workspace_test."myObject" USING btree ("createdAt")',
            IDX_UNIQUE_new: 'CREATE UNIQUE INDEX "IDX_UNIQUE_new" ON workspace_test."myObject" USING btree (name)'
        });
        const { queryRunner, query, commit } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(renameIndexMock).not.toHaveBeenCalled();
        expect(dropIndexMock).not.toHaveBeenCalled();
        expect(dropIndexFromWorkspaceSchemaMock).not.toHaveBeenCalled();
        expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_new',
            'index-1',
            WORKSPACE_ID
        ]);
        expect(commit).toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
    });
    it('rolls back to the savepoint and continues with remaining operations when one fails', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-a',
                id: 'index-a',
                name: 'legacyA',
                expectedName: 'IDX_UNIQUE_newA'
            },
            {
                universalIdentifier: 'idx-b',
                id: 'index-b',
                name: 'legacyB',
                expectedName: 'IDX_UNIQUE_newB'
            }
        ]));
        setPhysicalIndexes([
            'legacyA',
            'legacyB'
        ]);
        renameIndexMock.mockRejectedValueOnce(new Error('boom'));
        const { queryRunner, query, commit, rollback } = buildQueryRunner();
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await runOnWorkspace(dataSource);
        expect(query).toHaveBeenCalledWith(expect.stringContaining('ROLLBACK TO SAVEPOINT'));
        // The failed operation's metadata update is rolled back with its savepoint.
        expect(query).not.toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_newA',
            'index-a',
            WORKSPACE_ID
        ]);
        expect(renameIndexMock).toHaveBeenCalledTimes(2);
        expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), [
            'IDX_UNIQUE_newB',
            'index-b',
            WORKSPACE_ID
        ]);
        expect(rollback).not.toHaveBeenCalled();
        expect(commit).toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).toHaveBeenCalledWith(WORKSPACE_ID, [
            'flatIndexMaps',
            'flatObjectMetadataMaps'
        ]);
    });
    it('rolls back the whole transaction when savepoint recovery itself fails', async ()=>{
        getOrRecomputeMock.mockResolvedValue(buildFlatEntityMaps([
            {
                universalIdentifier: 'idx-uid',
                id: 'index-1',
                name: 'legacyhash',
                expectedName: 'IDX_UNIQUE_new'
            }
        ]));
        setPhysicalIndexes([
            'legacyhash'
        ]);
        renameIndexMock.mockRejectedValueOnce(new Error('boom'));
        const { queryRunner, query, commit, rollback } = buildQueryRunner();
        query.mockImplementation((sql)=>sql.startsWith('ROLLBACK TO SAVEPOINT') ? Promise.reject(new Error('savepoint recovery failed')) : Promise.resolve());
        const dataSource = {
            createQueryRunner: ()=>queryRunner
        };
        await expect(runOnWorkspace(dataSource)).rejects.toThrow('savepoint recovery failed');
        expect(rollback).toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
        expect(invalidateAndRecomputeMock).not.toHaveBeenCalled();
    });
});

//# sourceMappingURL=2-18-workspace-command-1799200000000-normalize-legacy-index-names.command.spec.js.map