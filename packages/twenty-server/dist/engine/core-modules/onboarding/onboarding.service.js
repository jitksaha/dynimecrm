"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get OnboardingService () {
        return OnboardingService;
    },
    get OnboardingStepKeys () {
        return OnboardingStepKeys;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _utils = require("twenty-shared/utils");
const _workspace = require("twenty-shared/workspace");
const _typeorm1 = require("typeorm");
const _billingcreditgranttypeenum = require("../billing/enums/billing-credit-grant-type.enum");
const _billingcreditservice = require("../billing/services/billing-credit.service");
const _billingservice = require("../billing/services/billing.service");
const _exceptionhandlerservice = require("../exception-handler/exception-handler.service");
const _messagequeuedecorator = require("../message-queue/decorators/message-queue.decorator");
const _messagequeueconstants = require("../message-queue/message-queue.constants");
const _messagequeueservice = require("../message-queue/services/message-queue.service");
const _onboardinginstallableappuniversalidentifiers = require("./constants/onboarding-installable-app-universal-identifiers");
const _acquireonboardingsteptransitionlockstatement = require("./constants/acquire-onboarding-step-transition-lock-statement");
const _buildonboardingsteptransitionlocknameutil = require("./utils/build-onboarding-step-transition-lock-name.util");
const _onboardingstatusenum = require("./enums/onboarding-status.enum");
const _installonboardingappsjobconstants = require("./jobs/install-onboarding-apps.job-constants");
const _onboardingexception = require("./onboarding.exception");
const _getonboardingenrichmentcreditrewardmicroutil = require("./utils/get-onboarding-enrichment-credit-reward-micro.util");
const _readbookcallstepminemployeecountutil = require("./utils/read-book-call-step-min-employee-count.util");
const _twentyconfigservice = require("../twenty-config/twenty-config.service");
const _uservarsservice = require("../user/user-vars/services/user-vars.service");
const _userworkspaceentity = require("../user-workspace/user-workspace.entity");
const _workspaceentity = require("../workspace/workspace.entity");
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
var OnboardingStepKeys = /*#__PURE__*/ function(OnboardingStepKeys) {
    OnboardingStepKeys["ONBOARDING_CONNECT_ACCOUNT_PENDING"] = "ONBOARDING_CONNECT_ACCOUNT_PENDING";
    OnboardingStepKeys["ONBOARDING_INVITE_TEAM_PENDING"] = "ONBOARDING_INVITE_TEAM_PENDING";
    OnboardingStepKeys["ONBOARDING_CREATE_PROFILE_PENDING"] = "ONBOARDING_CREATE_PROFILE_PENDING";
    OnboardingStepKeys["ONBOARDING_INSTALL_APPS_PENDING"] = "ONBOARDING_INSTALL_APPS_PENDING";
    OnboardingStepKeys["ONBOARDING_BOOK_CALL_PENDING"] = "ONBOARDING_BOOK_CALL_PENDING";
    OnboardingStepKeys["ONBOARDING_BOOK_CALL_OFFERED"] = "ONBOARDING_BOOK_CALL_OFFERED";
    OnboardingStepKeys["ONBOARDING_REVERSIBLE_STEP_HISTORY"] = "ONBOARDING_REVERSIBLE_STEP_HISTORY";
    return OnboardingStepKeys;
}({});
let OnboardingService = class OnboardingService {
    async runStepTransitionInLockedTransaction({ userId, workspaceId }, runStepTransition) {
        return this.dataSource.transaction(async (entityManager)=>{
            const transactionQueryRunner = entityManager.queryRunner;
            if (!(0, _utils.isDefined)(transactionQueryRunner)) {
                throw new _onboardingexception.OnboardingException('Onboarding step transitions require a transaction-scoped entity manager', _onboardingexception.OnboardingExceptionCode.MISSING_TRANSACTION_QUERY_RUNNER);
            }
            await transactionQueryRunner.query(_acquireonboardingsteptransitionlockstatement.ACQUIRE_ONBOARDING_STEP_TRANSITION_LOCK_STATEMENT, [
                (0, _buildonboardingsteptransitionlocknameutil.buildOnboardingStepTransitionLockName)({
                    userId,
                    workspaceId
                })
            ]);
            return runStepTransition(transactionQueryRunner);
        });
    }
    isWorkspaceActivationPending(workspace) {
        return workspace.activationStatus === _workspace.WorkspaceActivationStatus.PENDING_CREATION || workspace.activationStatus === _workspace.WorkspaceActivationStatus.ONGOING_CREATION;
    }
    async getOnboardingStatus({ userId, workspaceId }) {
        // We always read the workspace directly from the database here (bypassing
        // the per-instance core entity cache) so that onboardingStatus reflects the
        // freshest activationStatus right after activateWorkspace, even when a
        // sibling server instance still has a stale cached workspace.
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            }
        });
        if (!(0, _utils.isDefined)(workspace)) {
            return null;
        }
        if (this.isWorkspaceActivationPending(workspace)) {
            return _onboardingstatusenum.OnboardingStatus.WORKSPACE_ACTIVATION;
        }
        const userVars = await this.userVarsService.getAll({
            userId,
            workspaceId: workspace.id
        });
        const isProfileCreationPending = userVars.get("ONBOARDING_CREATE_PROFILE_PENDING") === true;
        const isConnectAccountPending = userVars.get("ONBOARDING_CONNECT_ACCOUNT_PENDING") === true;
        const isInstallAppsPending = userVars.get("ONBOARDING_INSTALL_APPS_PENDING") === true;
        const isInviteTeamPending = userVars.get("ONBOARDING_INVITE_TEAM_PENDING") === true;
        const isBookCallPending = userVars.get("ONBOARDING_BOOK_CALL_PENDING") === true;
        if (isConnectAccountPending) {
            return _onboardingstatusenum.OnboardingStatus.SYNC_EMAIL;
        }
        if (isInstallAppsPending) {
            return _onboardingstatusenum.OnboardingStatus.APPS_INSTALLATION;
        }
        if (isProfileCreationPending) {
            return _onboardingstatusenum.OnboardingStatus.PROFILE_CREATION;
        }
        if (isInviteTeamPending) {
            return _onboardingstatusenum.OnboardingStatus.INVITE_TEAM;
        }
        const isPlanRequired = await this.billingService.isSubscriptionIncompleteOnboardingStatus(workspace.id);
        if (isBookCallPending && isPlanRequired && (0, _utils.isDefined)((0, _readbookcallstepminemployeecountutil.readBookCallStepMinEmployeeCount)(this.twentyConfigService))) {
            return _onboardingstatusenum.OnboardingStatus.BOOK_CALL;
        }
        if (isPlanRequired) {
            return _onboardingstatusenum.OnboardingStatus.PLAN_REQUIRED;
        }
        return _onboardingstatusenum.OnboardingStatus.COMPLETED;
    }
    async isOnboardingInviteTeamPending({ userId, workspaceId }) {
        return await this.userVarsService.get({
            userId,
            workspaceId,
            key: "ONBOARDING_INVITE_TEAM_PENDING"
        }) === true;
    }
    async getPreviousReversibleOnboardingStatus({ userId, workspaceId }) {
        const reversibleStepHistory = await this.getReversibleOnboardingStepHistory({
            userId,
            workspaceId
        });
        return reversibleStepHistory[reversibleStepHistory.length - 1] ?? null;
    }
    async goBackToPreviousOnboardingStep({ userId, workspaceId }) {
        await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>{
            const reversibleStepHistory = await this.getReversibleOnboardingStepHistory({
                userId,
                workspaceId
            });
            const previousReversibleStep = reversibleStepHistory[reversibleStepHistory.length - 1];
            if (!(0, _utils.isDefined)(previousReversibleStep)) {
                throw new _onboardingexception.OnboardingException(`No previous onboarding step to go back to for user ${userId} in workspace ${workspaceId}`, _onboardingexception.OnboardingExceptionCode.NO_PREVIOUS_ONBOARDING_STEP);
            }
            await this.setReversibleOnboardingStepHistory({
                userId,
                workspaceId,
                reversibleStepHistory: reversibleStepHistory.slice(0, -1)
            }, queryRunner);
            await this.restoreReversibleOnboardingStepPendingFlag({
                userId,
                workspaceId,
                step: previousReversibleStep
            }, queryRunner);
        });
        return this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async ()=>({
                onboardingStatus: await this.getOnboardingStatus({
                    userId,
                    workspaceId
                }),
                previousOnboardingStatus: await this.getPreviousReversibleOnboardingStatus({
                    userId,
                    workspaceId
                })
            }));
    }
    async pushReversibleOnboardingStep({ userId, workspaceId, step }, queryRunner) {
        const reversibleStepHistory = await this.getReversibleOnboardingStepHistory({
            userId,
            workspaceId
        });
        await this.setReversibleOnboardingStepHistory({
            userId,
            workspaceId,
            reversibleStepHistory: [
                ...reversibleStepHistory,
                step
            ]
        }, queryRunner);
    }
    async getReversibleOnboardingStepHistory({ userId, workspaceId }) {
        const reversibleStepHistory = await this.userVarsService.get({
            userId,
            workspaceId,
            key: "ONBOARDING_REVERSIBLE_STEP_HISTORY"
        });
        return Array.isArray(reversibleStepHistory) ? reversibleStepHistory : [];
    }
    async setReversibleOnboardingStepHistory({ userId, workspaceId, reversibleStepHistory }, queryRunner) {
        await this.userVarsService.set({
            userId,
            workspaceId,
            key: "ONBOARDING_REVERSIBLE_STEP_HISTORY",
            value: reversibleStepHistory
        }, queryRunner);
    }
    async clearReversibleOnboardingStepHistoryAfterIrreversibleStep({ userId, workspaceId }, queryRunner) {
        await this.setReversibleOnboardingStepHistory({
            userId,
            workspaceId,
            reversibleStepHistory: []
        }, queryRunner);
    }
    async restoreReversibleOnboardingStepPendingFlag({ userId, workspaceId, step }, queryRunner) {
        switch(step){
            case _onboardingstatusenum.OnboardingStatus.SYNC_EMAIL:
                return this.setOnboardingConnectAccountPending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner);
            case _onboardingstatusenum.OnboardingStatus.APPS_INSTALLATION:
                return this.setOnboardingInstallAppsPending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner);
            case _onboardingstatusenum.OnboardingStatus.PROFILE_CREATION:
                return this.setOnboardingCreateProfilePending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner);
            case _onboardingstatusenum.OnboardingStatus.INVITE_TEAM:
                // User-scoped on purpose: the workspace-scoped flag would pull every
                // other member of the workspace back to the invite screen.
                return this.setOnboardingInviteTeamPending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner);
            case _onboardingstatusenum.OnboardingStatus.BOOK_CALL:
                return this.setOnboardingBookCallPending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner);
            default:
                (0, _utils.assertUnreachable)(step);
        }
    }
    async setOnboardingConnectAccountPending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_CONNECT_ACCOUNT_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId: workspaceId,
            key: "ONBOARDING_CONNECT_ACCOUNT_PENDING",
            value: true
        }, queryRunner);
    }
    async completeOnboardingConnectAccountStep({ userId, workspaceId }) {
        const hasClaimedConnectAccountStep = await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>{
            const hasClaimedStep = await this.claimOnboardingConnectAccountStep({
                userId,
                workspaceId
            }, queryRunner);
            if (!hasClaimedStep) {
                return false;
            }
            await this.clearReversibleOnboardingStepHistoryAfterIrreversibleStep({
                userId,
                workspaceId
            }, queryRunner);
            return true;
        });
        if (!hasClaimedConnectAccountStep) {
            return;
        }
        await this.creditImportContactsRewardForFirstWorkspaceUser({
            workspaceId
        });
    }
    async skipOnboardingConnectAccountStep({ userId, workspaceId, isAutoSkipped }) {
        await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>{
            const hasClaimedConnectAccountStep = await this.claimOnboardingConnectAccountStep({
                userId,
                workspaceId
            }, queryRunner);
            if (!hasClaimedConnectAccountStep || isAutoSkipped) {
                return;
            }
            await this.pushReversibleOnboardingStep({
                userId,
                workspaceId,
                step: _onboardingstatusenum.OnboardingStatus.SYNC_EMAIL
            }, queryRunner);
        });
    }
    async isFirstWorkspaceUser({ workspaceId }) {
        const workspaceUserCount = await this.userWorkspaceRepository.countBy({
            workspaceId
        });
        return workspaceUserCount === 1;
    }
    async claimOnboardingConnectAccountStep({ userId, workspaceId }, queryRunner) {
        const affectedRows = await this.userVarsService.delete({
            userId,
            workspaceId,
            key: "ONBOARDING_CONNECT_ACCOUNT_PENDING"
        }, queryRunner);
        return (0, _utils.isDefined)(affectedRows) && affectedRows > 0;
    }
    async creditImportContactsRewardForFirstWorkspaceUser({ workspaceId }) {
        try {
            const isFirstWorkspaceUser = await this.isFirstWorkspaceUser({
                workspaceId
            });
            if (!isFirstWorkspaceUser) {
                return;
            }
            await this.billingCreditService.grantCredits({
                workspaceId,
                amountMicro: this.twentyConfigService.get('ONBOARDING_IMPORT_CONTACTS_CREDITS_REWARD'),
                type: _billingcreditgranttypeenum.BillingCreditGrantType.ONBOARDING_REWARD,
                reason: 'Onboarding reward: import contacts',
                idempotencyKey: `onboarding-import-contacts:${workspaceId}`
            });
        } catch (error) {
            this.logger.error(`Failed to credit onboarding import-contacts reward for workspace ${workspaceId}`, error);
        }
    }
    async setOnboardingInstallAppsPending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_INSTALL_APPS_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId,
            key: "ONBOARDING_INSTALL_APPS_PENDING",
            value: true
        }, queryRunner);
    }
    async triggerInstallAppsOnboardingStep({ userId, workspaceId, universalIdentifiers, isAutoSkipped }) {
        const installableUniversalIdentifiers = universalIdentifiers.filter((universalIdentifier)=>_onboardinginstallableappuniversalidentifiers.ONBOARDING_INSTALLABLE_APP_UNIVERSAL_IDENTIFIERS.includes(universalIdentifier));
        if (installableUniversalIdentifiers.length === 0) {
            await this.runStepTransitionInLockedTransaction({
                userId,
                workspaceId
            }, async (queryRunner)=>{
                const hasClaimedInstallAppsStep = await this.claimInstallAppsOnboardingStep({
                    userId,
                    workspaceId
                }, queryRunner);
                if (!hasClaimedInstallAppsStep || isAutoSkipped) {
                    return;
                }
                await this.pushReversibleOnboardingStep({
                    userId,
                    workspaceId,
                    step: _onboardingstatusenum.OnboardingStatus.APPS_INSTALLATION
                }, queryRunner);
            });
            return;
        }
        const hasClaimedInstallAppsStep = await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>this.claimInstallAppsOnboardingStep({
                userId,
                workspaceId
            }, queryRunner));
        if (!hasClaimedInstallAppsStep) {
            return;
        }
        try {
            await this.messageQueueService.add(_installonboardingappsjobconstants.INSTALL_ONBOARDING_APPS_JOB_NAME, {
                workspaceId,
                universalIdentifiers: installableUniversalIdentifiers,
                userId
            }, {
                id: `${_installonboardingappsjobconstants.INSTALL_ONBOARDING_APPS_JOB_NAME}-${workspaceId}`
            });
        } catch (error) {
            const enqueueFailureMessage = `Failed to enqueue the install onboarding apps job for workspace ${workspaceId}`;
            this.logger.error(enqueueFailureMessage, error);
            await this.releaseInstallAppsOnboardingStepClaim({
                userId,
                workspaceId
            });
            throw new _onboardingexception.OnboardingException(enqueueFailureMessage, _onboardingexception.OnboardingExceptionCode.INSTALL_APPS_JOB_ENQUEUE_FAILED);
        }
    }
    async releaseInstallAppsOnboardingStepClaim({ userId, workspaceId }) {
        try {
            await this.runStepTransitionInLockedTransaction({
                userId,
                workspaceId
            }, async (queryRunner)=>this.setOnboardingInstallAppsPending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner));
        } catch (error) {
            this.logger.error(`Failed to restore the pending install-apps onboarding step for workspace ${workspaceId}`, error);
        }
    }
    async clearReversibleOnboardingStepHistoryAfterAppsInstalled({ userId, workspaceId }) {
        await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>this.clearReversibleOnboardingStepHistoryAfterIrreversibleStep({
                userId,
                workspaceId
            }, queryRunner));
    }
    async claimInstallAppsOnboardingStep({ userId, workspaceId }, queryRunner) {
        const affectedRows = await this.userVarsService.delete({
            userId,
            workspaceId,
            key: "ONBOARDING_INSTALL_APPS_PENDING"
        }, queryRunner);
        return (0, _utils.isDefined)(affectedRows) && affectedRows > 0;
    }
    async creditInstallAppsReward({ workspaceId, rewardAppsCount }) {
        try {
            await this.billingCreditService.grantCredits({
                workspaceId,
                amountMicro: this.twentyConfigService.get('ONBOARDING_INSTALL_APPS_CREDITS_REWARD_PER_APP') * rewardAppsCount,
                type: _billingcreditgranttypeenum.BillingCreditGrantType.ONBOARDING_REWARD,
                reason: `Onboarding reward: install ${rewardAppsCount} app(s)`,
                idempotencyKey: `onboarding-install-apps:${workspaceId}`
            });
        } catch (error) {
            this.logger.error(`Failed to credit onboarding install-apps reward for workspace ${workspaceId}`, error);
        }
    }
    async setOnboardingInviteTeamPending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_INVITE_TEAM_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId,
            key: "ONBOARDING_INVITE_TEAM_PENDING",
            value: true
        }, queryRunner);
    }
    async creditEnrichmentQualificationReward({ workspaceId, employeeCount }) {
        // Reading the tiers throws on its own when the configured value is not a
        // parseable JSON object, so it sits inside the guard with the grant: a
        // reward nobody has configured correctly must not cost anyone their
        // onboarding.
        try {
            const { amountMicro, malformedTierKeys } = (0, _getonboardingenrichmentcreditrewardmicroutil.getOnboardingEnrichmentCreditRewardMicro)({
                employeeCount,
                tiers: this.twentyConfigService.get('ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS')
            });
            if (malformedTierKeys.length > 0) {
                // Dropping a malformed tier silently would under-pay every workspace
                // that should have matched it, with nothing to notice it by.
                this.exceptionHandlerService.captureExceptions([
                    new Error(`Ignored malformed ONBOARDING_ENRICHMENT_CREDIT_REWARD_TIERS entries: ${malformedTierKeys.join(', ')}`)
                ]);
            }
            if (!(0, _utils.isDefined)(amountMicro)) {
                return;
            }
            await this.billingCreditService.grantCredits({
                workspaceId,
                amountMicro,
                type: _billingcreditgranttypeenum.BillingCreditGrantType.ONBOARDING_REWARD,
                reason: 'Onboarding reward: enrichment-qualified workspace',
                // The only gate on the reward, deliberately: it is keyed on the
                // workspace rather than the enriching user so that a re-run of the
                // enrichment, or a second member qualifying later, replays instead of
                // topping up a balance the workspace already received.
                idempotencyKey: `onboarding-enrichment-qualified:${workspaceId}`
            });
        } catch (error) {
            this.logger.error(`Failed to credit onboarding enrichment qualification reward for workspace ${workspaceId}`, error);
            this.exceptionHandlerService.captureExceptions([
                error
            ], {
                workspace: {
                    id: workspaceId
                }
            });
        }
    }
    async isOnboardingBookCallPending({ userId, workspaceId }) {
        if (!(0, _utils.isDefined)((0, _readbookcallstepminemployeecountutil.readBookCallStepMinEmployeeCount)(this.twentyConfigService))) {
            return false;
        }
        return await this.userVarsService.get({
            userId,
            workspaceId,
            key: "ONBOARDING_BOOK_CALL_PENDING"
        }) === true;
    }
    async setOnboardingBookCallPending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_BOOK_CALL_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId,
            key: "ONBOARDING_BOOK_CALL_PENDING",
            value: true
        }, queryRunner);
    }
    async completeOnboardingBookCallStep({ userId, workspaceId, hasBookedCall, isAutoSkipped }) {
        await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>{
            const hasClaimedBookCallStep = await this.claimOnboardingBookCallStep({
                userId,
                workspaceId
            }, queryRunner);
            if (!hasClaimedBookCallStep || isAutoSkipped) {
                return;
            }
            if (hasBookedCall) {
                await this.clearReversibleOnboardingStepHistoryAfterIrreversibleStep({
                    userId,
                    workspaceId
                }, queryRunner);
                return;
            }
            await this.pushReversibleOnboardingStep({
                userId,
                workspaceId,
                step: _onboardingstatusenum.OnboardingStatus.BOOK_CALL
            }, queryRunner);
        });
    }
    async claimOnboardingBookCallStep({ userId, workspaceId }, queryRunner) {
        const affectedRows = await this.userVarsService.delete({
            userId,
            workspaceId,
            key: "ONBOARDING_BOOK_CALL_PENDING"
        }, queryRunner);
        return (0, _utils.isDefined)(affectedRows) && affectedRows > 0;
    }
    async setOnboardingBookCallPendingIfQualified({ userId, workspaceId, employeeCount }) {
        const minEmployeeCount = (0, _readbookcallstepminemployeecountutil.readBookCallStepMinEmployeeCount)(this.twentyConfigService);
        if (!(0, _utils.isDefined)(minEmployeeCount) || !(0, _guards.isNumber)(employeeCount) || employeeCount < minEmployeeCount) {
            return false;
        }
        try {
            return await this.dataSource.transaction(async (entityManager)=>{
                const { queryRunner } = entityManager;
                if (!(0, _utils.isDefined)(queryRunner)) {
                    throw new Error('Transaction entity manager has no query runner');
                }
                // Claiming the offer is the single-winner gate: a concurrent enrichment
                // loses the insert and must not resurrect a step the user already skipped.
                const hasClaimedBookCallOffer = await this.userVarsService.setIfNotExists({
                    userId,
                    workspaceId,
                    key: "ONBOARDING_BOOK_CALL_OFFERED",
                    value: true
                }, queryRunner);
                if (!hasClaimedBookCallOffer) {
                    return false;
                }
                await this.setOnboardingBookCallPending({
                    userId,
                    workspaceId,
                    value: true
                }, queryRunner);
                return true;
            });
        } catch (error) {
            this.logger.error(`Failed to flag the book-call onboarding step for user ${userId} in workspace ${workspaceId}`, error);
            return false;
        }
    }
    async setOnboardingCreateProfilePending({ userId, workspaceId, value }, queryRunner) {
        if (!value) {
            await this.userVarsService.delete({
                userId,
                workspaceId,
                key: "ONBOARDING_CREATE_PROFILE_PENDING"
            }, queryRunner);
            return;
        }
        await this.userVarsService.set({
            userId,
            workspaceId,
            key: "ONBOARDING_CREATE_PROFILE_PENDING",
            value: true
        }, queryRunner);
    }
    async completeOnboardingProfileStepIfNameProvided({ userId, workspaceId, firstName, lastName }) {
        if (!(0, _utils.isDefined)(userId)) {
            return;
        }
        const hasProvidedNamePart = (0, _utils.isDefined)(firstName) && firstName !== '' || (0, _utils.isDefined)(lastName) && lastName !== '';
        if (!hasProvidedNamePart) {
            return;
        }
        await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>{
            const hasClaimedCreateProfileStep = await this.claimOnboardingCreateProfileStep({
                userId,
                workspaceId
            }, queryRunner);
            if (!hasClaimedCreateProfileStep) {
                return;
            }
            await this.pushReversibleOnboardingStep({
                userId,
                workspaceId,
                step: _onboardingstatusenum.OnboardingStatus.PROFILE_CREATION
            }, queryRunner);
        });
    }
    async claimOnboardingCreateProfileStep({ userId, workspaceId }, queryRunner) {
        const affectedRows = await this.userVarsService.delete({
            userId,
            workspaceId,
            key: "ONBOARDING_CREATE_PROFILE_PENDING"
        }, queryRunner);
        return (0, _utils.isDefined)(affectedRows) && affectedRows > 0;
    }
    async completeOnboardingInviteTeamStep({ userId, workspaceId, hasSentInvitations }) {
        await this.runStepTransitionInLockedTransaction({
            userId,
            workspaceId
        }, async (queryRunner)=>{
            const hasClaimedInviteTeamStep = await this.claimOnboardingInviteTeamStep({
                workspaceId
            }, queryRunner);
            if (!hasClaimedInviteTeamStep) {
                return;
            }
            if (hasSentInvitations) {
                await this.clearReversibleOnboardingStepHistoryAfterIrreversibleStep({
                    userId,
                    workspaceId
                }, queryRunner);
                return;
            }
            await this.pushReversibleOnboardingStep({
                userId,
                workspaceId,
                step: _onboardingstatusenum.OnboardingStatus.INVITE_TEAM
            }, queryRunner);
        });
    }
    async claimOnboardingInviteTeamStep({ workspaceId }, queryRunner) {
        const affectedRows = await this.userVarsService.delete({
            workspaceId,
            key: "ONBOARDING_INVITE_TEAM_PENDING"
        }, queryRunner);
        return (0, _utils.isDefined)(affectedRows) && affectedRows > 0;
    }
    constructor(billingService, billingCreditService, exceptionHandlerService, userVarsService, twentyConfigService, workspaceRepository, userWorkspaceRepository, messageQueueService, dataSource){
        this.billingService = billingService;
        this.billingCreditService = billingCreditService;
        this.exceptionHandlerService = exceptionHandlerService;
        this.userVarsService = userVarsService;
        this.twentyConfigService = twentyConfigService;
        this.workspaceRepository = workspaceRepository;
        this.userWorkspaceRepository = userWorkspaceRepository;
        this.messageQueueService = messageQueueService;
        this.dataSource = dataSource;
        this.logger = new _common.Logger(OnboardingService.name);
    }
};
OnboardingService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(5, (0, _typeorm.InjectRepository)(_workspaceentity.WorkspaceEntity)),
    _ts_param(6, (0, _typeorm.InjectRepository)(_userworkspaceentity.UserWorkspaceEntity)),
    _ts_param(7, (0, _messagequeuedecorator.InjectMessageQueue)(_messagequeueconstants.MessageQueue.workspaceQueue)),
    _ts_param(8, (0, _typeorm.InjectDataSource)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _billingservice.BillingService === "undefined" ? Object : _billingservice.BillingService,
        typeof _billingcreditservice.BillingCreditService === "undefined" ? Object : _billingcreditservice.BillingCreditService,
        typeof _exceptionhandlerservice.ExceptionHandlerService === "undefined" ? Object : _exceptionhandlerservice.ExceptionHandlerService,
        typeof _uservarsservice.UserVarsService === "undefined" ? Object : _uservarsservice.UserVarsService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _messagequeueservice.MessageQueueService === "undefined" ? Object : _messagequeueservice.MessageQueueService,
        typeof DataSource === "undefined" ? Object : DataSource
    ])
], OnboardingService);

//# sourceMappingURL=onboarding.service.js.map