"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ActionToolProvider", {
    enumerable: true,
    get: function() {
        return ActionToolProvider;
    }
});
const _common = require("@nestjs/common");
const _constants = require("twenty-shared/constants");
const _utils = require("twenty-shared/utils");
const _actiontoollabelconstant = require("../constants/action-tool-label.constant");
const _i18nservice = require("../../i18n/i18n.service");
const _translatetoollabelutil = require("../utils/translate-tool-label.util");
const _toolsettodescriptorsutil = require("../utils/tool-set-to-descriptors.util");
const _ai = require("twenty-shared/ai");
const _totooljsonschemautil = require("../../record-crud/utils/to-tool-json-schema.util");
const _codeinterpreterservice = require("../../code-interpreter/code-interpreter.service");
const _createcalendareventtool = require("../../tool/tools/calendar-tool/create-calendar-event-tool");
const _codeinterpretertool = require("../../tool/tools/code-interpreter-tool/code-interpreter-tool");
const _draftemailtool = require("../../tool/tools/email-tool/draft-email-tool");
const _sendemailtool = require("../../tool/tools/email-tool/send-email-tool");
const _httptool = require("../../tool/tools/http-tool/http-tool");
const _navigateapptool = require("../../tool/tools/navigate-tool/navigate-app-tool");
const _extractjsonpathstool = require("../../tool/tools/output-navigation-tool/extract-json-paths-tool");
const _searchoutputtool = require("../../tool/tools/output-navigation-tool/search-output-tool");
const _searchhelpcentertool = require("../../tool/tools/search-help-center-tool/search-help-center-tool");
const _permissionsservice = require("../../../metadata-modules/permissions/permissions.service");
const _savecampaigntool = require("../../../../modules/emailing/tools/save-campaign-tool");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ActionToolProvider = class ActionToolProvider {
    async isAvailable(_context) {
        return true;
    }
    async generateDescriptors(context, options) {
        const includeSchemas = options?.includeSchemas ?? true;
        const descriptors = [];
        const hasHttpPermission = await this.permissionsService.hasToolPermission(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.HTTP_REQUEST_TOOL);
        if (hasHttpPermission) {
            descriptors.push(this.buildDescriptor('http_request', this.httpTool, includeSchemas, context.locale));
        }
        const hasEmailPermission = await this.permissionsService.hasToolPermission(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.SEND_EMAIL_TOOL);
        if (hasEmailPermission) {
            descriptors.push(this.buildDescriptor('send_email', this.sendEmailTool, includeSchemas, context.locale));
            descriptors.push(this.buildDescriptor('draft_email', this.draftEmailTool, includeSchemas, context.locale));
        }
        const hasCreateCalendarEventPermission = await this.permissionsService.hasToolPermission(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.CREATE_CALENDAR_EVENT_TOOL);
        if (hasCreateCalendarEventPermission) {
            descriptors.push(this.buildDescriptor('create_calendar_event', this.createCalendarEventTool, includeSchemas, context.locale));
        }
        descriptors.push(this.buildDescriptor('search_help_center', this.searchHelpCenterTool, includeSchemas, context.locale));
        descriptors.push(this.buildDescriptor('navigate_app', this.navigateAppTool, includeSchemas, context.locale));
        descriptors.push(this.buildDescriptor('extract_json_paths', this.extractJsonPathsTool, includeSchemas));
        descriptors.push(this.buildDescriptor('search_output', this.searchOutputTool, includeSchemas));
        descriptors.push(this.buildDescriptor('save_campaign', this.saveCampaignTool, includeSchemas, context.locale));
        const hasCodeInterpreterPermission = this.codeInterpreterService.isEnabled() && await this.permissionsService.hasToolPermission(context.rolePermissionConfig, context.workspaceId, _constants.PermissionFlagType.CODE_INTERPRETER_TOOL);
        if (hasCodeInterpreterPermission) {
            descriptors.push(this.buildDescriptor('code_interpreter', this.codeInterpreterTool, includeSchemas, context.locale));
        }
        return descriptors;
    }
    async executeStaticTool(toolName, args, context) {
        const tool = this.toolMap.get(toolName);
        if (!tool) {
            throw new Error(`Unknown action tool "${toolName}" (category: ${this.category})`);
        }
        return tool.execute(args, {
            workspaceId: context.workspaceId,
            userId: context.userId,
            userWorkspaceId: context.userWorkspaceId,
            threadId: context.threadId,
            onCodeExecutionUpdate: context.onCodeExecutionUpdate
        });
    }
    buildDescriptor(toolId, tool, includeSchemas, locale) {
        const labels = _actiontoollabelconstant.ACTION_TOOL_LABELS[toolId];
        return {
            name: toolId,
            label: (0, _utils.isDefined)(labels) ? (0, _translatetoollabelutil.translateToolLabel)(labels.label, this.i18nService, locale) : (0, _toolsettodescriptorsutil.humanizeToolName)(toolId),
            description: tool.description,
            category: _ai.ToolCategory.ACTION,
            icon: 'IconPlayerPlay',
            ...includeSchemas && {
                inputSchema: (0, _totooljsonschemautil.toToolJsonSchema)(tool.inputSchema)
            },
            executionRef: {
                kind: 'static',
                toolId
            }
        };
    }
    constructor(httpTool, sendEmailTool, draftEmailTool, createCalendarEventTool, searchHelpCenterTool, codeInterpreterTool, navigateAppTool, extractJsonPathsTool, searchOutputTool, saveCampaignTool, codeInterpreterService, permissionsService, i18nService){
        this.httpTool = httpTool;
        this.sendEmailTool = sendEmailTool;
        this.draftEmailTool = draftEmailTool;
        this.createCalendarEventTool = createCalendarEventTool;
        this.searchHelpCenterTool = searchHelpCenterTool;
        this.codeInterpreterTool = codeInterpreterTool;
        this.navigateAppTool = navigateAppTool;
        this.extractJsonPathsTool = extractJsonPathsTool;
        this.searchOutputTool = searchOutputTool;
        this.saveCampaignTool = saveCampaignTool;
        this.codeInterpreterService = codeInterpreterService;
        this.permissionsService = permissionsService;
        this.i18nService = i18nService;
        this.category = _ai.ToolCategory.ACTION;
        this.toolMap = new Map([
            [
                'http_request',
                this.httpTool
            ],
            [
                'send_email',
                this.sendEmailTool
            ],
            [
                'draft_email',
                this.draftEmailTool
            ],
            [
                'create_calendar_event',
                this.createCalendarEventTool
            ],
            [
                'search_help_center',
                this.searchHelpCenterTool
            ],
            [
                'code_interpreter',
                this.codeInterpreterTool
            ],
            [
                'navigate_app',
                this.navigateAppTool
            ],
            [
                'extract_json_paths',
                this.extractJsonPathsTool
            ],
            [
                'search_output',
                this.searchOutputTool
            ],
            [
                'save_campaign',
                this.saveCampaignTool
            ]
        ]);
    }
};
ActionToolProvider = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _httptool.HttpTool === "undefined" ? Object : _httptool.HttpTool,
        typeof _sendemailtool.SendEmailTool === "undefined" ? Object : _sendemailtool.SendEmailTool,
        typeof _draftemailtool.DraftEmailTool === "undefined" ? Object : _draftemailtool.DraftEmailTool,
        typeof _createcalendareventtool.CreateCalendarEventTool === "undefined" ? Object : _createcalendareventtool.CreateCalendarEventTool,
        typeof _searchhelpcentertool.SearchHelpCenterTool === "undefined" ? Object : _searchhelpcentertool.SearchHelpCenterTool,
        typeof _codeinterpretertool.CodeInterpreterTool === "undefined" ? Object : _codeinterpretertool.CodeInterpreterTool,
        typeof _navigateapptool.NavigateAppTool === "undefined" ? Object : _navigateapptool.NavigateAppTool,
        typeof _extractjsonpathstool.ExtractJsonPathsTool === "undefined" ? Object : _extractjsonpathstool.ExtractJsonPathsTool,
        typeof _searchoutputtool.SearchOutputTool === "undefined" ? Object : _searchoutputtool.SearchOutputTool,
        typeof _savecampaigntool.SaveCampaignTool === "undefined" ? Object : _savecampaigntool.SaveCampaignTool,
        typeof _codeinterpreterservice.CodeInterpreterService === "undefined" ? Object : _codeinterpreterservice.CodeInterpreterService,
        typeof _permissionsservice.PermissionsService === "undefined" ? Object : _permissionsservice.PermissionsService,
        typeof _i18nservice.I18nService === "undefined" ? Object : _i18nservice.I18nService
    ])
], ActionToolProvider);

//# sourceMappingURL=action-tool.provider.js.map