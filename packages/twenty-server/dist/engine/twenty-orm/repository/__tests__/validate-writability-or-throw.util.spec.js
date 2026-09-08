"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _validatewritabilityorthrowutil = require("../validate-writability-or-throw.util");
const OWNING_APPLICATION_ID = 'app-1';
const buildObjectMetadata = (writability)=>({
        nameSingular: 'slackUserLink',
        applicationId: OWNING_APPLICATION_ID,
        writability
    });
const buildFieldMetadataMaps = (writability)=>({
        universalIdentifierById: {
            'field-1': 'field-universal-1'
        },
        universalIdentifiersByApplicationId: {},
        byUniversalIdentifier: {
            'field-universal-1': {
                id: 'field-1',
                name: 'status',
                applicationId: OWNING_APPLICATION_ID,
                writability
            }
        }
    });
const applicationContext = {
    type: 'application',
    workspace: {
        id: 'workspace-1'
    },
    application: {
        id: OWNING_APPLICATION_ID
    }
};
const otherApplicationContext = {
    type: 'application',
    workspace: {
        id: 'workspace-1'
    },
    application: {
        id: 'app-2'
    }
};
const apiKeyContext = {
    type: 'apiKey',
    workspace: {
        id: 'workspace-1'
    },
    apiKey: {
        id: 'api-key-1'
    }
};
const userContextCarryingApplication = {
    type: 'user',
    workspace: {
        id: 'workspace-1'
    },
    userWorkspaceId: 'user-workspace-1',
    user: {
        id: 'user-1'
    },
    workspaceMemberId: 'workspace-member-1',
    workspaceMember: {
        id: 'workspace-member-1'
    },
    application: {
        id: OWNING_APPLICATION_ID
    }
};
const plainUserContext = {
    type: 'user',
    workspace: {
        id: 'workspace-1'
    },
    userWorkspaceId: 'user-workspace-1',
    user: {
        id: 'user-1'
    },
    workspaceMemberId: 'workspace-member-1',
    workspaceMember: {
        id: 'workspace-member-1'
    }
};
const otherApplicationUserContext = {
    type: 'user',
    workspace: {
        id: 'workspace-1'
    },
    userWorkspaceId: 'user-workspace-1',
    user: {
        id: 'user-1'
    },
    workspaceMemberId: 'workspace-member-1',
    workspaceMember: {
        id: 'workspace-member-1'
    },
    application: {
        id: 'app-2'
    }
};
const validate = ({ objectWritability = _types.MetadataWritability.OPEN, fieldWritability = _types.MetadataWritability.OPEN, operationType = 'update', updatedColumns = [
    'status'
], authContext })=>(0, _validatewritabilityorthrowutil.validateWritabilityOrThrow)({
        operationType,
        objectMetadata: buildObjectMetadata(objectWritability),
        updatedColumns,
        columnNameToFieldMetadataIdMap: {
            status: 'field-1'
        },
        flatFieldMetadataMaps: buildFieldMetadataMaps(fieldWritability),
        authContext
    });
describe('validateWritabilityOrThrow', ()=>{
    it('should allow writes on OPEN metadata regardless of context', ()=>{
        expect(()=>validate({
                authContext: undefined
            })).not.toThrow();
    });
    it('should never restrict selects', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.SYSTEM,
                operationType: 'select',
                authContext: undefined
            })).not.toThrow();
    });
    it('should let the owning application write an APPLICATION object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: applicationContext
            })).not.toThrow();
    });
    it('should refuse another application on an APPLICATION object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: otherApplicationContext
            })).toThrow(/not writable/);
    });
    it('should let the owning application write while serving a person', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: userContextCarryingApplication
            })).not.toThrow();
    });
    it('should refuse a plain session on an APPLICATION object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: plainUserContext
            })).toThrow();
    });
    it('should refuse another application serving a person on an APPLICATION object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: otherApplicationUserContext
            })).toThrow(/not writable/);
    });
    it('should refuse an api key context on an APPLICATION object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: apiKeyContext
            })).toThrow(/not writable/);
    });
    it('should refuse a missing context on an APPLICATION object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.APPLICATION,
                authContext: undefined
            })).toThrow(/not writable/);
    });
    it('should refuse every caller on a SYSTEM object', ()=>{
        expect(()=>validate({
                objectWritability: _types.MetadataWritability.SYSTEM,
                authContext: applicationContext
            })).toThrow(/not writable/);
    });
    it('should enforce field writability even when the object is OPEN', ()=>{
        expect(()=>validate({
                fieldWritability: _types.MetadataWritability.APPLICATION,
                authContext: plainUserContext
            })).toThrow(/field "status".*not writable/);
    });
    it('should let the owning application write an APPLICATION field', ()=>{
        expect(()=>validate({
                fieldWritability: _types.MetadataWritability.APPLICATION,
                authContext: applicationContext
            })).not.toThrow();
    });
    it('should refuse every caller on a SYSTEM field', ()=>{
        expect(()=>validate({
                fieldWritability: _types.MetadataWritability.SYSTEM,
                authContext: applicationContext
            })).toThrow(/field "status".*not writable/);
    });
    it('should ignore field writability for columns that are not written', ()=>{
        expect(()=>validate({
                fieldWritability: _types.MetadataWritability.SYSTEM,
                updatedColumns: [],
                authContext: undefined
            })).not.toThrow();
    });
});

//# sourceMappingURL=validate-writability-or-throw.util.spec.js.map