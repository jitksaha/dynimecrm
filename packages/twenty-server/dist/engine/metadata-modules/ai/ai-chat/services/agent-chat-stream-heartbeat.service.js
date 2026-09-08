"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AgentChatStreamHeartbeatService", {
    enumerable: true,
    get: function() {
        return AgentChatStreamHeartbeatService;
    }
});
const _common = require("@nestjs/common");
const _redisclientservice = require("../../../../core-modules/redis-client/redis-client.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const CLAIM_TTL_SECONDS = 600;
const RUNNING_TTL_SECONDS = 30;
const REFRESH_INTERVAL_MS = 5_000;
let AgentChatStreamHeartbeatService = class AgentChatStreamHeartbeatService {
    getKey(streamId) {
        return `agent-chat-stream-alive:${streamId}`;
    }
    async markClaimed(streamId) {
        await this.redisClientService.getClient().set(this.getKey(streamId), '1', 'EX', CLAIM_TTL_SECONDS);
    }
    startRunning(streamId) {
        const refresh = ()=>{
            this.redisClientService.getClient().set(this.getKey(streamId), '1', 'EX', RUNNING_TTL_SECONDS).catch(()=>{});
        };
        refresh();
        const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
        return ()=>clearInterval(interval);
    }
    async isAlive(streamId) {
        try {
            const exists = await this.redisClientService.getClient().exists(this.getKey(streamId));
            return exists === 1;
        } catch  {
            return true;
        }
    }
    async clear(streamId) {
        await this.redisClientService.getClient().del(this.getKey(streamId)).catch(()=>{});
    }
    constructor(redisClientService){
        this.redisClientService = redisClientService;
    }
};
AgentChatStreamHeartbeatService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _redisclientservice.RedisClientService === "undefined" ? Object : _redisclientservice.RedisClientService
    ])
], AgentChatStreamHeartbeatService);

//# sourceMappingURL=agent-chat-stream-heartbeat.service.js.map