/* @license Enterprise */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BillingCreditGrantService", {
    enumerable: true,
    get: function() {
        return BillingCreditGrantService;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _typeorm = require("typeorm");
const _postgreserrorcodesconstants = require("../../../api/graphql/workspace-query-runner/constants/postgres-error-codes.constants");
const _billingexception = require("../billing.exception");
const _billingcreditgrantentity = require("../entities/billing-credit-grant.entity");
const _injectworkspacescopedrepositorydecorator = require("../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
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
const getPostgresErrorCode = (error)=>{
    if (!(0, _utils.isDefined)(error) || typeof error !== 'object' || !('code' in error)) {
        return undefined;
    }
    return typeof error.code === 'string' ? error.code : undefined;
};
// TypeORM wraps the driver error, and which of the two carries the code
// depends on how the query was issued.
const isUniqueViolation = (error)=>{
    if (getPostgresErrorCode(error) === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION) {
        return true;
    }
    if (!(0, _utils.isDefined)(error) || typeof error !== 'object' || !('driverError' in error)) {
        return false;
    }
    return getPostgresErrorCode(error.driverError) === _postgreserrorcodesconstants.POSTGRESQL_ERROR_CODES.UNIQUE_VIOLATION;
};
let BillingCreditGrantService = class BillingCreditGrantService {
    // Returns null when idempotencyKey has already been used, so callers can tell
    // a fresh grant from a replayed one.
    async createGrant(params) {
        const { workspaceId, amountMicro, type, effectiveAt, expiresAt, reason = null, grantedByUserId = null, idempotencyKey = null, sourceGrantId = null } = params;
        if (!Number.isSafeInteger(amountMicro) || amountMicro <= 0) {
            throw new _billingexception.BillingException(`Cannot grant an amount (${amountMicro}) that is not a positive safe integer to workspace ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_CREDIT_AMOUNT_INVALID);
        }
        if (expiresAt.getTime() <= effectiveAt.getTime()) {
            throw new _billingexception.BillingException(`Cannot grant credits to workspace ${workspaceId} expiring at ${expiresAt.toISOString()}, before or when they become effective at ${effectiveAt.toISOString()}`, _billingexception.BillingExceptionCode.BILLING_CREDIT_GRANT_VALIDITY_INVALID);
        }
        try {
            const { identifiers, generatedMaps } = await this.billingCreditGrantRepository.insert(workspaceId, {
                amountMicro,
                type,
                effectiveAt,
                expiresAt,
                reason,
                grantedByUserId,
                idempotencyKey,
                sourceGrantId
            });
            const insertedId = identifiers[0]?.id ?? generatedMaps[0]?.id;
            const grantId = typeof insertedId === 'string' ? insertedId : undefined;
            if (!(0, _utils.isDefined)(grantId)) {
                return null;
            }
            return this.billingCreditGrantRepository.findOne(workspaceId, {
                where: {
                    id: grantId
                }
            });
        } catch (error) {
            if ((0, _utils.isDefined)(idempotencyKey) && isUniqueViolation(error)) {
                return null;
            }
            throw error;
        }
    }
    async getActiveCreditsMicro(workspaceId) {
        const result = await this.billingCreditGrantRepository.createQueryBuilder('billingCreditGrant').select('COALESCE(SUM("billingCreditGrant"."amountMicro"), 0)', 'total').where('"billingCreditGrant"."workspaceId" = :workspaceId', {
            workspaceId
        }).andWhere('"billingCreditGrant"."revokedAt" IS NULL').andWhere('"billingCreditGrant"."effectiveAt" <= now()').andWhere('"billingCreditGrant"."expiresAt" > now()').getRawOne();
        const total = Number(result?.total ?? 0);
        // Rounding a balance would hand out or withhold credits that were never
        // granted, so refuse rather than serve a number we cannot represent.
        if (!Number.isSafeInteger(total)) {
            throw new _billingexception.BillingException(`Credit balance for workspace ${workspaceId} is not a safe integer (${total})`, _billingexception.BillingExceptionCode.BILLING_CREDIT_AMOUNT_INVALID);
        }
        return total;
    }
    // Grants that were spendable at any point during the given period.
    async findGrantsLiveDuringPeriod({ workspaceId, periodStart, periodEnd }) {
        return this.billingCreditGrantRepository.find(workspaceId, {
            where: {
                revokedAt: (0, _typeorm.IsNull)(),
                effectiveAt: (0, _typeorm.LessThan)(periodEnd),
                expiresAt: (0, _typeorm.MoreThan)(periodStart)
            },
            order: {
                createdAt: 'ASC'
            }
        });
    }
    // The previous transition pulled every grant it closed back to the instant
    // the period ended, so the ledger records where the closing period started.
    // Calendar arithmetic cannot recover it once the subscription has moved on:
    // a month-end anchor clamps, and subtracting a month from February 28 gives
    // January 28 rather than the January 31 the period actually started on.
    async findPeriodStartBefore({ workspaceId, boundary }) {
        const [row] = await this.billingCreditGrantRepository.find(workspaceId, {
            where: {
                expiresAt: (0, _typeorm.LessThan)(boundary)
            },
            order: {
                expiresAt: 'DESC'
            },
            take: 1
        });
        return row?.expiresAt ?? null;
    }
    // Enforces the one-grant-per-period invariant at the point where periods
    // actually roll: whatever a writer guessed for expiresAt, a grant never
    // outlives the period it was carried forward from. Matched by predicate
    // rather than by id so a grant created while the transition runs is covered
    // too.
    async closeGrantsAtPeriodEnd({ workspaceId, periodEnd }) {
        await this.billingCreditGrantRepository.update(workspaceId, {
            revokedAt: (0, _typeorm.IsNull)(),
            effectiveAt: (0, _typeorm.LessThan)(periodEnd),
            expiresAt: (0, _typeorm.MoreThan)(periodEnd)
        }, {
            expiresAt: periodEnd
        });
    }
    async listGrants(workspaceId) {
        return this.billingCreditGrantRepository.find(workspaceId, {
            order: {
                createdAt: 'DESC'
            }
        });
    }
    // wasRevokedNow tells a retried revocation apart from the one that actually
    // took the credits away, so callers only adjust balances once.
    async revokeGrant({ workspaceId, grantId, revokedByUserId }) {
        const grant = await this.billingCreditGrantRepository.findOne(workspaceId, {
            where: {
                id: grantId
            }
        });
        if (!(0, _utils.isDefined)(grant)) {
            throw new _billingexception.BillingException(`Credit grant ${grantId} not found for workspace ${workspaceId}`, _billingexception.BillingExceptionCode.BILLING_CREDIT_GRANT_NOT_FOUND);
        }
        if ((0, _utils.isDefined)(grant.revokedAt)) {
            return {
                grant,
                wasRevokedNow: false
            };
        }
        const { affected } = await this.billingCreditGrantRepository.update(workspaceId, {
            id: grantId,
            revokedAt: (0, _typeorm.IsNull)()
        }, {
            revokedAt: new Date(),
            revokedByUserId: revokedByUserId ?? null
        });
        const revokedGrant = await this.billingCreditGrantRepository.findOneOrFail(workspaceId, {
            where: {
                id: grantId
            }
        });
        // Two concurrent revocations both read an unrevoked grant; only the one
        // whose UPDATE matched may move the balance.
        return {
            grant: revokedGrant,
            wasRevokedNow: (0, _utils.isDefined)(affected) && affected > 0
        };
    }
    async findGrantByIdempotencyKey(workspaceId, idempotencyKey) {
        const grant = await this.billingCreditGrantRepository.findOne(workspaceId, {
            where: {
                idempotencyKey
            }
        });
        return grant ?? null;
    }
    constructor(billingCreditGrantRepository){
        this.billingCreditGrantRepository = billingCreditGrantRepository;
    }
};
BillingCreditGrantService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_billingcreditgrantentity.BillingCreditGrantEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository
    ])
], BillingCreditGrantService);

//# sourceMappingURL=billing-credit-grant.service.js.map