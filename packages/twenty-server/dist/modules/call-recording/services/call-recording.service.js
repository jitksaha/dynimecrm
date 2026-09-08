"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CallRecordingService", {
    enumerable: true,
    get: function() {
        return CallRecordingService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _ormworkspacecontextstorage = require("../../../engine/twenty-orm/storage/orm-workspace-context.storage");
const _workspaceormmanager = require("../../../engine/twenty-orm/workspace-orm.manager");
const _resolveobjectrecordspermissionsutil = require("../../../engine/twenty-orm/utils/resolve-object-records-permissions.util");
const _resolverolepermissionconfigutil = require("../../../engine/twenty-orm/utils/resolve-role-permission-config.util");
const _permissionsexception = require("../../../engine/metadata-modules/permissions/permissions.exception");
const _callrecordingstatusenum = require("../common/enums/call-recording-status.enum");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const NON_TERMINAL_CALL_RECORDING_STATUSES = [
    _callrecordingstatusenum.CallRecordingStatus.SCHEDULED,
    _callrecordingstatusenum.CallRecordingStatus.JOINING,
    _callrecordingstatusenum.CallRecordingStatus.RECORDING,
    _callrecordingstatusenum.CallRecordingStatus.PROCESSING
];
let CallRecordingService = class CallRecordingService {
    async findCallRecordingIdForCalendarEvent(calendarEventId) {
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const workspaceContext = (0, _ormworkspacecontextstorage.getWorkspaceContext)();
            const rolePermissionConfig = (0, _resolverolepermissionconfigutil.resolveRolePermissionConfig)({
                authContext: workspaceContext.authContext,
                userWorkspaceRoleMap: workspaceContext.userWorkspaceRoleMap,
                apiKeyRoleMap: workspaceContext.apiKeyRoleMap
            });
            if (!(0, _utils.isDefined)(rolePermissionConfig)) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            const { objectRecordsPermissions, shouldBypassPermissionChecks } = (0, _resolveobjectrecordspermissionsutil.resolveObjectRecordsPermissions)({
                rolePermissionConfig,
                objectPermissionsByRoleId: workspaceContext.permissionsPerRoleId
            });
            const callRecordingObjectMetadataId = workspaceContext.objectIdByNameSingular.callRecording;
            if (!shouldBypassPermissionChecks && (!(0, _utils.isDefined)(callRecordingObjectMetadataId) || !objectRecordsPermissions[callRecordingObjectMetadataId]?.canReadObjectRecords)) {
                throw new _permissionsexception.PermissionsException(_permissionsexception.PermissionsExceptionMessage.PERMISSION_DENIED, _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
            }
            const callRecordingRepository = this.workspaceOrmManager.getRepository('callRecording', rolePermissionConfig);
            const callRecordingsByCreation = await callRecordingRepository.find({
                where: {
                    calendarEventId
                },
                select: {
                    id: true,
                    status: true
                },
                order: {
                    createdAt: {
                        order: 'ASC',
                        nulls: 'NULLS LAST'
                    },
                    id: 'ASC'
                }
            });
            const completedCallRecording = callRecordingsByCreation.find((callRecording)=>callRecording.status === _callrecordingstatusenum.CallRecordingStatus.COMPLETED);
            const nonTerminalCallRecording = callRecordingsByCreation.find((callRecording)=>NON_TERMINAL_CALL_RECORDING_STATUSES.includes(callRecording.status));
            return (completedCallRecording ?? nonTerminalCallRecording ?? callRecordingsByCreation[0])?.id;
        });
    }
    constructor(workspaceOrmManager){
        this.workspaceOrmManager = workspaceOrmManager;
    }
};
CallRecordingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager
    ])
], CallRecordingService);

//# sourceMappingURL=call-recording.service.js.map