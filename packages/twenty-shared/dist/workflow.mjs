import { t as e } from "./isDefined-Dtu5EYqP.mjs";
import { Lt as t, c as n, h as r, l as i } from "./types-BVPyJxl2.mjs";
import { t as a } from "./is-record-object-schema-CwzshFdt.mjs";
import { M as o, Ti as s } from "./utils-wA24uq8M.mjs";
import { isNonEmptyArray as c, isObject as l, isString as u } from "@sniptt/guards";
import { z as d } from "zod";
import { isBoolean as f, isObject as p, isString as ee } from "class-validator";
import te from "@dagrejs/dagre";
//#region src/workflow/constants/CaptureAllVariableTagInnerRegex.ts
var m = /{{([^{}]+)}}/g, ne = {
	rawJson: "application/json",
	formData: "multipart/form-data",
	keyValue: "application/x-www-form-urlencoded",
	text: "text/plain",
	none: ""
}, re = {
	IF: {
		x: -200,
		y: 120
	},
	ELSE: {
		x: 200,
		y: 120
	}
}, ie = [
	"workflow",
	"workflowVersion",
	"workflowRun",
	"workflowAutomatedTrigger",
	"workspaceMember",
	"dashboard",
	"message",
	"messageThread",
	"messageChannelMessageAssociation",
	"messageParticipant",
	"calendarEvent",
	"calendarEventParticipant",
	"calendarChannelEventAssociation"
], h = "trigger", ae = "metadata", oe = "Metadata", se = "workspaceMemberId", ce = "Workspace Member Id", le = "payload", ue = "Record", de = "Records", fe = {
	width: 240,
	height: 52
}, pe = {
	ranksep: 80,
	nodesep: 200,
	rankdir: "TB"
}, me = ({ nodes: e, edges: t, options: n = pe }) => {
	let r = new te.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
	r.setGraph({
		ranksep: n.ranksep,
		nodesep: n.nodesep,
		rankdir: n.rankdir
	});
	let i = new Set(e.map((e) => e.id));
	return e.forEach((e) => r.setNode(e.id, {
		width: e.width,
		height: e.height
	})), t.forEach((e) => {
		i.has(e.source) && i.has(e.target) && r.setEdge(e.source, e.target);
	}), te.layout(r), e.map((e) => {
		let t = r.node(e.id);
		return {
			id: e.id,
			centerPosition: {
				x: t.x,
				y: t.y
			}
		};
	});
}, g = d.object({
	input: d.looseObject({}).describe("Input data for the workflow action. Structure depends on the action type."),
	outputSchema: d.looseObject({}).describe("Schema defining the output data structure. This data can be referenced in subsequent steps using {{stepId.fieldName}}."),
	errorHandlingOptions: d.object({
		retryOnFailure: d.object({ value: d.boolean().describe("Whether to retry the action if it fails.") }),
		continueOnFailure: d.object({ value: d.boolean().describe("Whether to continue to the next step if this action fails.") })
	})
}), he = g.extend({ input: d.object({
	agentId: d.string().optional(),
	prompt: d.string().optional()
}) }), _ = d.object({
	id: d.uuid().describe("Unique UUID identifier for the workflow step. Must be a valid UUID v4, unique within the workflow."),
	name: d.string().describe("Human-readable name for the workflow step. Should clearly describe what the step does."),
	valid: d.boolean().describe("Whether the step configuration is valid. Set to true when all required fields are properly configured."),
	nextStepIds: d.array(d.uuid()).optional().nullable().describe("Array of step IDs that this step connects to. Leave empty or null for the final step."),
	position: d.object({
		x: d.number(),
		y: d.number()
	}).optional().nullable().describe("Position coordinates for the step in the workflow diagram.")
}), ge = _.extend({
	type: d.literal("AI_AGENT"),
	settings: he
}), v = d.object({
	name: d.string().optional().describe("Human-readable name for the trigger. Optional but recommended for clarity."),
	type: d.enum([
		"DATABASE_EVENT",
		"MANUAL",
		"CRON",
		"WEBHOOK"
	]).describe("Type of trigger. DATABASE_EVENT for record changes, MANUAL for user-initiated, CRON for scheduled, WEBHOOK for external calls."),
	position: d.object({
		x: d.number(),
		y: d.number()
	}).optional().nullable().describe("Position coordinates for the trigger in the workflow diagram. Use (0, 0) for the trigger step."),
	nextStepIds: d.array(d.string()).optional().nullable().describe("Array of step IDs that the trigger connects to. These are the first steps in the workflow.")
}), y = { expectedOutputSchema: d.looseObject({}).optional().describe("A sample output value declared by the user for steps whose output structure is only known at runtime.") }, _e = g.extend({
	input: d.object({
		logicFunctionId: d.string().describe("The ID of the logic function that holds the code. This is auto-generated when a CODE step is created via create_workflow_version_step — do NOT set this manually."),
		logicFunctionInput: d.record(d.string(), d.any()).describe("Key-value map of input parameters to pass to the logic function at runtime.")
	}),
	...y
}), ve = _.extend({
	type: d.literal("CODE"),
	settings: _e
}), ye = g.extend({ input: d.object({
	connectedAccountId: d.string(),
	title: d.string(),
	description: d.string().optional(),
	location: d.string().optional(),
	startsAt: d.string(),
	endsAt: d.string(),
	isFullDay: d.boolean(),
	timeZone: d.string().optional(),
	attendees: d.string().optional().default(""),
	sendInvitations: d.boolean(),
	addConferencing: d.boolean()
}) }), be = _.extend({
	type: d.literal("CREATE_CALENDAR_EVENT"),
	settings: ye
}), b = d.record(d.string(), d.any()).describe("Record data object. Use nested objects for relationships (e.g., \"company\": {\"id\": \"{{reference}}\"}). Common patterns:\n- Person: {\"name\": {\"firstName\": \"John\", \"lastName\": \"Doe\"}, \"emails\": {\"primaryEmail\": \"john@example.com\"}, \"company\": {\"id\": \"{{trigger.object.id}}\"}}\n- Company: {\"name\": \"Acme Corp\", \"domainName\": {\"primaryLinkUrl\": \"https://acme.com\"}}\n- Task: {\"title\": \"Follow up\", \"status\": \"TODO\", \"assignee\": {\"id\": \"{{user.id}}\"}}"), xe = g.extend({ input: d.object({
	objectName: d.string().describe("The name of the object to create a record in. Must be lowercase (e.g., \"person\", \"company\", \"task\")."),
	objectRecord: b.describe("The record data to create.")
}) }), Se = _.extend({
	type: d.literal("CREATE_RECORD"),
	settings: xe
}), Ce = v.extend({
	type: d.literal("CRON"),
	settings: d.discriminatedUnion("type", [
		d.object({
			type: d.literal("DAYS"),
			schedule: d.object({
				day: d.number().min(1),
				hour: d.number().min(0).max(23),
				minute: d.number().min(0).max(59)
			}),
			outputSchema: d.looseObject({})
		}),
		d.object({
			type: d.literal("HOURS"),
			schedule: d.object({
				hour: d.number().min(1),
				minute: d.number().min(0).max(59)
			}),
			outputSchema: d.looseObject({})
		}),
		d.object({
			type: d.literal("MINUTES"),
			schedule: d.object({ minute: d.number().min(1).max(60) }),
			outputSchema: d.looseObject({})
		}),
		d.object({
			type: d.literal("CUSTOM"),
			pattern: d.string(),
			outputSchema: d.looseObject({})
		})
	])
}), x = d.object({
	id: d.string(),
	logicalOperator: d.enum(r),
	parentStepFilterGroupId: d.string().optional(),
	positionInStepFilterGroup: d.number().optional()
}), S = d.object({
	id: d.string(),
	type: d.string(),
	stepOutputKey: d.string(),
	operand: d.enum(i).or(d.enum(n)),
	value: d.string(),
	stepFilterGroupId: d.string(),
	positionInStepFilterGroup: d.number().optional(),
	fieldMetadataId: d.string().optional(),
	compositeFieldSubFieldName: d.string().optional()
}), we = v.extend({
	type: d.literal("DATABASE_EVENT"),
	settings: d.object({
		eventName: d.string().regex(/^[a-z][a-zA-Z0-9_]*\.(created|updated|deleted|upserted)$/, "Event name must follow the pattern: objectName.action (e.g., \"company.created\", \"person.updated\", \"company.upserted\")").describe("Event name in format: objectName.action (e.g., \"company.created\", \"person.updated\", \"task.deleted\", \"company.upserted\"). Use lowercase object names."),
		input: d.looseObject({}).optional(),
		outputSchema: d.looseObject({}).describe("Schema defining the output data structure. For database events, this includes the record that triggered the workflow accessible via {{trigger.object.fieldName}}."),
		objectType: d.string().optional(),
		fields: d.array(d.string()).optional().nullable(),
		filter: d.object({
			stepFilterGroups: d.array(x),
			stepFilters: d.array(S)
		}).optional().describe("Optional condition evaluated against the triggering record. The workflow only runs when the record matches; non-matching events are skipped before a run is created.")
	})
}).describe("Database event trigger that fires when a record is created, updated, deleted, or upserted. The triggered record is accessible in workflow steps via {{trigger.object.fieldName}}."), Te = g.extend({ input: d.object({
	objectName: d.string(),
	objectRecordId: d.string()
}) }), Ee = _.extend({
	type: d.literal("DELETE_RECORD"),
	settings: Te
}), De = d.object({
	id: d.string().refine((e) => s(e)),
	name: d.string(),
	size: d.number(),
	type: d.string(),
	createdAt: d.string()
}), C = d.string().regex(/^{{[^{}]+}}$/, "Expected a workflow variable reference like {{stepId.path}}"), Oe = d.array(d.union([De, C.describe("A workflow variable reference resolving to files")])).optional().default([]), w = g.extend({ input: d.object({
	connectedAccountId: d.string(),
	fromHandle: d.string().trim().optional(),
	recipients: d.object({
		to: d.string().optional().default(""),
		cc: d.string().optional().default(""),
		bcc: d.string().optional().default("")
	}),
	subject: d.string().optional(),
	body: d.string().optional(),
	files: Oe,
	inReplyTo: d.string().trim().optional()
}) }), T = _.extend({
	type: d.literal("DRAFT_EMAIL"),
	settings: w
}), E = g.extend({ input: d.object({}) }), D = _.extend({
	type: d.literal("EMPTY"),
	settings: E
}), O = g.extend({ input: d.object({
	stepFilterGroups: d.array(x),
	stepFilters: d.array(S)
}) }), k = _.extend({
	type: d.literal("FILTER"),
	settings: O
}), A = g.extend({ input: d.object({
	objectName: d.string(),
	limit: d.union([d.number(), C]).optional(),
	offset: d.union([d.number().int().nonnegative(), C]).optional(),
	filter: d.object({
		recordFilterGroups: d.array(d.any()).optional(),
		recordFilters: d.array(d.any()).optional()
	}).optional(),
	orderBy: d.object({
		recordSorts: d.array(d.any()).optional(),
		gqlOperationOrderBy: d.array(d.record(d.string(), d.any())).optional()
	}).optional()
}) }), j = _.extend({
	type: d.literal("FIND_RECORDS"),
	settings: A
}), M = g.extend({ input: d.array(d.object({
	id: d.string(),
	name: d.string(),
	label: d.string(),
	type: d.union([
		d.literal(t.TEXT),
		d.literal(t.NUMBER),
		d.literal(t.DATE),
		d.literal(t.SELECT),
		d.literal(t.MULTI_SELECT),
		d.literal("RECORD")
	]),
	placeholder: d.string().optional(),
	settings: d.record(d.string(), d.any()).optional(),
	value: d.any().optional()
})) }), ke = _.extend({
	type: d.literal("FORM"),
	settings: M
}), Ae = g.extend({
	input: d.object({
		url: d.string(),
		method: d.enum([
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE"
		]),
		headers: d.record(d.string(), d.string()).optional(),
		body: d.record(d.string(), d.union([
			d.string(),
			d.number(),
			d.boolean(),
			d.null(),
			d.array(d.union([
				d.string(),
				d.number(),
				d.boolean(),
				d.null()
			]))
		])).or(d.string()).optional()
	}),
	...y
}), je = _.extend({
	type: d.literal("HTTP_REQUEST"),
	settings: Ae
}), Me = d.object({
	id: d.string(),
	nextStepIds: d.array(d.string()),
	filterGroupId: d.string().optional()
}), Ne = g.extend({ input: d.object({
	stepFilterGroups: d.array(x),
	stepFilters: d.array(S),
	branches: d.array(Me)
}) }), Pe = _.extend({
	type: d.literal("IF_ELSE"),
	settings: Ne
}), Fe = g.extend({ input: d.object({
	items: d.union([d.array(d.union([
		d.string(),
		d.number(),
		d.boolean(),
		d.null(),
		d.record(d.string(), d.any()),
		d.any()
	])), d.string()]).optional(),
	initialLoopStepIds: d.array(d.string()).optional(),
	shouldContinueOnIterationFailure: d.boolean().optional()
}) }), Ie = _.extend({
	type: d.literal("ITERATOR"),
	settings: Fe
}), Le = g.extend({
	input: d.object({
		logicFunctionId: d.string(),
		logicFunctionInput: d.record(d.string(), d.any())
	}),
	...y
}), Re = _.extend({
	type: d.literal("LOGIC_FUNCTION"),
	settings: Le
}), ze = v.extend({
	type: d.literal("MANUAL"),
	settings: d.object({
		objectType: d.string().optional(),
		outputSchema: d.looseObject({}).describe("Schema defining the output data structure. When a record is selected, it is accessible via {{trigger.record.fieldName}}. When no record is selected, no data is available."),
		icon: d.string().optional(),
		isPinned: d.boolean().optional(),
		availability: d.discriminatedUnion("type", [
			d.object({
				type: d.literal("GLOBAL"),
				locations: d.array(d.string()).optional()
			}),
			d.object({
				type: d.literal("SINGLE_RECORD"),
				objectNameSingular: d.string()
			}),
			d.object({
				type: d.literal("BULK_RECORDS"),
				objectNameSingular: d.string()
			})
		]).optional().nullable()
	})
}).describe("Manual trigger that can be launched by the user. If a record is selected when launched, it is accessible via {{trigger.record.fieldName}}. If no record is selected, no data context is available."), Be = d.enum([
	"RANDOM",
	"ROUND_ROBIN",
	"LOAD_BALANCED"
]), Ve = g.extend({ input: d.object({
	objectName: d.string(),
	strategy: Be,
	recordIds: d.array(d.string()),
	loadBalance: d.object({
		objectNameSingular: d.string(),
		fieldName: d.string()
	}).optional()
}).superRefine((t, n) => {
	t.strategy === "LOAD_BALANCED" && !e(t.loadBalance) && n.addIssue({
		code: d.ZodIssueCode.custom,
		path: ["loadBalance"],
		message: "loadBalance is required when strategy is LOAD_BALANCED"
	});
}) }), He = _.extend({
	type: d.literal("PICK_RECORD"),
	settings: Ve
}), Ue = _.extend({
	type: d.literal("SEND_EMAIL"),
	settings: w
}), We = g.extend({ input: d.object({
	objectName: d.string(),
	objectRecord: b,
	objectRecordId: d.string(),
	fieldsToUpdate: d.array(d.string())
}) }), Ge = _.extend({
	type: d.literal("UPDATE_RECORD"),
	settings: We
}), Ke = g.extend({ input: d.object({
	objectName: d.string(),
	objectRecord: b
}) }), qe = _.extend({
	type: d.literal("UPSERT_RECORD"),
	settings: Ke
}), N = v.extend({
	type: d.literal("WEBHOOK"),
	settings: d.discriminatedUnion("httpMethod", [d.object({
		outputSchema: d.looseObject({}),
		httpMethod: d.literal("GET"),
		authentication: d.literal("API_KEY").nullable()
	}), d.object({
		outputSchema: d.looseObject({}),
		expectedOutputSchema: d.looseObject({}).optional(),
		httpMethod: d.literal("POST"),
		expectedBody: d.looseObject({}),
		authentication: d.literal("API_KEY").nullable()
	})])
}), Je = g.extend({ input: d.object({
	delayType: d.enum(["SCHEDULED_DATE", "DURATION"]),
	scheduledDateTime: d.string().nullable().optional(),
	duration: d.object({
		days: d.union([d.number().min(0), d.string()]).optional(),
		hours: d.union([d.number().min(0), d.string()]).optional(),
		minutes: d.union([d.number().min(0), d.string()]).optional(),
		seconds: d.union([d.number().min(0), d.string()]).optional()
	}).optional()
}) }), Ye = _.extend({
	type: d.literal("DELAY"),
	settings: Je
}), P = d.discriminatedUnion("type", [
	ve,
	Re,
	Ue,
	T,
	be,
	Se,
	Ge,
	Ee,
	qe,
	j,
	He,
	ke,
	je,
	ge,
	k,
	Pe,
	Ie,
	Ye,
	D
]), Xe = /* @__PURE__ */ function(e) {
	return e.NOT_STARTED = "NOT_STARTED", e.RUNNING = "RUNNING", e.SUCCESS = "SUCCESS", e.STOPPED = "STOPPED", e.FAILED = "FAILED", e.FAILED_SAFELY = "FAILED_SAFELY", e.PENDING = "PENDING", e.SKIPPED = "SKIPPED", e;
}({}), Ze = d.enum(Xe), F = d.object({
	result: d.any().optional(),
	error: d.any().optional(),
	status: Ze,
	get history() {
		return d.array(F.pick({
			result: !0,
			status: !0,
			error: !0
		})).optional();
	}
}), Qe = d.record(d.string(), F), I = d.discriminatedUnion("type", [
	we,
	ze,
	Ce,
	N
]), $e = d.object({
	flow: d.object({
		trigger: I,
		steps: d.array(P)
	}),
	stepInfos: Qe,
	workflowRunError: d.any().optional()
}), et = d.enum([
	"NOT_STARTED",
	"RUNNING",
	"COMPLETED",
	"FAILED",
	"ENQUEUED",
	"STOPPING",
	"STOPPED"
]), tt = d.object({
	timestamp: d.string(),
	level: d.enum([
		"debug",
		"info",
		"warn",
		"error"
	]),
	message: d.string()
}), nt = d.object({
	toolName: d.string(),
	toolCallId: d.string(),
	providerExecuted: d.boolean().optional(),
	input: d.unknown().optional(),
	output: d.unknown().optional(),
	errorMessage: d.string().optional(),
	state: d.enum([
		"started",
		"success",
		"error",
		"awaiting-approval"
	])
}), rt = d.object({
	type: d.literal("AI_AGENT"),
	modelId: d.string(),
	usage: d.object({
		inputTokens: d.number(),
		outputTokens: d.number(),
		reasoningTokens: d.number().optional(),
		cacheReadTokens: d.number().optional(),
		cacheCreationTokens: d.number().optional(),
		totalTokens: d.number()
	}),
	cost: d.object({
		totalCostInDollars: d.number(),
		creditsUsedMicro: d.number()
	}),
	nativeWebSearchCallCount: d.number(),
	toolCalls: d.array(nt),
	durationMs: d.number()
}), it = d.object({
	type: d.literal("CODE"),
	durationMs: d.number(),
	status: d.enum(["SUCCESS", "ERROR"]),
	error: d.object({
		type: d.string(),
		message: d.string(),
		stackTrace: d.string().optional()
	}).nullable().optional()
}), at = d.object({
	type: d.literal("HTTP_REQUEST"),
	request: d.object({
		method: d.string(),
		url: d.string(),
		headers: d.record(d.string(), d.string()),
		body: d.string().optional(),
		bodyBytes: d.number().optional(),
		bodyTruncated: d.boolean().optional()
	}),
	response: d.object({
		status: d.number(),
		statusText: d.string().optional(),
		headers: d.record(d.string(), d.string()),
		body: d.string().optional(),
		bodyBytes: d.number().optional(),
		bodyTruncated: d.boolean().optional()
	}).optional(),
	error: d.string().optional(),
	durationMs: d.number()
}), ot = d.object({
	type: d.literal("EMAIL"),
	mode: d.enum(["SEND", "DRAFT"]),
	status: d.enum(["SUCCESS", "ERROR"]),
	recipients: d.object({
		to: d.array(d.string()),
		cc: d.array(d.string()).optional(),
		bcc: d.array(d.string()).optional()
	}),
	subject: d.string().optional(),
	bodyPreview: d.string().optional(),
	bodyBytes: d.number().optional(),
	bodyTruncated: d.boolean().optional(),
	connectedAccountId: d.string().optional(),
	fromHandle: d.string().optional(),
	attachmentCount: d.number().optional(),
	inReplyTo: d.string().optional(),
	error: d.string().optional(),
	durationMs: d.number()
}), st = d.object({
	type: d.literal("CREATE_CALENDAR_EVENT"),
	status: d.enum(["SUCCESS", "ERROR"]),
	title: d.string().optional(),
	startsAt: d.string().optional(),
	endsAt: d.string().optional(),
	attendeeCount: d.number().optional(),
	conferenceLink: d.string().optional(),
	connectedAccountId: d.string().optional(),
	iCalUid: d.string().optional(),
	error: d.string().optional(),
	durationMs: d.number()
}), ct = d.discriminatedUnion("type", [
	rt,
	it,
	at,
	ot,
	st
]), lt = d.object({
	details: ct,
	entries: d.array(tt),
	truncated: d.object({
		droppedEntries: d.number(),
		droppedBytes: d.number()
	}).optional(),
	sizeBytes: d.number()
}), ut = d.record(d.string(), d.unknown()), dt = d.looseObject({
	__typename: d.literal("WorkflowRun"),
	id: d.string(),
	workflowVersionId: d.string(),
	workflowId: d.string(),
	state: $e.nullable(),
	stepLogs: ut.nullable().optional(),
	status: et,
	createdAt: d.string(),
	deletedAt: d.string().nullable(),
	endedAt: d.string().nullable(),
	name: d.string()
}), L = /* @__PURE__ */ function(e) {
	return e.CODE = "CODE", e.LOGIC_FUNCTION = "LOGIC_FUNCTION", e.SEND_EMAIL = "SEND_EMAIL", e.DRAFT_EMAIL = "DRAFT_EMAIL", e.CREATE_CALENDAR_EVENT = "CREATE_CALENDAR_EVENT", e.CREATE_RECORD = "CREATE_RECORD", e.UPDATE_RECORD = "UPDATE_RECORD", e.DELETE_RECORD = "DELETE_RECORD", e.UPSERT_RECORD = "UPSERT_RECORD", e.FIND_RECORDS = "FIND_RECORDS", e.PICK_RECORD = "PICK_RECORD", e.FORM = "FORM", e.FILTER = "FILTER", e.IF_ELSE = "IF_ELSE", e.HTTP_REQUEST = "HTTP_REQUEST", e.AI_AGENT = "AI_AGENT", e.ITERATOR = "ITERATOR", e.EMPTY = "EMPTY", e.DELAY = "DELAY", e;
}({}), ft = ({ nameSingular: e }) => !ie.includes(e), pt = ({ rawVariableName: t, part: n }) => {
	let r = t.replace(m, (e, t) => t).split("."), i = n === "stepId" ? r[0] : n === "selectedField" ? r[r.length - 1] : null;
	if (!e(i)) throw Error("Expected to find at least one splitted chunk.");
	return i;
}, mt = (t) => t.map((t) => {
	if (a(t)) return null;
	if (t.type === "records") return [];
	if (e(t.type) && [
		"string",
		"number",
		"boolean"
	].includes(t.type)) return t.enum && t.enum.length > 0 ? t.enum[0] : null;
	if (t.type === "object") {
		let n = {};
		return e(t.properties) && Object.entries(t.properties).forEach(([e, t]) => {
			n[e] = mt([t])[0];
		}), n;
	} else if (t.type === "array" && e(t.items)) return [];
	return null;
}), ht = (t) => Object.fromEntries(Object.entries(t).filter(([, t]) => e(t?.result)).map(([e, t]) => [e, t?.result])), gt = (e) => typeof e == "string" && /^{{[^{}]+}}$/.test(e), _t = (e) => e === "true" ? !0 : e === "false" ? !1 : e, vt = (e) => {
	let t = e;
	if (typeof e == "string") try {
		t = JSON.parse(e);
	} catch {
		t = e;
	}
	return new URLSearchParams(t).toString();
}, yt = (e) => {
	let t = new FormData();
	if (typeof e == "string") try {
		let n = JSON.parse(e);
		Object.entries(n).forEach(([e, n]) => t.append(e, String(n)));
	} catch {
		throw Error("String data for FormData must be valid JSON");
	}
	else Object.entries(e).forEach(([e, n]) => t.append(e, n));
	return t;
}, R = (e) => typeof e == "string" ? e : JSON.stringify(e), bt = (e) => typeof e == "string" ? e : Object.entries(e).map(([e, t]) => `${e}=${t}`).join("\n"), xt = (e, t) => {
	if (t === void 0) return R(e);
	switch (t) {
		case "application/x-www-form-urlencoded": return vt(e);
		case "multipart/form-data": return yt(e);
		case "application/json": return R(e);
		case "text/plain": return bt(e);
		default: return R(e);
	}
}, St = /[\s[]/, Ct = (e) => St.test(e), wt = (e) => Ct(e) ? `[${e}]` : e, Tt = (e) => e.map(wt).join("."), z = (e) => {
	let t = [], n = "", r = !1, i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a === "[" && !r) {
			n.length > 0 && (t.push(n), n = ""), r = !0, i++;
			continue;
		}
		if (a === "]" && r) {
			t.push(n), n = "", r = !1, i++, i < e.length && e[i] === "." && i++;
			continue;
		}
		if (a === "." && !r) {
			n.length > 0 && (t.push(n), n = ""), i++;
			continue;
		}
		n += a, i++;
	}
	return n.length > 0 && t.push(n), t;
}, Et = (e) => {
	let t = e.settings?.input;
	return e.type === L.IF_ELSE && l(t) && "branches" in t && Array.isArray(t.branches);
}, Dt = (e) => {
	let t = e.settings?.input;
	return e.type === L.ITERATOR && l(t) && "initialLoopStepIds" in t && c(t.initialLoopStepIds);
}, Ot = (t) => {
	let n = t.settings?.input;
	if (e(n) && l(n)) return n;
}, kt = (e) => {
	let t = new Set(e.nextStepIds ?? []);
	if (Et(e)) for (let n of e.settings.input.branches ?? []) for (let e of n?.nextStepIds ?? []) t.add(e);
	if (Dt(e)) for (let n of e.settings.input.initialLoopStepIds ?? []) t.add(n);
	return [...t];
}, At = ({ trigger: t, steps: n }) => {
	let r = /* @__PURE__ */ new Map(), i = e(t?.nextStepIds) ? t.nextStepIds.filter(e) : [];
	r.set(h, i);
	for (let e of n ?? []) r.set(e.id, kt(e));
	let a = /* @__PURE__ */ new Set(), o = [h];
	for (; o.length > 0;) {
		let t = o.shift();
		if (!(!e(t) || a.has(t))) {
			a.add(t);
			for (let e of r.get(t) ?? []) a.has(e) || o.push(e);
		}
	}
	return {
		childrenByStepId: r,
		reachableFromTrigger: a,
		ancestorsByStepId: jt(r)
	};
}, jt = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of e.entries()) for (let e of r) {
		let r = t.get(e) ?? /* @__PURE__ */ new Set();
		r.add(n), t.set(e, r);
	}
	let n = /* @__PURE__ */ new Map();
	for (let r of e.keys()) {
		if (n.has(r)) continue;
		let e = /* @__PURE__ */ new Set(), i = [...t.get(r) ?? []];
		for (; i.length > 0;) {
			let n = i.shift();
			if (!e.has(n)) {
				e.add(n);
				for (let r of t.get(n) ?? []) e.has(r) || i.push(r);
			}
		}
		n.set(r, e);
	}
	return n;
};
//#endregion
//#region src/workflow/validation/utils/extract-variables-from-input.util.ts
function* Mt(e) {
	if (u(e)) {
		for (let [, t] of e.matchAll(m)) yield t;
		return;
	}
	if (l(e)) for (let t of Object.values(e)) yield* Mt(t);
}
var Nt = (e) => [...Mt(e)], Pt = (e, t) => {
	let n = e.length + 1, r = t.length + 1, i = Array.from({ length: n }, () => Array(r).fill(0));
	for (let e = 0; e < n; e++) i[e][0] = e;
	for (let e = 0; e < r; e++) i[0][e] = e;
	for (let a = 1; a < n; a++) for (let n = 1; n < r; n++) {
		let r = e[a - 1] === t[n - 1] ? 0 : 1;
		i[a][n] = Math.min(i[a - 1][n] + 1, i[a][n - 1] + 1, i[a - 1][n - 1] + r);
	}
	return i[e.length][t.length];
}, Ft = (t) => {
	if (!e(t) || !p(t) || Array.isArray(t)) return !1;
	let n = Object.values(t);
	return n.length === 0 ? !1 : n.every((t) => e(t) && p(t) && f(t.isLeaf));
}, B = (e, t = []) => {
	let n = [];
	if (!l(e)) return n;
	for (let [r, i] of Object.entries(e)) {
		if (!l(i)) continue;
		let e = [...t, r];
		n.push(e.join(".")), !i.isLeaf && l(i.value) && n.push(...B(i.value, e));
	}
	return n;
}, It = ({ schema: t, propertyPath: n }) => {
	let r = t;
	for (let t = 0; t < n.length; t++) {
		if (!l(r)) return {
			validPrefix: n.slice(0, t),
			failedSegment: n[t],
			availableKeys: []
		};
		let i = n[t], a = r[i];
		if (!e(a)) return {
			validPrefix: n.slice(0, t),
			failedSegment: i,
			availableKeys: Object.keys(r)
		};
		if (a.isLeaf) return t === n.length - 1 ? void 0 : {
			validPrefix: n.slice(0, t + 1),
			failedSegment: n[t + 1],
			availableKeys: []
		};
		r = a.value;
	}
}, V = { found: !1 }, H = (e) => o(e) && f(e.isLeaf), U = (e) => o(e) && e._outputSchemaType === "RECORD" && o(e.fields), Lt = (e) => o(e) && !("_outputSchemaType" in e) && H(e.first) && e.first.isLeaf === !1 && U(e.first.value) && H(e.totalCount), W = (e) => ({
	found: !0,
	type: ee(e.type) ? e.type : void 0,
	label: ee(e.label) ? e.label : void 0
}), Rt = (e, t) => t.length === 0 ? W(e) : G(e.value, t), zt = (e, t) => {
	for (let n = 1; n <= t.length; n++) {
		let r = e[t.slice(0, n).join(".")];
		if (H(r)) return Rt(r, t.slice(n));
	}
	return V;
}, Bt = (e, t) => {
	let [n, ...r] = t;
	if (n === "first") return r.length === 0 ? W(e.first) : G(e.first.value, r);
	if (n === "all" || n === "totalCount") {
		let t = e[n];
		return r.length === 0 && H(t) ? W(t) : V;
	}
	return V;
}, Vt = (t, n) => {
	let [r, ...i] = n, a = t[r];
	return H(a) ? Rt(a, i) : e(a) ? i.length === 0 ? { found: !0 } : o(a) ? Vt(a, i) : V : V;
}, G = (e, t) => t.length === 0 || !o(e) ? V : U(e) ? zt(e.fields, t) : Lt(e) ? Bt(e, t) : Vt(e, t), Ht = ({ schema: e, propertyPath: t }) => G(e, t), K = (t) => {
	let n = [];
	for (let [r, i] of Object.entries(t)) if (H(i)) {
		if (n.push(r), i.isLeaf) continue;
		let e = i.value;
		if (U(e)) for (let t of K(e.fields)) n.push(`${r}.${t}`);
		else if (o(e)) for (let t of K(e)) n.push(`${r}.${t}`);
	} else if (e(i) && (n.push(r), o(i))) for (let e of K(i)) n.push(`${r}.${e}`);
	return n;
}, q = (t) => {
	if (!o(t)) return [];
	if (U(t)) return K(t.fields);
	if (Lt(t)) {
		let n = [];
		if (H(t.first)) {
			n.push("first");
			for (let e of q(t.first.value)) n.push(`first.${e}`);
		}
		return e(t.all) && n.push("all"), n.push("totalCount"), n;
	}
	return K(t);
}, Ut = 3, Wt = (e) => o(e) ? e._outputSchemaType === "RECORD" ? !0 : Object.values(e).some((e) => o(e) && Wt(e.value)) : !1, J = (e, t) => t.map((t) => ({
	candidate: t,
	distance: Pt(e, t)
})).filter(({ candidate: e, distance: t }) => t <= Math.ceil(e.length / 2)).sort((e, t) => e.distance - t.distance).slice(0, Ut).map(({ candidate: e }) => e), Gt = ({ schema: t, propertyPath: n, referencedStepId: r }) => {
	if (!Ft(t) || Wt(t)) {
		let e = q(t);
		return J(n.join("."), e).map((e) => [r, e].join("."));
	}
	let i = It({
		schema: t,
		propertyPath: n
	});
	if (!e(i)) return [];
	let a = J(i.failedSegment, i.availableKeys).map((e) => [
		r,
		...i.validPrefix,
		e
	].join("."));
	if (c(a)) return a;
	let o = B(t);
	return J(n.join("."), o).map((e) => [r, e].join("."));
}, Kt = ({ workflow: t, graph: n }) => {
	let r = [], i = t.steps ?? [], a = new Set(i.map((e) => e.id)), o = /* @__PURE__ */ new Set();
	for (let e of i) o.has(e.id) && r.push({
		severity: "error",
		code: "DUPLICATE_STEP_ID",
		message: `Duplicate step id "${e.id}". Every step id must be unique within the workflow.`,
		stepId: e.id
	}), o.add(e.id);
	let s = (t.trigger?.nextStepIds ?? []).filter(e);
	i.length > 0 && s.length === 0 && r.push({
		severity: "error",
		code: "TRIGGER_HAS_NO_NEXT_STEP",
		message: `The trigger is not connected to any step. The trigger must have a "nextStepIds" array pointing to the first step (e.g. nextStepIds: ["${i[0].id}"]). If you used edges, also set trigger.nextStepIds.`
	});
	for (let e of s) a.has(e) || r.push({
		severity: "error",
		code: "DANGLING_REFERENCE",
		message: `The trigger references a non-existent step "${e}".`
	});
	for (let e of i) {
		for (let t of n.childrenByStepId.get(e.id) ?? []) a.has(t) || r.push({
			severity: "error",
			code: "DANGLING_REFERENCE",
			message: `Step "${e.name ?? e.id}" references a non-existent step "${t}".`,
			stepId: e.id
		});
		r.push(...qt(e));
	}
	for (let e of i) n.reachableFromTrigger.has(e.id) || r.push({
		severity: "error",
		code: "UNREACHABLE_STEP",
		message: `Step "${e.name ?? e.id}" is not reachable from the trigger. Ensure a chain of nextStepIds connects the trigger to this step. Check that the preceding step includes this step's id ("${e.id}") in its nextStepIds array.`,
		stepId: e.id
	});
	return r;
}, qt = (t) => {
	let n = [], r = Ot(t);
	if (t.type === L.IF_ELSE) {
		let i = r?.branches, a = Array.isArray(i) ? i : [];
		a.length < 2 && n.push({
			severity: "warning",
			code: "IF_ELSE_INSUFFICIENT_BRANCHES",
			message: `If/Else step "${t.name ?? t.id}" should have at least two branches (a condition branch and an else branch).`,
			stepId: t.id
		});
		let o = r?.stepFilterGroups, s = new Set((Array.isArray(o) ? o : []).filter(e).map((e) => e.id));
		for (let r of a) {
			let i = r?.nextStepIds;
			(!Array.isArray(i) || i.length === 0) && n.push({
				severity: "error",
				code: "IF_ELSE_BRANCH_HAS_NO_NEXT_STEP",
				message: `A branch of If/Else step "${t.name ?? t.id}" is not connected to any step.`,
				stepId: t.id
			}), e(r?.filterGroupId) && !s.has(r.filterGroupId) && n.push({
				severity: "error",
				code: "INVALID_STEP_PARAMS",
				message: `A branch of If/Else step "${t.name ?? t.id}" references filter group "${r.filterGroupId}", which does not exist.`,
				stepId: t.id
			});
		}
	}
	if (t.type === L.ITERATOR) {
		let e = r, i = e?.items, a = typeof i == "string" && i.length > 0 || Array.isArray(i) && i.length > 0, o = e?.initialLoopStepIds, s = Array.isArray(o) && o.length > 0;
		a && !s && n.push({
			severity: "error",
			code: "ITERATOR_MISSING_LOOP_BODY",
			message: `Iterator step "${t.name ?? t.id}" has items to iterate over but no steps inside the loop.`,
			stepId: t.id
		});
	}
	return n;
}, Jt = (e) => e.map((e) => String(e)).join("."), Yt = (e) => {
	let t = Jt(e.path), n = t.length > 0 ? `${t}: ${e.message}` : e.message;
	return e.code === "invalid_type" && t.length > 0 ? `${n}. Ensure the field "${t}" exists at the correct nesting level in the step object (not inside "input").` : n;
}, Xt = (e) => e.issues.map(Yt), Zt = ({ trigger: t, steps: n }) => {
	let r = [];
	if (e(t)) {
		let e = I.safeParse(t);
		if (!e.success) for (let t of Xt(e.error)) r.push({
			severity: "error",
			code: "INVALID_TRIGGER_PARAMS",
			message: `Trigger configuration is invalid - ${t}`
		});
	}
	for (let e of n ?? []) {
		let t = P.safeParse(e);
		if (!t.success) for (let n of Xt(t.error)) r.push({
			severity: "error",
			code: "INVALID_STEP_PARAMS",
			message: `Step "${e.name ?? e.id}" configuration is invalid - ${n}`,
			stepId: e.id
		});
	}
	return r;
}, Qt = ({ workflow: t, graph: n, stepsById: r }) => {
	let i = [], a = new Set(t.steps?.map((e) => e.id) ?? []);
	for (let o of t.steps ?? []) {
		let s = Nt(o.settings?.input), c = n.ancestorsByStepId.get(o.id) ?? /* @__PURE__ */ new Set();
		for (let n of s) {
			let s = z(n), l = s[0];
			if (!e(l)) {
				i.push({
					severity: "error",
					code: "VARIABLE_INVALID_PATH",
					message: `Step "${o.name ?? o.id}" has a variable "{{${n}}}" with an invalid path. Variable references must start with a step ID, e.g. "{{stepId.property}}".`,
					stepId: o.id,
					path: n
				});
				continue;
			}
			let u = l === h;
			if (!u && !a.has(l)) {
				i.push({
					severity: "error",
					code: "VARIABLE_UNKNOWN_STEP",
					message: `Step "${o.name ?? o.id}" references variable "{{${n}}}" from an unknown step "${l}".`,
					stepId: o.id,
					path: n
				});
				continue;
			}
			let d = l === o.id;
			if (!u && !d && !c.has(l)) {
				let e = r.get(l)?.name ?? l;
				i.push({
					severity: "error",
					code: "VARIABLE_NOT_UPSTREAM",
					message: `Step "${o.name ?? o.id}" references variable "{{${n}}}" from step "${e}", which does not run before it. Ensure step "${e}" is an ancestor (connected via nextStepIds chain from the trigger, before this step).`,
					stepId: o.id,
					path: n
				});
				continue;
			}
			i.push(...$t({
				step: o,
				variable: n,
				pathSegments: s,
				referencedStepId: l,
				isTriggerReference: u,
				trigger: t.trigger,
				stepsById: r
			}));
		}
	}
	return i;
}, $t = ({ step: t, variable: n, pathSegments: r, referencedStepId: i, isTriggerReference: a, trigger: o, stepsById: s }) => {
	let u = r.slice(1);
	if (u.length === 0) return [];
	let d = a ? o?.settings?.outputSchema : s.get(i)?.settings?.outputSchema, f = e(d) && l(d) && !Array.isArray(d) && Object.keys(d).length === 0;
	if (!e(d) || f) return [];
	if (!Ht({
		schema: d,
		propertyPath: u
	}).found) {
		let r = Gt({
			schema: d,
			propertyPath: u,
			referencedStepId: i
		}), a = tn(d, i), o = c(r) ? `Did you mean "{{${r[0]}}}"?${r.length > 1 ? ` Other options: ${r.slice(1).map((e) => `{{${e}}}`).join(", ")}.` : ""}` : c(a) ? `Available paths: ${a.map((e) => `{{${e}}}`).join(", ")}.` : void 0;
		return [{
			severity: "error",
			code: "VARIABLE_PATH_NOT_FOUND",
			message: `Step "${t.name ?? t.id}" references variable "{{${n}}}" but the path "${u.join(".")}" was not found in the output of step "${i}".`,
			stepId: t.id,
			path: n,
			...e(o) ? { hint: o } : {},
			...c(r) ? { suggestions: r } : {},
			...c(a) ? { availablePaths: a } : {}
		}];
	}
	return [];
}, en = 20, tn = (e, t) => q(e).slice(0, en).map((e) => `${t}.${e}`), nn = (e) => {
	let t = e.filter((e) => e.severity === "error"), n = e.filter((e) => e.severity === "warning");
	return {
		valid: t.length === 0,
		errors: t,
		warnings: n
	};
}, rn = (t) => {
	let n = [];
	e(t.trigger) ? e(t.trigger.type) || n.push({
		severity: "error",
		code: "MISSING_TRIGGER_TYPE",
		message: "The workflow trigger has no type."
	}) : n.push({
		severity: "error",
		code: "MISSING_TRIGGER",
		message: "The workflow has no trigger."
	});
	let r = t.steps ?? [];
	if (r.length === 0) return n.push({
		severity: "error",
		code: "NO_STEPS",
		message: "The workflow has no steps."
	}), nn(n);
	let i = new Map(r.map((e) => [e.id, e])), a = At(t);
	return n.push(...Kt({
		workflow: t,
		graph: a
	})), n.push(...Zt(t)), n.push(...Qt({
		workflow: t,
		graph: a,
		stepsById: i
	})), nn(n);
}, an = () => ({
	isLeaf: !1,
	type: "object",
	label: oe,
	value: { [se]: {
		isLeaf: !0,
		type: "string",
		label: ce,
		value: ""
	} }
}), on = (t) => {
	if (!e(t)) return !1;
	let n = Object.keys(t);
	return n.length === 0 ? !1 : n.every((e, t) => e === String(t));
}, sn = ({ schema: t, label: n = "Current Item" }) => {
	let r = t[0];
	if (e(r)) return {
		...r,
		label: n
	};
}, cn = ({ schema: t, propertyPath: n }) => {
	if (n.length === 0) return;
	let r = t, i;
	for (let t of n) {
		if (i = r[t], !e(i)) return;
		if (i.isLeaf) return t === n[n.length - 1] ? i : void 0;
		r = i.value;
	}
	return i;
}, Y = {
	variableLabel: void 0,
	variablePathLabel: void 0
}, ln = [
	"CREATE_RECORD",
	"UPDATE_RECORD",
	"DELETE_RECORD",
	"UPSERT_RECORD",
	"PICK_RECORD"
], X = (e) => p(e) && "_outputSchemaType" in e && e._outputSchemaType === "RECORD", un = (t) => !e(t) || !p(t) || Array.isArray(t) ? !1 : !(p(t) && "_outputSchemaType" in t), Z = (e) => e.replace(m, (e, t) => t), dn = (e, t) => X(t) ? t.fields[e] : t[e], fn = (e, t) => {
	if (!X(e)) return e[t]?.isCompositeSubField ? t : void 0;
}, pn = (e) => e === "id" || e.endsWith(".id"), mn = (t, n) => {
	let r = t, i = [];
	for (let t of n) {
		let n = dn(t, r);
		if (!e(n)) return null;
		e(n.label) && i.push(n.label);
		let a = n.value;
		if (!e(a)) return null;
		r = a;
	}
	return {
		schema: r,
		pathLabels: i
	};
}, hn = (e, t, n, r, i, a) => {
	let o = dn(r, n), s = i && X(n) && pn(r) ? n.object.label : o?.label;
	if (!s) return Y;
	let c = [
		e,
		...t,
		s
	].join(" > ");
	return {
		variableLabel: s,
		variablePathLabel: a ? `${c} (${a})` : c,
		variableType: o?.type,
		fieldMetadataId: o?.fieldMetadataId,
		compositeFieldSubFieldName: fn(n, r)
	};
}, Q = ({ stepName: e, recordOutputSchema: t, path: n, selectedField: r, isFullRecord: i, stepNameLabel: a }) => {
	let o = mn(t, n);
	return o ? hn(e, o.pathLabels, o.schema, r, i, a) : Y;
}, gn = (t, n) => {
	let r = t, i = [];
	for (let t of n) {
		let n = r[t];
		if (!e(n) || n.isLeaf === !0 || !e(n.value)) return null;
		i.push(n.label), r = n.value;
	}
	return {
		schema: r,
		pathLabels: i
	};
}, $ = ({ stepName: t, baseOutputSchema: n, path: r, selectedField: i }) => {
	let a = gn(n, r);
	if (!a) return Y;
	let o = a.schema[i];
	if (!e(o)) return Y;
	let s = [
		t,
		...a.pathLabels,
		o.label
	].join(" > ");
	return {
		variableLabel: o.label,
		variablePathLabel: s,
		variableType: o.type
	};
}, _n = ({ stepName: t, recordOutputSchema: n, rawVariableName: r, isFullRecord: i }) => {
	if (!e(n)) return Y;
	let a = z(Z(r)), o = a[0], s = a[a.length - 1], c = a.slice(1, -1);
	return !e(o) || !e(s) ? Y : Q({
		stepName: t,
		recordOutputSchema: n,
		selectedField: s,
		path: c,
		isFullRecord: i
	});
}, vn = ({ stepName: t, recordOutputSchema: n, rawVariableName: r, isFullRecord: i }) => {
	if (!e(n)) return Y;
	let a = z(Z(r)), o = a[0], s = [a.slice(1, 4).join("."), ...a.slice(4)], c = s[s.length - 1], l = s.slice(0, -1);
	return !e(o) || !e(c) ? Y : Q({
		stepName: t,
		recordOutputSchema: n,
		selectedField: c,
		path: l,
		isFullRecord: i
	});
}, yn = ({ stepName: t, baseOutputSchema: n, rawVariableName: r }) => {
	if (!e(n)) return Y;
	let i = z(Z(r)), a = i[0], o = i[i.length - 1], s = i.slice(1, -1);
	return !e(a) || !e(o) ? Y : $({
		stepName: t,
		baseOutputSchema: n,
		path: s,
		selectedField: o
	});
}, bn = ({ stepName: n, findRecordsOutputSchema: r, rawVariableName: i, isFullRecord: a, stepNameLabel: o }) => {
	if (!e(r)) return Y;
	let s = z(Z(i)), c = s[0], l = s[1], u = s.slice(2);
	if (!e(c) || !e(l)) return Y;
	if (l === "first") {
		let t = r.first?.value, i = u[u.length - 1], s = u.slice(0, -1);
		return !e(t) || !e(i) ? Y : Q({
			stepName: `${n} > ${r.first?.label ?? "First"}`,
			recordOutputSchema: t,
			selectedField: i,
			path: s,
			isFullRecord: a,
			stepNameLabel: o
		});
	}
	if (l === "totalCount") {
		let e = r.totalCount?.label ?? "Total Count", i = `${n} > ${e}`;
		return {
			variableLabel: e,
			variablePathLabel: o ? `${i} (${o})` : i,
			variableType: t.NUMBER
		};
	}
	if (l === "all") {
		let e = r.all?.label ?? "All Records", i = `${n} > ${e}`;
		return {
			variableLabel: e,
			variablePathLabel: o ? `${i} (${o})` : i,
			variableType: t.ARRAY
		};
	}
	return Y;
}, xn = ({ stepName: t, formOutputSchema: n, rawVariableName: r, isFullRecord: i }) => {
	if (!e(n)) return Y;
	let a = z(Z(r)), o = a[0], s = a[1], c = a.slice(2), l = c[c.length - 1], u = c.slice(0, -1);
	if (!e(o) || !e(s)) return Y;
	let d = n[s];
	return e(d) ? d.isLeaf ? {
		variableLabel: d.label,
		variablePathLabel: `${t} > ${d.label}`,
		variableType: d.type
	} : !d.isLeaf && e(l) ? Q({
		stepName: `${t} > ${d.label}`,
		recordOutputSchema: d.value,
		selectedField: l,
		path: u,
		isFullRecord: i
	}) : Y : Y;
}, Sn = ({ stepName: n, codeOutputSchema: r, rawVariableName: i }) => !e(r) || p(r) && "_outputSchemaType" in r && r._outputSchemaType === "LINK" ? Y : z(Z(i)).length === 1 && on(r) ? {
	variableLabel: n,
	variablePathLabel: n,
	variableType: t.ARRAY
} : yn({
	stepName: n,
	baseOutputSchema: r,
	rawVariableName: i
}), Cn = ({ stepName: n, iteratorOutputSchema: r, rawVariableName: i, isFullRecord: a }) => {
	if (!e(r)) return Y;
	let o = z(Z(i)), s = o[0], c = o[1], l = o.slice(2);
	if (!e(s) || !e(c)) return Y;
	if (c === "currentItemIndex") return {
		variableLabel: "Current Item Index",
		variablePathLabel: `${n} > Current Item Index`,
		variableType: t.NUMBER
	};
	if (c === "hasProcessedAllItems") return {
		variableLabel: "Has Processed All Items",
		variablePathLabel: `${n} > Has Processed All Items`,
		variableType: t.BOOLEAN
	};
	if (c === "currentItem") {
		let t = r.currentItem.value;
		if (!e(t)) return Y;
		let i = l[l.length - 1], o = l.slice(0, -1);
		if (X(t) && e(i)) return Q({
			stepName: `${n} > Current Item`,
			recordOutputSchema: t,
			path: o,
			selectedField: i,
			isFullRecord: a
		});
		if (un(t) && e(i)) return $({
			stepName: n,
			baseOutputSchema: t,
			path: o,
			selectedField: i
		});
		let s = r.currentItem;
		return {
			variableLabel: s.label,
			variablePathLabel: `${n} > ${s.label}`,
			variableType: s.isLeaf ? s.type : "unknown"
		};
	}
	return Y;
}, wn = ({ stepName: t, manualTriggerOutputSchema: n, rawVariableName: r, isFullRecord: i }) => {
	if (!e(n)) return Y;
	let a = z(Z(r)), o = a[0], s = a[1], c = a.slice(2), l = c[c.length - 1], u = c.slice(0, -1);
	if (!e(o) || !e(s) || !e(l)) return Y;
	if (s === "payload") {
		let { payload: r } = n;
		if (!e(r)) return Y;
		let a = `${t} > ${r.label}`;
		return X(r.value) ? Q({
			stepName: a,
			recordOutputSchema: r.value,
			selectedField: l,
			path: u,
			isFullRecord: i
		}) : $({
			stepName: a,
			baseOutputSchema: r.value,
			path: u,
			selectedField: l
		});
	}
	if (s === "metadata") {
		let { metadata: e } = n;
		return $({
			stepName: `${t} > ${e.label}`,
			baseOutputSchema: e.value,
			path: u,
			selectedField: l
		});
	}
	return Y;
}, Tn = ({ schema: e, stepType: t, stepName: n, rawVariableName: r, isFullRecord: i, stepNameLabel: a }) => ln.includes(t) ? _n({
	stepName: n,
	recordOutputSchema: e,
	rawVariableName: r,
	isFullRecord: i
}) : t === "MANUAL" ? wn({
	stepName: n,
	manualTriggerOutputSchema: e,
	rawVariableName: r,
	isFullRecord: i
}) : t === "DATABASE_EVENT" ? vn({
	stepName: n,
	recordOutputSchema: e,
	rawVariableName: r,
	isFullRecord: i
}) : t === "FIND_RECORDS" ? bn({
	stepName: n,
	findRecordsOutputSchema: e,
	rawVariableName: r,
	isFullRecord: i,
	stepNameLabel: a
}) : t === "FORM" ? xn({
	stepName: n,
	formOutputSchema: e,
	rawVariableName: r,
	isFullRecord: i
}) : t === "CODE" ? Sn({
	stepName: n,
	codeOutputSchema: e,
	rawVariableName: r
}) : t === "ITERATOR" ? Cn({
	stepName: n,
	iteratorOutputSchema: e,
	rawVariableName: r,
	isFullRecord: i
}) : yn({
	stepName: n,
	baseOutputSchema: e,
	rawVariableName: r
});
//#endregion
export { m as CAPTURE_ALL_VARIABLE_TAG_INNER_REGEX, ne as CONTENT_TYPE_VALUES_HTTP_REQUEST, re as IF_ELSE_BRANCH_POSITION_OFFSETS, ie as OBJECTS_BLOCKED_FROM_AUTOMATION, Xe as StepStatus, h as TRIGGER_STEP_ID, fe as WORKFLOW_DIAGRAM_DEFAULT_NODE_DIMENSIONS, pe as WORKFLOW_LAYOUT_DEFAULT_OPTIONS, ae as WORKFLOW_TRIGGER_METADATA_KEY, oe as WORKFLOW_TRIGGER_METADATA_LABEL, se as WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_KEY, ce as WORKFLOW_TRIGGER_METADATA_WORKSPACE_MEMBER_ID_LABEL, le as WORKFLOW_TRIGGER_PAYLOAD_KEY, de as WORKFLOW_TRIGGER_RECORDS_LABEL, ue as WORKFLOW_TRIGGER_RECORD_LABEL, L as WorkflowActionType, v as baseTriggerSchema, _ as baseWorkflowActionSchema, g as baseWorkflowActionSettingsSchema, an as buildManualTriggerMetadataNode, At as buildWorkflowGraph, ft as canObjectBeManagedByAutomation, B as collectOutputSchemaPaths, q as collectOutputSchemaVariablePaths, me as computeWorkflowLayout, wt as escapePathSegment, y as expectedOutputSchemaShape, pt as extractRawVariableNamePart, Nt as extractVariablesFromInput, It as findOutputSchemaPathFailure, sn as getCurrentItemSchemaFromFlattenedArrayOutputSchema, Pt as getEditDistance, mt as getFunctionInputFromInputSchema, Ot as getStepInput, kt as getStepOutgoingStepIds, Gt as getVariablePathSuggestions, ht as getWorkflowRunContext, Ft as isBaseOutputSchemaV2, on as isFlattenedArrayOutputSchema, Et as isIfElseStepInput, Dt as isIteratorStepInput, gt as isStandaloneVariableString, Tt as joinVariablePath, cn as navigateOutputSchemaProperty, Ct as needsEscaping, b as objectRecordSchema, _t as parseBooleanFromStringValue, xt as parseDataFromContentType, z as parseVariablePath, G as resolveInSchema, Ht as resolveVariablePathInOutputSchema, Q as searchRecordOutputSchema, Tn as searchVariableInOutputSchema, x as stepFilterGroupSchema, S as stepFilterSchema, Me as stepIfElseBranchSchema, Kt as validateWorkflowGraph, Zt as validateWorkflowStepParams, rn as validateWorkflowStructure, Qt as validateWorkflowVariableReferences, P as workflowActionSchema, ge as workflowAiAgentActionSchema, he as workflowAiAgentActionSettingsSchema, ve as workflowCodeActionSchema, _e as workflowCodeActionSettingsSchema, be as workflowCreateCalendarEventActionSchema, ye as workflowCreateCalendarEventActionSettingsSchema, Se as workflowCreateRecordActionSchema, xe as workflowCreateRecordActionSettingsSchema, Ce as workflowCronTriggerSchema, we as workflowDatabaseEventTriggerSchema, Ye as workflowDelayActionSchema, Je as workflowDelayActionSettingsSchema, Ee as workflowDeleteRecordActionSchema, Te as workflowDeleteRecordActionSettingsSchema, T as workflowDraftEmailActionSchema, Oe as workflowEmailFilesSchema, D as workflowEmptyActionSchema, E as workflowEmptyActionSettingsSchema, De as workflowFileSchema, k as workflowFilterActionSchema, O as workflowFilterActionSettingsSchema, j as workflowFindRecordsActionSchema, A as workflowFindRecordsActionSettingsSchema, ke as workflowFormActionSchema, M as workflowFormActionSettingsSchema, je as workflowHttpRequestActionSchema, Ae as workflowHttpRequestActionSettingsSchema, Pe as workflowIfElseActionSchema, Ne as workflowIfElseActionSettingsSchema, Ie as workflowIteratorActionSchema, Fe as workflowIteratorActionSettingsSchema, Re as workflowLogicFunctionActionSchema, Le as workflowLogicFunctionActionSettingsSchema, ze as workflowManualTriggerSchema, He as workflowPickRecordActionSchema, Ve as workflowPickRecordActionSettingsSchema, Be as workflowPickRecordStrategySchema, dt as workflowRunSchema, $e as workflowRunStateSchema, F as workflowRunStateStepInfoSchema, Qe as workflowRunStateStepInfosSchema, et as workflowRunStatusSchema, lt as workflowRunStepLogSchema, ut as workflowRunStepLogsSchema, Ze as workflowRunStepStatusSchema, Ue as workflowSendEmailActionSchema, w as workflowSendEmailActionSettingsSchema, I as workflowTriggerSchema, Ge as workflowUpdateRecordActionSchema, We as workflowUpdateRecordActionSettingsSchema, qe as workflowUpsertRecordActionSchema, Ke as workflowUpsertRecordActionSettingsSchema, C as workflowVariableReferenceSchema, N as workflowWebhookTriggerSchema };
