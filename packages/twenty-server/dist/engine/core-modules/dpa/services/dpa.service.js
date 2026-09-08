"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DpaService", {
    enumerable: true,
    get: function() {
        return DpaService;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const _typeorm1 = require("typeorm");
const _uuid = require("uuid");
const _applicationservice = require("../../application/application.service");
const _dpadocumentblockkindenum = require("../enums/dpa-document-block-kind.enum");
const _dpaagreemententity = require("../entities/dpa-agreement.entity");
const _dpaagreementtypeenum = require("../enums/dpa-agreement-type.enum");
const _dparegionservice = require("./dpa-region.service");
const _builddpaagreementrecordutil = require("../utils/build-dpa-agreement-record.util");
const _resolvedpautil = require("../utils/resolve-dpa.util");
const _renderdpatopdfutil = require("../pdf/render-dpa-to-pdf.util");
const _filestorageservice = require("../../file-storage/services/file-storage.service");
const _fileurlservice = require("../../file/file-url/file-url.service");
const _twentyconfigservice = require("../../twenty-config/twenty-config.service");
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
const BLOCK_KIND_TO_DTO = {
    heading: _dpadocumentblockkindenum.DpaDocumentBlockKind.Heading,
    paragraph: _dpadocumentblockkindenum.DpaDocumentBlockKind.Paragraph,
    signatureField: _dpadocumentblockkindenum.DpaDocumentBlockKind.SignatureField
};
const toDocumentDto = (resolved)=>({
        title: resolved.title,
        lastUpdatedLabel: resolved.lastUpdatedLabel,
        templateVersion: resolved.templateVersion,
        region: resolved.region,
        processorEntity: resolved.values.PROCESSOR_ENTITY,
        sccSectionActive: resolved.sccSectionActive,
        notice: resolved.notice,
        blocks: resolved.blocks.map((block)=>({
                kind: BLOCK_KIND_TO_DTO[block.kind],
                text: block.text,
                label: block.label,
                value: block.value
            }))
    });
let DpaService = class DpaService {
    // Keys off IS_MULTIWORKSPACE_ENABLED, not billing — using billing here misclassified cloud as self-hosted.
    isSelfHosted() {
        return this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED') !== true;
    }
    getPreviewForWorkspace(workspace) {
        const region = this.dpaRegionService.getRegionForWorkspace(workspace);
        return toDocumentDto((0, _resolvedpautil.resolveDpa)({
            region,
            mode: 'preview',
            isSelfHosted: this.isSelfHosted()
        }));
    }
    async listAgreements(workspaceId) {
        return this.dpaAgreementRepository.find({
            where: {
                workspaceId
            },
            order: {
                createdAt: 'DESC'
            }
        });
    }
    async getDownloadUrl(agreement, workspaceId) {
        if (!(0, _utils.isDefined)(agreement.signedFileId)) {
            return null;
        }
        return this.fileUrlService.signFileByIdUrl({
            fileId: agreement.signedFileId,
            workspaceId,
            fileFolder: _types.FileFolder.Dpa
        });
    }
    async generateSignedDpa({ workspace, userId, userEmail, input }) {
        if (this.isSelfHosted()) {
            throw new _common.BadRequestException('DPA signing is not available for self-hosted deployments: Twenty does not host or process Customer Personal Data and is not the Processor.');
        }
        const region = this.dpaRegionService.getRegionForWorkspace(workspace);
        const executedAt = new Date();
        const resolved = (0, _resolvedpautil.resolveDpa)({
            region,
            mode: 'signed',
            customerLegalEntityName: input.customerLegalEntityName,
            signatory: {
                name: input.signatoryName,
                title: input.signatoryTitle
            },
            executedAt: executedAt.toISOString(),
            isSelfHosted: this.isSelfHosted()
        });
        const fileId = (0, _uuid.v4)();
        const [pdfBuffer, { workspaceCustomFlatApplication }] = await Promise.all([
            (0, _renderdpatopdfutil.renderDpaToPdfBuffer)(resolved),
            this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow({
                workspaceId: workspace.id
            })
        ]);
        await this.fileStorageService.writeFile({
            sourceFile: pdfBuffer,
            resourcePath: `${fileId}.pdf`,
            fileFolder: _types.FileFolder.Dpa,
            applicationUniversalIdentifier: workspaceCustomFlatApplication.universalIdentifier,
            workspaceId: workspace.id,
            fileId,
            settings: {
                isTemporaryFile: false,
                toDelete: false
            }
        });
        const agreement = await this.dpaAgreementRepository.save((0, _builddpaagreementrecordutil.buildDpaAgreementRecord)({
            workspaceId: workspace.id,
            type: _dpaagreementtypeenum.DpaAgreementType.SIGNED,
            region,
            acceptedAt: executedAt,
            acceptedByUserId: userId,
            acceptedByEmail: userEmail,
            customerLegalEntityName: input.customerLegalEntityName,
            signatoryName: input.signatoryName,
            signatoryTitle: input.signatoryTitle,
            signedFileId: fileId
        }));
        const downloadUrl = await this.fileUrlService.signFileByIdUrl({
            fileId,
            workspaceId: workspace.id,
            fileFolder: _types.FileFolder.Dpa
        });
        return {
            agreement,
            downloadUrl
        };
    }
    constructor(// eslint-disable-next-line twenty/prefer-workspace-scoped-repository
    dpaAgreementRepository, dpaRegionService, fileStorageService, fileUrlService, applicationService, twentyConfigService){
        this.dpaAgreementRepository = dpaAgreementRepository;
        this.dpaRegionService = dpaRegionService;
        this.fileStorageService = fileStorageService;
        this.fileUrlService = fileUrlService;
        this.applicationService = applicationService;
        this.twentyConfigService = twentyConfigService;
    }
};
DpaService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_dpaagreemententity.DpaAgreementEntity)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _dparegionservice.DpaRegionService === "undefined" ? Object : _dparegionservice.DpaRegionService,
        typeof _filestorageservice.FileStorageService === "undefined" ? Object : _filestorageservice.FileStorageService,
        typeof _fileurlservice.FileUrlService === "undefined" ? Object : _fileurlservice.FileUrlService,
        typeof _applicationservice.ApplicationService === "undefined" ? Object : _applicationservice.ApplicationService,
        typeof _twentyconfigservice.TwentyConfigService === "undefined" ? Object : _twentyconfigservice.TwentyConfigService
    ])
], DpaService);

//# sourceMappingURL=dpa.service.js.map