"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailComposerService", {
    enumerable: true,
    get: function() {
        return EmailComposerService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _guards = require("@sniptt/guards");
const _constants = require("twenty-shared/constants");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _zod = require("zod");
const _fileentity = require("../../../file/entities/file.entity");
const _fileservice = require("../../../file/services/file.service");
const _compileoutboundemailcontentutil = require("../../../email/utils/compile-outbound-email-content.util");
const _sanitizeoutboundemailhtmlutil = require("../../../email/utils/sanitize-outbound-email-html.util");
const _emailattachmentfilefoldersconst = require("./constants/email-attachment-file-folders.const");
const _emailtoolexception = require("./exceptions/email-tool.exception");
const _parsecommaseparatedemailsutil = require("./utils/parse-comma-separated-emails.util");
const _selectconnectedaccountidforcallerutil = require("./utils/select-connected-account-id-for-caller.util");
const _connectedaccountentity = require("../../../../metadata-modules/connected-account/entities/connected-account.entity");
const _workspaceormmanager = require("../../../../twenty-orm/workspace-orm.manager");
const _buildsystemauthcontextutil = require("../../../../twenty-orm/utils/build-system-auth-context.util");
const _injectworkspacescopedrepositorydecorator = require("../../../../twenty-orm/workspace-scoped-repository/inject-workspace-scoped-repository.decorator");
const _workspacescopedrepository = require("../../../../twenty-orm/workspace-scoped-repository/workspace-scoped-repository");
const _streamtobuffer = require("../../../../../utils/stream-to-buffer");
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
let EmailComposerService = class EmailComposerService {
    async getConnectedAccountOrThrow({ connectedAccountId, workspaceId }) {
        if (!(0, _utils.isValidUuid)(connectedAccountId)) {
            throw new _emailtoolexception.EmailToolException(`Connected account id is not a valid UUID`, _emailtoolexception.EmailToolExceptionCode.INVALID_CONNECTED_ACCOUNT_ID);
        }
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const connectedAccount = await this.connectedAccountRepository.findOne({
                where: {
                    id: connectedAccountId,
                    workspaceId
                },
                relations: {
                    messageChannels: {
                        messageFolders: true
                    }
                }
            });
            if (!(0, _utils.isDefined)(connectedAccount)) {
                throw new _emailtoolexception.EmailToolException(`No connected account found for id '${connectedAccountId}'`, _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
            }
            return connectedAccount;
        }, authContext);
    }
    async getDefaultConnectedAccountIdOrThrow({ workspaceId, userWorkspaceId }) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const allAccounts = await this.connectedAccountRepository.find({
                where: {
                    workspaceId,
                    archivedAt: (0, _typeorm1.IsNull)()
                },
                order: {
                    createdAt: 'ASC',
                    id: 'ASC'
                }
            });
            if (!(0, _utils.isNonEmptyArray)(allAccounts)) {
                throw new _emailtoolexception.EmailToolException('No connected accounts found for this workspace', _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
            }
            if (!(0, _utils.isDefined)(userWorkspaceId)) {
                return allAccounts[0].id;
            }
            const connectedAccountId = (0, _selectconnectedaccountidforcallerutil.selectConnectedAccountIdForCaller)({
                connectedAccounts: allAccounts,
                userWorkspaceId
            });
            if (!(0, _utils.isDefined)(connectedAccountId)) {
                throw new _emailtoolexception.EmailToolException(`No connected account available for user workspace '${userWorkspaceId}'`, _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
            }
            return connectedAccountId;
        }, authContext);
    }
    normalizeRecipients(parameters) {
        if (!parameters.recipients || !parameters.recipients.to || parameters.recipients.to.trim().length === 0) {
            throw new _emailtoolexception.EmailToolException('No recipients specified', _emailtoolexception.EmailToolExceptionCode.INVALID_EMAIL);
        }
        const to = (0, _parsecommaseparatedemailsutil.parseCommaSeparatedEmails)(parameters.recipients.to);
        if (to.length === 0) {
            throw new _emailtoolexception.EmailToolException('No valid recipients specified', _emailtoolexception.EmailToolExceptionCode.INVALID_EMAIL);
        }
        return {
            to,
            cc: (0, _parsecommaseparatedemailsutil.parseCommaSeparatedEmails)(parameters.recipients.cc),
            bcc: (0, _parsecommaseparatedemailsutil.parseCommaSeparatedEmails)(parameters.recipients.bcc)
        };
    }
    validateEmails(recipients) {
        const emailSchema = _zod.z.string().trim().pipe(_zod.z.email());
        const invalidEmails = [];
        const allEmails = [
            ...recipients.to,
            ...recipients.cc,
            ...recipients.bcc
        ];
        for (const email of allEmails){
            const result = emailSchema.safeParse(email);
            if (!result.success) {
                invalidEmails.push(email);
            }
        }
        return invalidEmails;
    }
    assertRecipientCountWithinLimit(recipients) {
        const total = recipients.to.length + recipients.cc.length + recipients.bcc.length;
        if (total > _constants.MAX_EMAIL_RECIPIENTS) {
            throw new _emailtoolexception.EmailToolException(`Too many recipients: ${total}. Maximum allowed is ${_constants.MAX_EMAIL_RECIPIENTS}.`, _emailtoolexception.EmailToolExceptionCode.TOO_MANY_RECIPIENTS);
        }
    }
    async getAttachments(files, workspaceId) {
        if (files.length === 0) {
            return [];
        }
        const fileIds = files.map((file)=>file.id);
        const fileEntities = await this.fileRepository.find(workspaceId, {
            where: {
                id: (0, _typeorm1.In)(fileIds)
            }
        });
        const fileEntityMap = new Map(fileEntities.map((entity)=>[
                entity.id,
                entity
            ]));
        const filesNotFound = [];
        for (const fileMetadata of files){
            if (!fileEntityMap.has(fileMetadata.id)) {
                filesNotFound.push(`${fileMetadata.name} (${fileMetadata.id})`);
            }
        }
        if (filesNotFound.length > 0) {
            throw new _emailtoolexception.EmailToolException(`Files not found: ${filesNotFound.join(', ')}`, _emailtoolexception.EmailToolExceptionCode.FILE_NOT_FOUND);
        }
        const attachments = [];
        for (const fileMetadata of files){
            const fileEntity = fileEntityMap.get(fileMetadata.id);
            const fileStream = await this.fileService.getFileStreamById({
                fileId: fileMetadata.id,
                workspaceId,
                allowedFileFolders: _emailattachmentfilefoldersconst.EMAIL_ATTACHMENT_FILE_FOLDERS
            });
            if (fileStream === null) {
                throw new _emailtoolexception.EmailToolException(`Files not found: ${fileMetadata.name} (${fileMetadata.id})`, _emailtoolexception.EmailToolExceptionCode.FILE_NOT_FOUND);
            }
            const buffer = await (0, _streamtobuffer.streamToBuffer)(fileStream.stream);
            attachments.push({
                filename: fileMetadata.name,
                content: buffer,
                contentType: fileEntity?.mimeType ?? 'application/octet-stream'
            });
        }
        return attachments;
    }
    // Resolve parent's root thread id (Gmail/MS native or stored) + RFC 5322 §3.6.4
    // References chain so replies thread on both Twenty and recipient mail clients.
    async getParentThreadContext(workspaceId, inReplyTo, messageChannelId) {
        const authContext = (0, _buildsystemauthcontextutil.buildSystemAuthContext)(workspaceId);
        return this.workspaceOrmManager.executeInWorkspaceContext(async ()=>{
            const messageRepository = this.workspaceOrmManager.getRepository('message');
            const parentMessage = await messageRepository.findOne({
                where: {
                    headerMessageId: inReplyTo
                }
            });
            if (!(0, _utils.isDefined)(parentMessage) || !(0, _utils.isDefined)(parentMessage.messageThreadId) || !(0, _utils.isDefined)(parentMessage.receivedAt)) {
                return {};
            }
            const associationRepository = this.workspaceOrmManager.getRepository('messageChannelMessageAssociation');
            const [association, ancestorMessages] = await Promise.all([
                associationRepository.findOne({
                    where: {
                        messageId: parentMessage.id,
                        messageChannelId
                    },
                    select: {
                        messageThreadExternalId: true
                    }
                }),
                messageRepository.find({
                    where: {
                        messageThreadId: parentMessage.messageThreadId,
                        receivedAt: (0, _typeorm1.LessThanOrEqual)(parentMessage.receivedAt)
                    },
                    select: {
                        headerMessageId: true
                    },
                    order: {
                        receivedAt: 'ASC'
                    }
                })
            ]);
            const references = ancestorMessages.map((message)=>message.headerMessageId).filter(_guards.isNonEmptyString);
            return {
                threadExternalId: association?.messageThreadExternalId ?? undefined,
                references: references.length > 0 ? references : undefined
            };
        }, authContext);
    }
    async composeEmail(parameters, context) {
        const { workspaceId, userWorkspaceId } = context;
        const { subject, body, files, inReplyTo, fromHandle } = parameters;
        let { connectedAccountId } = parameters;
        let recipients;
        try {
            recipients = this.normalizeRecipients(parameters);
            this.assertRecipientCountWithinLimit(recipients);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid recipients';
            return {
                success: false,
                output: {
                    success: false,
                    message: errorMessage,
                    error: errorMessage
                }
            };
        }
        const invalidEmails = this.validateEmails(recipients);
        if (invalidEmails.length > 0) {
            return {
                success: false,
                output: {
                    success: false,
                    message: `Invalid email addresses: ${invalidEmails.join(', ')}`,
                    error: `Invalid email addresses: ${invalidEmails.join(', ')}`
                }
            };
        }
        const toRecipientsDisplay = recipients.to.join(', ');
        if (!connectedAccountId) {
            connectedAccountId = await this.getDefaultConnectedAccountIdOrThrow({
                workspaceId,
                userWorkspaceId
            });
        }
        const connectedAccount = await this.getConnectedAccountOrThrow({
            connectedAccountId,
            workspaceId
        });
        const messageChannel = connectedAccount.provider === _types.ConnectedAccountProvider.EMAIL_GROUP ? connectedAccount.messageChannels[0] : connectedAccount.messageChannels.find((channel)=>channel.handle === connectedAccount.handle);
        const isSmtpOnlyAccount = connectedAccount.provider === _types.ConnectedAccountProvider.IMAP_SMTP_CALDAV && !(0, _utils.isDefined)(connectedAccount.connectionParameters?.IMAP);
        if (isSmtpOnlyAccount && !(0, _utils.isDefined)(connectedAccount.connectionParameters?.SMTP)) {
            throw new _emailtoolexception.EmailToolException(`SMTP is not configured for connected account '${connectedAccountId}'`, _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
        }
        if (!isSmtpOnlyAccount && !(0, _utils.isDefined)(messageChannel)) {
            throw new _emailtoolexception.EmailToolException(`No message channel found for connected account '${connectedAccountId}'`, _emailtoolexception.EmailToolExceptionCode.CONNECTED_ACCOUNT_NOT_FOUND);
        }
        const attachments = await this.getAttachments(files || [], workspaceId);
        const { html: sanitizedHtmlBody, plainText: plainTextBody } = await (0, _compileoutboundemailcontentutil.compileOutboundEmailContent)(body ?? '');
        const sanitizedSubject = await (0, _sanitizeoutboundemailhtmlutil.sanitizeOutboundEmailSubject)(subject || '');
        const { threadExternalId, references } = (0, _utils.isDefined)(inReplyTo) && (0, _utils.isDefined)(messageChannel) ? await this.getParentThreadContext(workspaceId, inReplyTo, messageChannel.id) : {};
        return {
            success: true,
            data: {
                recipients,
                toRecipientsDisplay,
                sanitizedSubject,
                plainTextBody,
                sanitizedHtmlBody,
                attachments,
                connectedAccount,
                fromHandle,
                messageChannelId: messageChannel?.id,
                shouldPersistMessage: (0, _utils.isDefined)(messageChannel),
                inReplyTo,
                threadExternalId,
                references
            }
        };
    }
    constructor(workspaceOrmManager, connectedAccountRepository, fileRepository, fileService){
        this.workspaceOrmManager = workspaceOrmManager;
        this.connectedAccountRepository = connectedAccountRepository;
        this.fileRepository = fileRepository;
        this.fileService = fileService;
        this.logger = new _common.Logger(EmailComposerService.name);
    }
};
EmailComposerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(1, (0, _typeorm.InjectRepository)(_connectedaccountentity.ConnectedAccountEntity)),
    _ts_param(2, (0, _injectworkspacescopedrepositorydecorator.InjectWorkspaceScopedRepository)(_fileentity.FileEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _workspaceormmanager.WorkspaceOrmManager === "undefined" ? Object : _workspaceormmanager.WorkspaceOrmManager,
        typeof Repository === "undefined" ? Object : Repository,
        typeof _workspacescopedrepository.WorkspaceScopedRepository === "undefined" ? Object : _workspacescopedrepository.WorkspaceScopedRepository,
        typeof _fileservice.FileService === "undefined" ? Object : _fileservice.FileService
    ])
], EmailComposerService);

//# sourceMappingURL=email-composer.service.js.map