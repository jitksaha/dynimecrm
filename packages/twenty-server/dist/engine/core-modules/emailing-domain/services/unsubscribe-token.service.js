"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UnsubscribeTokenService", {
    enumerable: true,
    get: function() {
        return UnsubscribeTokenService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _isencryptedstringutil = require("../../secret-encryption/branded-strings/is-encrypted-string.util");
const _secretencryptionservice = require("../../secret-encryption/secret-encryption.service");
const _isunsubscribetokenexpiredutil = require("../utils/is-unsubscribe-token-expired.util");
const _unsubscribetokenpayloadzodschema = require("../zod-schemas/unsubscribe-token-payload.zod-schema");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const WORKSPACE_ID_SEPARATOR = '.';
let UnsubscribeTokenService = class UnsubscribeTokenService {
    sign(payload) {
        const stampedPayload = {
            ...payload,
            issuedAt: Date.now()
        };
        const envelope = this.secretEncryptionService.encryptVersioned(JSON.stringify(stampedPayload), {
            workspaceId: payload.workspaceId
        });
        return Buffer.from(`${payload.workspaceId}${WORKSPACE_ID_SEPARATOR}${envelope}`).toString('base64url');
    }
    verify(token) {
        const decodedToken = Buffer.from(token, 'base64url').toString('utf8');
        const separatorIndex = decodedToken.indexOf(WORKSPACE_ID_SEPARATOR);
        if (separatorIndex === -1) {
            return null;
        }
        const workspaceId = decodedToken.slice(0, separatorIndex);
        const envelope = decodedToken.slice(separatorIndex + 1);
        if (!(0, _isencryptedstringutil.isEncryptedString)(envelope)) {
            return null;
        }
        const payload = this.decryptPayload({
            envelope,
            workspaceId
        });
        if (payload === null) {
            return null;
        }
        return {
            payload,
            isExpired: (0, _isunsubscribetokenexpiredutil.isUnsubscribeTokenExpired)({
                issuedAt: payload.issuedAt,
                now: Date.now()
            })
        };
    }
    decryptPayload({ envelope, workspaceId }) {
        try {
            const decrypted = this.secretEncryptionService.decryptVersionedOrThrow(envelope, {
                workspaceId
            });
            const parsedPayload = _unsubscribetokenpayloadzodschema.unsubscribeTokenPayloadSchema.safeParse((0, _utils.parseJson)(decrypted));
            if (!parsedPayload.success) {
                return null;
            }
            if (parsedPayload.data.workspaceId !== workspaceId) {
                return null;
            }
            return parsedPayload.data;
        } catch  {
            return null;
        }
    }
    constructor(secretEncryptionService){
        this.secretEncryptionService = secretEncryptionService;
    }
};
UnsubscribeTokenService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _secretencryptionservice.SecretEncryptionService === "undefined" ? Object : _secretencryptionservice.SecretEncryptionService
    ])
], UnsubscribeTokenService);

//# sourceMappingURL=unsubscribe-token.service.js.map