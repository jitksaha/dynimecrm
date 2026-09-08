import { v4 as e } from "uuid";
import { z as t } from "zod";
import { registerDecorator as n } from "class-validator";
//#region src/types/FieldMetadataType.ts
var r = /* @__PURE__ */ function(e) {
	return e.ACTOR = "ACTOR", e.ADDRESS = "ADDRESS", e.ARRAY = "ARRAY", e.BOOLEAN = "BOOLEAN", e.CURRENCY = "CURRENCY", e.DATE = "DATE", e.DATE_TIME = "DATE_TIME", e.EMAILS = "EMAILS", e.FILES = "FILES", e.FULL_NAME = "FULL_NAME", e.LINKS = "LINKS", e.MORPH_RELATION = "MORPH_RELATION", e.MULTI_SELECT = "MULTI_SELECT", e.NUMBER = "NUMBER", e.NUMERIC = "NUMERIC", e.PHONES = "PHONES", e.POSITION = "POSITION", e.RATING = "RATING", e.RAW_JSON = "RAW_JSON", e.RELATION = "RELATION", e.RICH_TEXT = "RICH_TEXT", e.SELECT = "SELECT", e.TEXT = "TEXT", e.TS_VECTOR = "TS_VECTOR", e.UUID = "UUID", e;
}({}), ee = [
	"addressStreet1",
	"addressStreet2",
	"addressCity",
	"addressState",
	"addressPostcode",
	"addressCountry",
	"addressLat",
	"addressLng"
], te = /* @__PURE__ */ function(e) {
	return e.MIN = "MIN", e.MAX = "MAX", e.AVG = "AVG", e.SUM = "SUM", e.COUNT = "COUNT", e.COUNT_UNIQUE_VALUES = "COUNT_UNIQUE_VALUES", e.COUNT_EMPTY = "COUNT_EMPTY", e.COUNT_NOT_EMPTY = "COUNT_NOT_EMPTY", e.COUNT_TRUE = "COUNT_TRUE", e.COUNT_FALSE = "COUNT_FALSE", e.PERCENTAGE_EMPTY = "PERCENTAGE_EMPTY", e.PERCENTAGE_NOT_EMPTY = "PERCENTAGE_NOT_EMPTY", e;
}({}), i = /* @__PURE__ */ function(e) {
	return e.AdminPanel = "admin-panel", e.App = "app", e.ApplicationRegistrationClaim = "application-registration-claim", e.Apps = "apps", e.Auth = "auth", e.ClientConfig = "client-config", e.Cloudflare = "cloudflare", e.Emailing = "emailing", e.File = "file", e.FileUpload = "file-upload", e.Files = "files", e.GraphQL = "graphql", e.Health = "healthz", e.Mcp = "mcp", e.Metadata = "metadata", e.OAuth = "oauth", e.OpenApi = "open-api", e.PublicAssets = "public-assets", e.Rest = "rest", e.RouteTrigger = "s", e.Webhooks = "webhooks", e.WellKnown = ".well-known", e;
}({}), a = /* @__PURE__ */ function(e) {
	return e.Settings = "/settings", e.Root = "/", e;
}({}), o = /* @__PURE__ */ function(e) {
	return e.Verify = "/verify", e.VerifyEmail = "/verify-email", e.SignInUp = "/welcome", e.Invite = "/invite/:workspaceInviteHash", e.ResetPassword = "/reset-password/:passwordResetToken", e.WorkspaceActivation = "/workspace-activation", e.CreateProfile = "/create/profile", e.SyncEmails = "/sync/emails", e.InstallApps = "/install-apps", e.InviteTeam = "/invite-team", e.PlanRequired = "/plan-required", e.PlanRequiredSuccess = "/plan-required/payment-success", e.BookCall = "/book-call", e.AiChat = "/chat/:threadId?", e.Index = "/", e.Home = "/home", e.TasksPage = "/objects/tasks", e.OpportunitiesPage = "/objects/opportunities", e.RecordIndexPage = "/objects/:objectNamePlural", e.RecordShowPage = "/object/:objectNameSingular/:objectRecordId", e.PageLayoutPage = "/page/:pageLayoutId", e.WorkflowCoreIndexPage = "/workflow-core", e.Settings = "settings", e.SettingsCatchAll = "/settings/*", e.Developers = "developers", e.DevelopersCatchAll = "/developers/*", e.Authorize = "/authorize", e.Dpa = "/dpa", e.NotFoundWildcard = "*", e.NotFound = "/not-found", e;
}({}), s = /* @__PURE__ */ function(e) {
	return e.WORKSPACE_MEMBER = "WORKSPACE_MEMBER", e.WORKSPACE = "WORKSPACE", e;
}({}), c = /* @__PURE__ */ function(e) {
	return e.AS_PARTICIPANT_AND_ORGANIZER = "AS_PARTICIPANT_AND_ORGANIZER", e.AS_PARTICIPANT = "AS_PARTICIPANT", e.AS_ORGANIZER = "AS_ORGANIZER", e.NONE = "NONE", e;
}({}), l = /* @__PURE__ */ function(e) {
	return e.PENDING_CONFIGURATION = "PENDING_CONFIGURATION", e.CALENDAR_EVENT_LIST_FETCH_PENDING = "CALENDAR_EVENT_LIST_FETCH_PENDING", e.CALENDAR_EVENT_LIST_FETCH_SCHEDULED = "CALENDAR_EVENT_LIST_FETCH_SCHEDULED", e.CALENDAR_EVENT_LIST_FETCH_ONGOING = "CALENDAR_EVENT_LIST_FETCH_ONGOING", e.CALENDAR_EVENTS_IMPORT_PENDING = "CALENDAR_EVENTS_IMPORT_PENDING", e.CALENDAR_EVENTS_IMPORT_SCHEDULED = "CALENDAR_EVENTS_IMPORT_SCHEDULED", e.CALENDAR_EVENTS_IMPORT_ONGOING = "CALENDAR_EVENTS_IMPORT_ONGOING", e.FAILED = "FAILED", e;
}({}), u = /* @__PURE__ */ function(e) {
	return e.NOT_SYNCED = "NOT_SYNCED", e.ONGOING = "ONGOING", e.ACTIVE = "ACTIVE", e.FAILED_INSUFFICIENT_PERMISSIONS = "FAILED_INSUFFICIENT_PERMISSIONS", e.FAILED_UNKNOWN = "FAILED_UNKNOWN", e;
}({}), d = /* @__PURE__ */ function(e) {
	return e.METADATA = "METADATA", e.SHARE_EVERYTHING = "SHARE_EVERYTHING", e;
}({}), f = /* @__PURE__ */ function(e) {
	return e.GLOBAL = "GLOBAL", e.GLOBAL_OBJECT_CONTEXT = "GLOBAL_OBJECT_CONTEXT", e.RECORD_SELECTION = "RECORD_SELECTION", e.FALLBACK = "FALLBACK", e;
}({}), p = /* @__PURE__ */ function(e) {
	return e.GLOBAL = "GLOBAL", e.INDEX_PAGE_BULK_SELECTION = "INDEX_PAGE_BULK_SELECTION", e.INDEX_PAGE_SINGLE_RECORD_SELECTION = "INDEX_PAGE_SINGLE_RECORD_SELECTION", e.INDEX_PAGE_NO_SELECTION = "INDEX_PAGE_NO_SELECTION", e.SHOW_PAGE = "SHOW_PAGE", e.PAGE_EDIT_MODE = "PAGE_EDIT_MODE", e;
}({}), m = /* @__PURE__ */ function(e) {
	return e.EMAIL = "EMAIL", e.CALENDAR = "CALENDAR", e.WORKFLOW = "WORKFLOW", e.AGENT = "AGENT", e.API = "API", e.IMPORT = "IMPORT", e.MANUAL = "MANUAL", e.SYSTEM = "SYSTEM", e.WEBHOOK = "WEBHOOK", e.APPLICATION = "APPLICATION", e;
}({}), h = {
	type: r.ACTOR,
	properties: [
		{
			name: "source",
			type: r.SELECT,
			hidden: !1,
			isRequired: !0,
			options: Object.keys(m).map((t, n) => ({
				id: e(),
				label: `${m[t].toLowerCase()}`,
				value: t,
				position: n
			}))
		},
		{
			name: "workspaceMemberId",
			type: r.UUID,
			hidden: "input",
			isRequired: !1
		},
		{
			name: "name",
			type: r.TEXT,
			hidden: "input",
			isRequired: !0
		},
		{
			name: "context",
			type: r.RAW_JSON,
			hidden: !1,
			isRequired: !1
		}
	]
}, g = {
	type: r.ADDRESS,
	properties: [
		{
			name: "addressStreet1",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressStreet2",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressCity",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressPostcode",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressState",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressCountry",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressLat",
			type: r.NUMERIC,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "addressLng",
			type: r.NUMERIC,
			hidden: !1,
			isRequired: !1
		}
	]
}, _ = {
	type: r.CURRENCY,
	properties: [{
		name: "amountMicros",
		type: r.NUMERIC,
		hidden: !1,
		isRequired: !1
	}, {
		name: "currencyCode",
		type: r.TEXT,
		hidden: !1,
		isRequired: !1
	}]
}, v = {
	type: r.EMAILS,
	properties: [{
		name: "primaryEmail",
		type: r.TEXT,
		hidden: !1,
		isRequired: !1,
		isIncludedInUniqueConstraint: !0
	}, {
		name: "additionalEmails",
		type: r.RAW_JSON,
		hidden: !1,
		isRequired: !1
	}]
}, y = {
	type: r.FULL_NAME,
	properties: [{
		name: "firstName",
		type: r.TEXT,
		hidden: !1,
		isRequired: !1,
		isIncludedInUniqueConstraint: !1
	}, {
		name: "lastName",
		type: r.TEXT,
		hidden: !1,
		isRequired: !1,
		isIncludedInUniqueConstraint: !1
	}]
}, b = {
	type: r.LINKS,
	properties: [
		{
			name: "primaryLinkLabel",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1
		},
		{
			name: "primaryLinkUrl",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1,
			isIncludedInUniqueConstraint: !0
		},
		{
			name: "secondaryLinks",
			type: r.RAW_JSON,
			hidden: !1,
			isRequired: !1
		}
	]
}, x = {
	type: r.PHONES,
	properties: [
		{
			name: "primaryPhoneNumber",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1,
			isIncludedInUniqueConstraint: !0
		},
		{
			name: "primaryPhoneCountryCode",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1,
			isIncludedInUniqueConstraint: !0
		},
		{
			name: "primaryPhoneCallingCode",
			type: r.TEXT,
			hidden: !1,
			isRequired: !1,
			isIncludedInUniqueConstraint: !0
		},
		{
			name: "additionalPhones",
			type: r.RAW_JSON,
			hidden: !1,
			isRequired: !1
		}
	]
}, S = {
	type: r.RICH_TEXT,
	properties: [{
		name: "blocknote",
		type: r.TEXT,
		hidden: !1,
		isRequired: !1
	}, {
		name: "markdown",
		type: r.TEXT,
		hidden: !1,
		isRequired: !1
	}]
}, C = t.object({
	blocknote: t.string().nullable().optional(),
	markdown: t.string().nullable()
}), w = new Map([
	[r.LINKS, b],
	[r.CURRENCY, _],
	[r.FULL_NAME, y],
	[r.ADDRESS, g],
	[r.ACTOR, h],
	[r.EMAILS, v],
	[r.PHONES, x],
	[r.RICH_TEXT, S]
]), T = /* @__PURE__ */ function(e) {
	return e.GOOGLE = "google", e.MICROSOFT = "microsoft", e.IMAP_SMTP_CALDAV = "imap_smtp_caldav", e.OIDC = "oidc", e.SAML = "saml", e.EMAIL_GROUP = "email_group", e.APP = "app", e;
}({}), E = /* @__PURE__ */ function(e) {
	return e.Index = "INDEX_PAGE", e.Record = "RECORD_PAGE", e.Standalone = "STANDALONE_PAGE", e.Settings = "SETTINGS_PAGE", e;
}({}), D = /* @__PURE__ */ function(e) {
	return e.Activity = "activity", e.ActivityTarget = "activityTarget", e.ApiKey = "apiKey", e.Attachment = "attachment", e.Blocklist = "blocklist", e.CalendarChannel = "calendarChannel", e.CalendarEvent = "calendarEvent", e.CalendarEventTarget = "calendarEventTarget", e.CallRecording = "callRecording", e.Comment = "comment", e.Company = "company", e.Dashboard = "dashboard", e.TimelineActivity = "timelineActivity", e.Message = "message", e.MessageCampaign = "messageCampaign", e.MessageChannel = "messageChannel", e.MessageList = "messageList", e.MessageParticipant = "messageParticipant", e.MessageFolder = "messageFolder", e.MessageThread = "messageThread", e.MessageThreadTarget = "messageThreadTarget", e.Note = "note", e.NoteTarget = "noteTarget", e.Opportunity = "opportunity", e.Person = "person", e.Task = "task", e.TaskTarget = "taskTarget", e.Webhook = "webhook", e.WorkspaceMember = "workspaceMember", e.MessageThreadSubscriber = "messageThreadSubscriber", e.Workflow = "workflow", e.MessageChannelMessageAssociation = "messageChannelMessageAssociation", e.WorkflowVersion = "workflowVersion", e.WorkflowRun = "workflowRun", e;
}({}), O = /* @__PURE__ */ function(e) {
	return e.CREATE = "CREATE", e.UPDATE = "UPDATE", e.DELETE = "DELETE", e.RESTORE = "RESTORE", e.DESTROY = "DESTROY", e;
}({}), k = /* @__PURE__ */ function(e) {
	return e.WORKSPACE_EVENT = "WORKSPACE_EVENT", e.PAGEVIEW = "PAGEVIEW", e.OBJECT_EVENT = "OBJECT_EVENT", e.USAGE_EVENT = "USAGE_EVENT", e.APPLICATION_LOG = "APPLICATION_LOG", e;
}({}), A = /* @__PURE__ */ function(e) {
	return e.IS_APP_CLAIMING_ENABLED = "IS_APP_CLAIMING_ENABLED", e.IS_UNIQUE_INDEXES_ENABLED = "IS_UNIQUE_INDEXES_ENABLED", e.IS_JSON_FILTER_ENABLED = "IS_JSON_FILTER_ENABLED", e.IS_EMAIL_GROUP_ENABLED = "IS_EMAIL_GROUP_ENABLED", e.IS_JUNCTION_RELATIONS_ENABLED = "IS_JUNCTION_RELATIONS_ENABLED", e.IS_REST_METADATA_API_NEW_FORMAT_DIRECT = "IS_REST_METADATA_API_NEW_FORMAT_DIRECT", e.IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED = "IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED", e.IS_WORKFLOW_VERSION_IN_CORE_ENABLED = "IS_WORKFLOW_VERSION_IN_CORE_ENABLED", e.IS_WORKFLOW_CORE_INDEX_PAGE_ENABLED = "IS_WORKFLOW_CORE_INDEX_PAGE_ENABLED", e.IS_WORKFLOW_DISPATCH_FROM_CORE_ENABLED = "IS_WORKFLOW_DISPATCH_FROM_CORE_ENABLED", e.IS_API_RATE_LIMIT_V2_ENABLED = "IS_API_RATE_LIMIT_V2_ENABLED", e.IS_MESSAGE_CALENDAR_TARGET_READ_ENABLED = "IS_MESSAGE_CALENDAR_TARGET_READ_ENABLED", e;
}({}), j = {
	UUID: "uuid",
	NOW: "now"
}, M = [
	r.RELATION,
	r.MORPH_RELATION,
	r.FILES,
	r.TS_VECTOR
], N = (e) => !M.includes(e), P = /* @__PURE__ */ function(e) {
	return e.COPY = "COPY", e.OPEN_LINK = "OPEN_LINK", e.OPEN_IN_APP = "OPEN_IN_APP", e;
}({}), F = class {}, I = class extends F {}, L = /* @__PURE__ */ function(e) {
	return e.FLOAT = "float", e.INT = "int", e.BIGINT = "bigint", e;
}({}), R = /* @__PURE__ */ function(e) {
	return e.RELATIVE = "RELATIVE", e.USER_SETTINGS = "USER_SETTINGS", e.CUSTOM = "CUSTOM", e;
}({}), z = ["url", "domain"], B = {
	ARCHIVE: "ARCHIVE",
	AUDIO: "AUDIO",
	IMAGE: "IMAGE",
	PRESENTATION: "PRESENTATION",
	SPREADSHEET: "SPREADSHEET",
	TEXT_DOCUMENT: "TEXT_DOCUMENT",
	VIDEO: "VIDEO",
	OTHER: "OTHER"
}, V = /* @__PURE__ */ function(e) {
	return e.CorePicture = "core-picture", e.AgentChat = "agent-chat", e.BuiltLogicFunction = "built-logic-function", e.BuiltFrontComponent = "built-front-component", e.PublicAsset = "public-asset", e.Source = "source", e.FilesField = "files-field", e.Dependencies = "dependencies", e.Workflow = "workflow", e.EmailAttachment = "email-attachment", e.EmailImage = "email-image", e.AppTarball = "app-tarball", e.GeneratedSdkClient = "generated-sdk-client", e.Dpa = "dpa", e;
}({}), H = [
	"TEXT",
	"PHONES",
	"EMAILS",
	"DATE_TIME",
	"DATE",
	"NUMBER",
	"CURRENCY",
	"FULL_NAME",
	"LINKS",
	"RELATION",
	"ADDRESS",
	"SELECT",
	"RATING",
	"MULTI_SELECT",
	"ACTOR",
	"ARRAY",
	"RAW_JSON",
	"FILES",
	"BOOLEAN",
	"UUID"
], U = /* @__PURE__ */ function(e) {
	return e.MONDAY = "MONDAY", e.SUNDAY = "SUNDAY", e.SATURDAY = "SATURDAY", e;
}({}), W = /* @__PURE__ */ function(e) {
	return e.GET = "GET", e.POST = "POST", e.PUT = "PUT", e.PATCH = "PATCH", e.DELETE = "DELETE", e;
}({}), G = /* @__PURE__ */ function(e) {
	return e.BTREE = "BTREE", e.GIN = "GIN", e;
}({}), K = "__twentyHttpResponse", q = (e) => typeof e == "number" && Number.isInteger(e) && e >= 100 && e <= 599, J = (e) => typeof e == "object" && !!e && !Array.isArray(e) && Object.values(e).every((e) => typeof e == "string"), Y = (e) => {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.__twentyHttpResponse === !0 && (t.status === void 0 || q(t.status)) && (t.headers === void 0 || J(t.headers));
}, X = /* @__PURE__ */ function(e) {
	return e.DRAFT = "DRAFT", e.SCHEDULED = "SCHEDULED", e.SENDING = "SENDING", e.SENT = "SENT", e.SENT_WITH_ERRORS = "SENT_WITH_ERRORS", e.CANCELED = "CANCELED", e;
}({}), Z = /* @__PURE__ */ function(e) {
	return e.SENT_AND_RECEIVED = "SENT_AND_RECEIVED", e.SENT = "SENT", e.NONE = "NONE", e;
}({}), Q = /* @__PURE__ */ function(e) {
	return e.GROUP_EMAILS_DELETION = "GROUP_EMAILS_DELETION", e.GROUP_EMAILS_IMPORT = "GROUP_EMAILS_IMPORT", e.NONE = "NONE", e;
}({}), ne = /* @__PURE__ */ function(e) {
	return e.PENDING_CONFIGURATION = "PENDING_CONFIGURATION", e.MESSAGE_LIST_FETCH_PENDING = "MESSAGE_LIST_FETCH_PENDING", e.MESSAGE_LIST_FETCH_SCHEDULED = "MESSAGE_LIST_FETCH_SCHEDULED", e.MESSAGE_LIST_FETCH_ONGOING = "MESSAGE_LIST_FETCH_ONGOING", e.MESSAGES_IMPORT_PENDING = "MESSAGES_IMPORT_PENDING", e.MESSAGES_IMPORT_SCHEDULED = "MESSAGES_IMPORT_SCHEDULED", e.MESSAGES_IMPORT_ONGOING = "MESSAGES_IMPORT_ONGOING", e.FAILED = "FAILED", e;
}({}), re = /* @__PURE__ */ function(e) {
	return e.NOT_SYNCED = "NOT_SYNCED", e.ONGOING = "ONGOING", e.ACTIVE = "ACTIVE", e.FAILED_INSUFFICIENT_PERMISSIONS = "FAILED_INSUFFICIENT_PERMISSIONS", e.FAILED_UNKNOWN = "FAILED_UNKNOWN", e;
}({}), ie = /* @__PURE__ */ function(e) {
	return e.EMAIL = "EMAIL", e.SMS = "SMS", e.EMAIL_GROUP = "EMAIL_GROUP", e;
}({}), ae = /* @__PURE__ */ function(e) {
	return e.METADATA = "METADATA", e.SUBJECT = "SUBJECT", e.SHARE_EVERYTHING = "SHARE_EVERYTHING", e;
}({}), oe = /* @__PURE__ */ function(e) {
	return e.ALL_FOLDERS = "ALL_FOLDERS", e.SELECTED_FOLDERS = "SELECTED_FOLDERS", e;
}({}), se = /* @__PURE__ */ function(e) {
	return e.FOLDER_DELETION = "FOLDER_DELETION", e.FOLDER_IMPORT = "FOLDER_IMPORT", e.NONE = "NONE", e;
}({}), ce = /* @__PURE__ */ function(e) {
	return e.FROM = "FROM", e.TO = "TO", e.CC = "CC", e.BCC = "BCC", e.REPLY_TO = "REPLY_TO", e;
}({}), le = /* @__PURE__ */ function(e) {
	return e.OPEN = "OPEN", e.APPLICATION = "APPLICATION", e.SYSTEM = "SYSTEM", e;
}({}), ue = /* @__PURE__ */ function(e) {
	return e.VIEW = "VIEW", e.FOLDER = "FOLDER", e.LINK = "LINK", e.OBJECT = "OBJECT", e.RECORD = "RECORD", e.PAGE_LAYOUT = "PAGE_LAYOUT", e;
}({}), de = /* @__PURE__ */ function(e) {
	return e.SIDE_PANEL = "SIDE_PANEL", e.RECORD_PAGE = "RECORD_PAGE", e.USER_CHOICE = "USER_CHOICE", e;
}({}), fe = /* @__PURE__ */ function(e) {
	return e.AscNullsFirst = "AscNullsFirst", e.AscNullsLast = "AscNullsLast", e.DescNullsFirst = "DescNullsFirst", e.DescNullsLast = "DescNullsLast", e;
}({}), pe = /* @__PURE__ */ function(e) {
	return e.DAY = "DAY", e.MONTH = "MONTH", e.QUARTER = "QUARTER", e.YEAR = "YEAR", e.WEEK = "WEEK", e.DAY_OF_THE_WEEK = "DAY_OF_THE_WEEK", e.MONTH_OF_THE_YEAR = "MONTH_OF_THE_YEAR", e.QUARTER_OF_THE_YEAR = "QUARTER_OF_THE_YEAR", e.NONE = "NONE", e;
}({}), me = /* @__PURE__ */ function(e) {
	return e.SIDE_PANEL = "SIDE_PANEL", e.RECORD_PAGE = "RECORD_PAGE", e;
}({}), he = [
	"AGGREGATE_CHART",
	"PIE_CHART",
	"BAR_CHART",
	"LINE_CHART"
], ge = /* @__PURE__ */ function(e) {
	return e.GRID = "GRID", e.VERTICAL_LIST = "VERTICAL_LIST", e.CANVAS = "CANVAS", e;
}({}), _e = /* @__PURE__ */ function(e) {
	return e.RECORD_INDEX = "RECORD_INDEX", e.RECORD_PAGE = "RECORD_PAGE", e.DASHBOARD = "DASHBOARD", e.STANDALONE_PAGE = "STANDALONE_PAGE", e.RECORD_FORM = "RECORD_FORM", e;
}({}), ve = /* @__PURE__ */ function(e) {
	return e.VIEW = "VIEW", e.IFRAME = "IFRAME", e.FIELD = "FIELD", e.FIELDS = "FIELDS", e.GRAPH = "GRAPH", e.STANDALONE_RICH_TEXT = "STANDALONE_RICH_TEXT", e.TIMELINE = "TIMELINE", e.TASKS = "TASKS", e.NOTES = "NOTES", e.FILES = "FILES", e.EMAILS = "EMAILS", e.CALENDAR = "CALENDAR", e.FIELD_RICH_TEXT = "FIELD_RICH_TEXT", e.WORKFLOW = "WORKFLOW", e.WORKFLOW_VERSION = "WORKFLOW_VERSION", e.WORKFLOW_RUN = "WORKFLOW_RUN", e.FRONT_COMPONENT = "FRONT_COMPONENT", e.RECORD_TABLE = "RECORD_TABLE", e.EMAIL_THREAD = "EMAIL_THREAD", e.CALL_RECORDING_SUMMARY = "CALL_RECORDING_SUMMARY", e.CALL_RECORDING_TRANSCRIPT = "CALL_RECORDING_TRANSCRIPT", e.MESSAGE_CAMPAIGN_BODY = "MESSAGE_CAMPAIGN_BODY", e.MESSAGE_CAMPAIGN_DETAILS = "MESSAGE_CAMPAIGN_DETAILS", e.FORM_FIELD = "FORM_FIELD", e;
}({}), ye = /* @__PURE__ */ function(e) {
	return e.AND = "AND", e.OR = "OR", e;
}({}), be = /* @__PURE__ */ function(e) {
	return e.CASCADE = "CASCADE", e.RESTRICT = "RESTRICT", e.SET_NULL = "SET_NULL", e.NO_ACTION = "NO_ACTION", e;
}({}), xe = /* @__PURE__ */ function(e) {
	return e.MANY_TO_ONE = "MANY_TO_ONE", e.ONE_TO_MANY = "ONE_TO_MANY", e;
}({}), Se = /* @__PURE__ */ function(e) {
	return e.AND = "AND", e.OR = "OR", e;
}({}), Ce = /* @__PURE__ */ function(e) {
	return e.IS = "IS", e.IS_NOT_NULL = "IS_NOT_NULL", e.IS_NOT = "IS_NOT", e.LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL", e.GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL", e.IS_BEFORE = "IS_BEFORE", e.IS_AFTER = "IS_AFTER", e.CONTAINS = "CONTAINS", e.DOES_NOT_CONTAIN = "DOES_NOT_CONTAIN", e.IS_EMPTY = "IS_EMPTY", e.IS_NOT_EMPTY = "IS_NOT_EMPTY", e.IS_RELATIVE = "IS_RELATIVE", e.IS_IN_PAST = "IS_IN_PAST", e.IS_IN_FUTURE = "IS_IN_FUTURE", e.IS_TODAY = "IS_TODAY", e.VECTOR_SEARCH = "VECTOR_SEARCH", e;
}({}), we = "__SerializedRelationBrand__", Te = /* @__PURE__ */ function(e) {
	return e.ApplicationRegistration = "application-registration", e;
}({}), Ee = /* @__PURE__ */ function(e) {
	return e.ProfilePage = "profile", e.TwoFactorAuthenticationStrategyConfig = "profile/two-factor-authentication/:twoFactorAuthenticationStrategy", e.Experience = "experience", e.Accounts = "accounts", e.NewAccount = "accounts/new", e.AccountsConfiguration = "accounts/configuration/:connectedAccountId", e.AccountsCalendars = "accounts/calendars", e.AccountsEmails = "accounts/emails", e.NewImapSmtpCaldavConnection = "accounts/new-imap-smtp-caldav-connection", e.EditImapSmtpCaldavConnection = "accounts/edit-imap-smtp-caldav-connection/:connectedAccountId", e.Billing = "billing", e.BillingPlans = "billing/plans", e.Usage = "billing/usage", e.UsageUserDetail = "billing/usage/user/:userWorkspaceId", e.Enterprise = "enterprise", e.Objects = "objects", e.ObjectOverview = "objects/overview", e.ObjectDetail = "objects/:objectNamePlural", e.ObjectNewFieldSelect = "objects/:objectNamePlural/new-field/select", e.ObjectNewFieldConfigure = "objects/:objectNamePlural/new-field/configure", e.ObjectNewIndex = "objects/:objectNamePlural/new-index", e.ObjectFieldEdit = "objects/:objectNamePlural/:fieldName", e.NewObject = "objects/new", e.Layout = "layout", e.WorkspaceMembersPage = "members", e.WorkspaceMemberPage = "members/:workspaceMemberId", e.General = "general", e.Subdomain = "general/subdomain", e.CustomDomain = "general/custom-domain", e.WorkspaceCommunications = "communications", e.EmailGroupChannelDetail = "email/email-group/:messageChannelId", e.NewEmailGroupChannel = "email/new-email-group", e.NewUnsubscribeTopic = "email/new-unsubscribe-topic", e.UnsubscribeTopicDetail = "email/unsubscribe-topic/:unsubscribeTopicId", e.Unsubscribe = "communications/unsubscribe", e.PublicDomain = "applications/public-domain", e.NewApprovedAccessDomain = "security/approved-access-domain/new", e.Community = "community", e.AI = "ai", e.AiUsageUserDetail = "ai/usage/user/:userWorkspaceId", e.AiPrompts = "ai/prompts", e.AiNewAgent = "ai/new-agent", e.AiAgentDetail = "ai/agents/:agentId", e.AiAgentTurnDetail = "ai/agents/:agentId/turns/:turnId", e.AiNewSkill = "ai/new-skill", e.AiSkillDetail = "ai/skills/:skillId", e.AiToolDetail = "ai/tools/:toolIdentifier", e.Applications = "applications", e.ApplicationDetail = "applications/:applicationId", e.ApplicationConnectionDetail = "applications/:applicationId/connections/:connectedAccountId", e.ApplicationLogicFunctionDetail = "applications/:applicationId/logicFunctions/:logicFunctionId", e.ApplicationFrontComponentDetail = "applications/:applicationId/frontComponents/:frontComponentId", e.ApplicationCommandMenuItemDetail = "applications/:applicationId/commandMenuItems/:commandMenuItemId", e.ApplicationTimelineActivityTypeDetail = "applications/:applicationId/timelineActivityTypes/:timelineActivityTypeId", e.ApplicationViewDetail = "applications/:applicationId/views/:viewUniversalIdentifier", e.ApplicationPageLayoutDetail = "applications/:applicationId/pageLayouts/:pageLayoutUniversalIdentifier", e.AvailableApplicationDetail = "applications/available/:availableApplicationId", e.ApplicationRegistrationDetail = "applications/registrations/:applicationRegistrationId", e.LogicFunctions = "functions", e.NewLogicFunction = "functions/new", e.LogicFunctionDetail = "functions/:logicFunctionId", e.ApiWebhooks = "mcp-apis", e.RestPlayground = "playground/rest/:schema", e.GraphQLPlayground = "playground/graphql/:schema", e.NewApiKey = "mcp-apis/apis/new", e.ApiKeyDetail = "mcp-apis/apis/:apiKeyId", e.NewWebhook = "mcp-apis/webhooks/new", e.WebhookDetail = "mcp-apis/webhooks/:webhookId", e.Integrations = "integrations", e.Security = "general#security", e.Logs = "general#logs", e.NewSSOIdentityProvider = "security/sso/new", e.AdminPanel = "admin-panel", e.AdminPanelEnterprise = "admin-panel#enterprise", e.AdminPanelHealthStatus = "admin-panel#health-status", e.AdminPanelIndicatorHealthStatus = "admin-panel/health-status/:indicatorId", e.AdminPanelInferredVersion = "admin-panel/health-status/inferred-version", e.AdminPanelInstanceStatus = "admin-panel/health-status/instance-status", e.AdminPanelWorkspacesStatus = "admin-panel/health-status/workspaces-status", e.AdminPanelQueueDetail = "admin-panel/health-status/queue/:queueName", e.AdminPanelConfigVariableDetails = "admin-panel/config-variables/:variableName", e.AdminPanelNewAiProvider = "admin-panel/ai/new-provider", e.AdminPanelAiProviderDetail = "admin-panel/ai/providers/:providerName", e.AdminPanelNewAiModel = "admin-panel/ai/providers/:providerName/new-model", e.AdminPanelUserDetail = "admin-panel/users/:userId", e.AdminPanelWorkspaceDetail = "admin-panel/workspaces/:workspaceId", e.AdminPanelApplicationRegistrationDetail = "admin-panel/applications/registrations/:applicationRegistrationId", e.AdminPanelWorkspaceChatThread = "admin-panel/workspaces/:workspaceId/threads/:threadId", e.AdminPanelChats = "admin-panel/chats", e.Roles = "members/roles", e.RoleCreate = "members/roles/create", e.RoleDetail = "members/roles/:roleId", e.RoleObjectLevel = "members/roles/:roleId/object/:objectMetadataId", e.RoleAddObjectLevel = "members/roles/:roleId/add-object-permission", e.Legal = "legal", e.LegalDpa = "legal/dpa", e.LegalDpaNew = "legal/dpa/new", e;
}({}), De = /* @__PURE__ */ function(e) {
	return e.CommandMenuDisplay = "command-menu-display", e.ViewRecord = "view-record", e.ViewRecords = "view-records", e.MergeRecords = "merge-records", e.UpdateRecords = "update-records", e.EditRichText = "edit-rich-text", e.Copilot = "copilot", e.WorkflowTriggerSelectType = "workflow-trigger-select-type", e.WorkflowStepCreate = "workflow-step-create", e.WorkflowStepEditType = "workflow-step-edit-type", e.WorkflowStepView = "workflow-step-view", e.WorkflowStepEdit = "workflow-step-edit", e.WorkflowRunStepView = "workflow-run-step-view", e.SearchRecords = "search-records", e.AskAI = "ask-ai", e.PageLayoutDashboardWidgetTypeSelect = "page-layout-dashboard-widget-type-select", e.PageLayoutTabSettings = "page-layout-tab-settings", e.PageLayoutWidgetSettings = "page-layout-widget-settings", e.DashboardChartSettings = "dashboard-chart-settings", e.DashboardIframeSettings = "dashboard-iframe-settings", e.DashboardRecordTableSettings = "dashboard-record-table-settings", e.RecordPageFieldsSettings = "record-page-fields-settings", e.RecordPageFieldSettings = "record-page-field-settings", e.ViewFrontComponent = "view-front-component", e.NavigationMenuItemEdit = "navigation-menu-item-edit", e.NavigationMenuAddItem = "navigation-menu-add-item", e.CommandMenuEdit = "command-menu-edit", e.PageLayoutRecordPageWidgetTypeSelect = "page-layout-record-page-widget-type-select", e.ComposeEmail = "compose-email", e.ComposeCalendarEvent = "compose-calendar-event", e.CreateRelatedRecord = "create-related-record", e.SendCampaignTest = "send-campaign-test", e.EmailBlockSettings = "email-block-settings", e.SettingsMetadataTranslations = "settings-metadata-translations", e.RoutedPage = "routed-page", e.WorkflowCoreFilters = "workflow-core-filters", e;
}({}), Oe = /* @__PURE__ */ function(e) {
	return e.AND = "AND", e.OR = "OR", e;
}({}), ke = /* @__PURE__ */ function(e) {
	return e.TOTP = "TOTP", e;
}({}), Ae = /* @__PURE__ */ function(e) {
	return e.UP_TO_DATE = "UP_TO_DATE", e.BEHIND = "BEHIND", e.FAILED = "FAILED", e;
}({}), $ = /^[_A-Za-z][_0-9A-Za-z]*$/, je = (e) => (t, r) => {
	n({
		name: "isValidGraphQLEnumName",
		target: t.constructor,
		propertyName: r,
		options: e,
		validator: {
			validate: (e) => typeof e == "string" && $.test(e),
			defaultMessage: (e) => `${e.property} must match the ${$} format`
		}
	});
}, Me = /* @__PURE__ */ function(e) {
	return e.DAY = "DAY", e.WEEK = "WEEK", e.MONTH = "MONTH", e;
}({}), Ne = /* @__PURE__ */ function(e) {
	return e.AND = "AND", e.OR = "OR", e.NOT = "NOT", e;
}({}), Pe = /* @__PURE__ */ function(e) {
	return e.IS = "IS", e.IS_NOT_NULL = "IS_NOT_NULL", e.IS_NOT = "IS_NOT", e.LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL", e.GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL", e.IS_BEFORE = "IS_BEFORE", e.IS_AFTER = "IS_AFTER", e.CONTAINS = "CONTAINS", e.DOES_NOT_CONTAIN = "DOES_NOT_CONTAIN", e.IS_EMPTY = "IS_EMPTY", e.IS_NOT_EMPTY = "IS_NOT_EMPTY", e.IS_RELATIVE = "IS_RELATIVE", e.IS_IN_PAST = "IS_IN_PAST", e.IS_IN_FUTURE = "IS_IN_FUTURE", e.IS_TODAY = "IS_TODAY", e.VECTOR_SEARCH = "VECTOR_SEARCH", e;
}({}), Fe = /* @__PURE__ */ function(e) {
	return e.Is = "is", e.IsNotNull = "isNotNull", e.IsNot = "isNot", e.LessThanOrEqual = "lessThan", e.GreaterThanOrEqual = "greaterThan", e.IsBefore = "isBefore", e.IsAfter = "isAfter", e.Contains = "contains", e.DoesNotContain = "doesNotContain", e.IsEmpty = "isEmpty", e.IsNotEmpty = "isNotEmpty", e.IsRelative = "isRelative", e.IsInPast = "isInPast", e.IsInFuture = "isInFuture", e.IsToday = "isToday", e;
}({}), Ie = /* @__PURE__ */ function(e) {
	return e.INDEX = "INDEX", e;
}({}), Le = /* @__PURE__ */ function(e) {
	return e.SIDE_PANEL = "SIDE_PANEL", e.RECORD_PAGE = "RECORD_PAGE", e;
}({}), Re = /* @__PURE__ */ function(e) {
	return e.ASC = "ASC", e.DESC = "DESC", e;
}({}), ze = /* @__PURE__ */ function(e) {
	return e.TABLE = "TABLE", e.KANBAN = "KANBAN", e.CALENDAR = "CALENDAR", e.LIST = "LIST", e.FIELDS_WIDGET = "FIELDS_WIDGET", e.TABLE_WIDGET = "TABLE_WIDGET", e.KANBAN_WIDGET = "KANBAN_WIDGET", e.LIST_WIDGET = "LIST_WIDGET", e.CALENDAR_WIDGET = "CALENDAR_WIDGET", e;
}({}), Be = /* @__PURE__ */ function(e) {
	return e.WORKSPACE = "WORKSPACE", e.UNLISTED = "UNLISTED", e;
}({}), Ve = /* @__PURE__ */ function(e) {
	return e.MESSAGING = "messaging", e.CALENDAR = "calendar", e;
}({}), He = /* @__PURE__ */ function(e) {
	return e.PENDING = "PENDING", e.ACTIVE = "ACTIVE", e.FAILED = "FAILED", e.EXPIRED = "EXPIRED", e;
}({});
//#endregion
export { R as $, pe as A, c as At, re as B, be as C, m as Ct, ge as D, d as Dt, _e as E, f as Et, ce as F, te as Ft, K as G, Q as H, se as I, ee as It, W as J, Y as K, oe as L, r as Lt, de as M, o as Mt, ue as N, a as Nt, he as O, u as Ot, le as P, i as Pt, B as Q, ae as R, xe as S, g as St, ve as T, p as Tt, Z as U, ne as V, X as W, H as X, U as Y, V as Z, Ee as _, x as _t, Re as a, M as at, Ce as b, v as bt, Fe as c, A as ct, Me as d, D as dt, z as et, je as f, E as ft, De as g, C as gt, Oe as h, S as ht, ze as i, P as it, fe as j, s as jt, me as k, l as kt, Pe as l, k as lt, ke as m, w as mt, Ve as n, I as nt, Le as o, j as ot, Ae as p, T as pt, G as q, Be as r, F as rt, Ie as s, N as st, He as t, L as tt, Ne as u, O as ut, Te as v, b as vt, ye as w, h as wt, Se as x, _ as xt, we as y, y as yt, ie as z };
