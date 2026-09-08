"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeTopicService", {
    enumerable: true,
    get: function() {
        return UnsubscribeTopicService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _unsubscribetopicentity = require("../../../engine/core-modules/emailing-domain/unsubscribe-topic.entity");
const _unsubscribetopicvisibilitytype = require("../../../engine/core-modules/emailing-domain/types/unsubscribe-topic-visibility.type");
const _injectworkspacescopedrepositorydecorator = require("../../../engine/twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../engine/twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let UnsubscribeTopicService = class UnsubscribeTopicService {
    async getUnsubscribeTopics(workspaceId) {
        return this.unsubscribeTopicRepository.find(workspaceId, {
            order: {
                name: 'ASC'
            }
        });
    }
    async findPublicTopics(workspaceId) {
        return this.unsubscribeTopicRepository.find(workspaceId, {
            where: {
                visibility: _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility.PUBLIC
            },
            order: {
                name: 'ASC'
            }
        });
    }
    async createUnsubscribeTopic(workspaceId, { name, description = null, visibility }) {
        return this.unsubscribeTopicRepository.insertAndReturnOne(workspaceId, {
            name,
            description,
            visibility: visibility ?? _unsubscribetopicvisibilitytype.UnsubscribeTopicVisibility.PRIVATE
        });
    }
    async updateUnsubscribeTopic(workspaceId, { id, name, description, visibility }) {
        await this.unsubscribeTopicRepository.update(workspaceId, {
            id
        }, {
            ...name !== undefined ? {
                name
            } : {},
            ...description !== undefined ? {
                description
            } : {},
            ...(0, _utils.isDefined)(visibility) ? {
                visibility
            } : {}
        });
        return this.unsubscribeTopicRepository.findOneOrFail(workspaceId, {
            where: {
                id
            }
        });
    }
    async deleteUnsubscribeTopic(workspaceId, id) {
        await this.unsubscribeTopicRepository.delete(workspaceId, {
            id
        });
    }
    constructor(unsubscribeTopicRepository){
        this.unsubscribeTopicRepository = unsubscribeTopicRepository;
    }
};
UnsubscribeTopicService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_unsubscribetopicentity.UnsubscribeTopicEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], UnsubscribeTopicService);

//# sourceMappingURL=unsubscribe-topic.service.js.map