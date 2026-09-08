import { t as e } from "./isDefined-Dtu5EYqP.mjs";
import { t } from "./format-record-reference.util-Bj0YDbrL.mjs";
import { getToolName as n, isToolUIPart as r } from "ai";
//#region src/ai/constants/ai-sdk-package-labels.const.ts
var i = {
	"@ai-sdk/openai": "OpenAI",
	"@ai-sdk/anthropic": "Anthropic",
	"@ai-sdk/google": "Google",
	"@ai-sdk/mistral": "Mistral",
	"@ai-sdk/xai": "xAI",
	"@ai-sdk/amazon-bedrock": "AWS Bedrock",
	"@ai-sdk/openai-compatible": "OpenAI-Compatible",
	"@ai-sdk/azure": "Azure OpenAI"
}, a = [
	"@ai-sdk/openai",
	"@ai-sdk/anthropic",
	"@ai-sdk/google",
	"@ai-sdk/mistral",
	"@ai-sdk/xai",
	"@ai-sdk/amazon-bedrock",
	"@ai-sdk/openai-compatible",
	"@ai-sdk/azure"
], o = "ask_questions", s = "complete_workspace_setup", c = [
	"us",
	"eu",
	"global",
	"uk",
	"ap",
	"jp",
	"au",
	"ca",
	"de",
	"fr"
], l = [
	"find_many",
	"find_one",
	"group_by",
	"create_one",
	"create_many",
	"update_one",
	"update_many",
	"upsert_many",
	"delete_one",
	"delete_many"
], u = [
	"openai",
	"anthropic",
	"google",
	"mistral",
	"xai"
], d = /* @__PURE__ */ function(e) {
	return e.DATABASE_CRUD = "DATABASE_CRUD", e.ACTION = "ACTION", e.WORKFLOW = "WORKFLOW", e.METADATA = "METADATA", e.VIEW = "VIEW", e.DASHBOARD = "DASHBOARD", e.NAVIGATION_MENU_ITEM = "NAVIGATION_MENU_ITEM", e.WEBHOOK = "WEBHOOK", e.LOGIC_FUNCTION = "LOGIC_FUNCTION", e.ROLE = "ROLE", e;
}({}), f = (t) => t.type === "file" && e(t.fileId) && e(t.url) && e(t.mediaType), p = (e) => u.includes(e) ? `@ai-sdk/${e}` : "@ai-sdk/openai-compatible", m = (e) => a.includes(e), h = (e) => r(e) && n(e) === "complete_workspace_setup", g = (e) => c.includes(e), _ = (e) => {
	if (!h(e)) return !1;
	let t = e.output;
	return typeof t == "object" && !!t && "success" in t && t.success === !0;
}, v = /^[a-zA-Z0-9_.-]{1,64}$/, y = (e) => v.test(e);
//#endregion
export { a as AI_SDK_PACKAGES, i as AI_SDK_PACKAGE_LABELS, o as ASK_QUESTIONS_TOOL_NAME, s as COMPLETE_WORKSPACE_SETUP_TOOL_NAME, l as DATABASE_CRUD_OPERATIONS, c as DATA_RESIDENCY_KEYS, u as NATIVE_AI_SDK_PROVIDER_IDS, d as ToolCategory, t as formatRecordReference, p as inferAiSdkPackage, m as isAiSdkPackage, h as isCompleteWorkspaceSetupToolPart, g as isDataResidency, f as isExtendedFileUIPart, _ as isSucceededCompleteWorkspaceSetupToolPart, y as isValidAgentResponseSchemaPropertyKey };
