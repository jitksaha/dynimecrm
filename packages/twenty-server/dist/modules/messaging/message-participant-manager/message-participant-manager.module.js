"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MessageParticipantManagerModule", {
    enumerable: true,
    get: function() {
        return MessageParticipantManagerModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _workspaceentity = require("../../../engine/core-modules/workspace/workspace.entity");
const _workspacedatasourcemodule = require("../../../engine/workspace-datasource/workspace-datasource.module");
const _contactcreationmanagermodule = require("../../contact-creation-manager/contact-creation-manager.module");
const _matchparticipantmodule = require("../../match-participant/match-participant.module");
const _messagingcommonmodule = require("../common/messaging-common.module");
const _messageparticipantmatchparticipantjob = require("./jobs/message-participant-match-participant.job");
const _messageparticipantpersonlistener = require("./listeners/message-participant-person.listener");
const _messageparticipantworkspacememberlistener = require("./listeners/message-participant-workspace-member.listener");
const _messagingmessageparticipantservice = require("./services/messaging-message-participant.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MessageParticipantManagerModule = class MessageParticipantManagerModule {
};
MessageParticipantManagerModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _typeorm.TypeOrmModule.forFeature([
                _workspaceentity.WorkspaceEntity
            ]),
            _contactcreationmanagermodule.ContactCreationManagerModule,
            _workspacedatasourcemodule.WorkspaceDataSourceModule,
            _messagingcommonmodule.MessagingCommonModule,
            _matchparticipantmodule.MatchParticipantModule
        ],
        providers: [
            _messagingmessageparticipantservice.MessagingMessageParticipantService,
            _messageparticipantmatchparticipantjob.MessageParticipantMatchParticipantJob,
            _messageparticipantpersonlistener.MessageParticipantPersonListener,
            _messageparticipantworkspacememberlistener.MessageParticipantWorkspaceMemberListener
        ],
        exports: [
            _messagingmessageparticipantservice.MessagingMessageParticipantService
        ]
    })
], MessageParticipantManagerModule);

//# sourceMappingURL=message-participant-manager.module.js.map