//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = class extends Error {
	constructor(e, t) {
		let n = Array.isArray(e) ? e.map((e) => e?.message || "").join("\n") : "";
		n ||= "GraphQL error", super(n), this.errors = [], this.errors = e, this.data = t;
	}
};
//#endregion
//#region src/metadata/generated/runtime/batcher.ts
function r(e, t) {
	let r = t.map((e) => e.request);
	r.length === 1 && (r = r[0]), e.fetcher(r).then((e) => {
		if (t.length === 1 && !Array.isArray(e)) {
			if (e.errors && e.errors.length) {
				t[0].reject(new n(e.errors, e.data));
				return;
			}
			t[0].resolve(e);
			return;
		} else if (e.length !== t.length) throw Error("response length did not match query length");
		for (let r = 0; r < t.length; r++) e[r].errors && e[r].errors.length ? t[r].reject(new n(e[r].errors, e[r].data)) : t[r].resolve(e[r]);
	}).catch((e) => {
		for (let n of t) n.reject(e);
	});
}
function i(e, t) {
	let n = e._queue, i = t.maxBatchSize || 0;
	if (e._queue = [], i > 0 && i < n.length) for (let t = 0; t < n.length / i; t++) r(e, n.slice(t * i, (t + 1) * i));
	else r(e, n);
}
var a = class e {
	constructor(e, { batchInterval: t = 6, shouldBatch: n = !0, maxBatchSize: r = 0 } = {}) {
		this.fetcher = e, this._options = {
			batchInterval: t,
			shouldBatch: n,
			maxBatchSize: r
		}, this._queue = [];
	}
	fetch(e, t, n, r = {}) {
		let a = { query: e }, o = Object.assign({}, this._options, r);
		return t && (a.variables = t), n && (a.operationName = n), new Promise((e, t) => {
			this._queue.push({
				request: a,
				resolve: e,
				reject: t
			}), this._queue.length === 1 && (o.shouldBatch ? setTimeout(() => i(this, o), o.batchInterval) : i(this, o));
		});
	}
	forceFetch(t, n, r, a = {}) {
		let o = { query: t }, s = Object.assign({}, this._options, a, { shouldBatch: !1 });
		return n && (o.variables = n), r && (o.operationName = r), new Promise((t, n) => {
			let r = new e(this.fetcher, this._options);
			r._queue = [{
				request: o,
				resolve: t,
				reject: n
			}], i(r, s);
		});
	}
}, o = {
	maxBatchSize: 10,
	batchInterval: 40
}, s = ({ url: e, headers: t = {}, fetcher: r, fetch: i, batch: s = !1, ...c }) => {
	if (!e && !r) throw Error("url or fetcher is required");
	if (r ||= async (n) => {
		let r = typeof t == "function" ? await t() : t;
		if (r ||= {}, typeof fetch > "u" && !i) throw Error("Global `fetch` function is not available, pass a fetch polyfill to Genql `createClient`");
		let a = await (i || fetch)(e, {
			headers: {
				"Content-Type": "application/json",
				...r
			},
			method: "POST",
			body: JSON.stringify(n),
			...c
		});
		if (!a.ok) throw Error(`${a.statusText}: ${await a.text()}`);
		return await a.json();
	}, !s) return async (e) => {
		let t = await r(e);
		if (Array.isArray(t)) return t.map((e) => {
			if (e?.errors?.length) throw new n(e.errors || [], e.data);
			return e.data;
		});
		if (t?.errors?.length) throw new n(t.errors || [], t.data);
		return t.data;
	};
	let l = new a(async (e) => await r(e), s === !0 ? o : s);
	return async ({ query: e, variables: t }) => {
		let n = await l.fetch(e, t);
		if (n?.data) return n.data;
		throw Error("Genql batch fetcher returned unexpected result " + JSON.stringify(n));
	};
}, c = (e, t, n) => {
	if (typeof e == "object" && "__args" in e) {
		let r = e.__args, i = { ...e };
		delete i.__args;
		let a = Object.keys(r);
		if (a.length === 0) return c(i, t, n);
		let o = u(t.root, n);
		return `(${a.map((e) => {
			t.varCounter++;
			let i = `v${t.varCounter}`, a = o.args && o.args[e];
			if (!a) throw Error(`no typing defined for argument \`${e}\` in path \`${n.join(".")}\``);
			return t.variables[i] = {
				value: r[e],
				typing: a
			}, `${e}:$${i}`;
		})})${c(i, t, n)}`;
	} else if (typeof e == "object" && Object.keys(e).length > 0) {
		let r = e, i = Object.keys(r).filter((e) => !!r[e]);
		if (i.length === 0) throw Error(`field selection should not be empty: ${n.join(".")}`);
		let a = n.length > 0 ? u(t.root, n).type : t.root, o = a.scalar, s;
		if (i.includes("__scalar")) {
			let e = new Set(Object.keys(r).filter((e) => !r[e]));
			o?.length && (t.fragmentCounter++, s = `f${t.fragmentCounter}`, t.fragments.push(`fragment ${s} on ${a.name}{${o.filter((t) => !e.has(t)).join(",")}}`));
		}
		return `{${i.filter((e) => !["__scalar", "__name"].includes(e)).map((e) => {
			let i = c(r[e], t, [...n, e]);
			if (e.startsWith("on_")) {
				t.fragmentCounter++;
				let n = `f${t.fragmentCounter}`, r = e.match(/^on_(.+)/);
				if (!r || !r[1]) throw Error("match failed");
				return t.fragments.push(`fragment ${n} on ${r[1]}${i}`), `...${n}`;
			} else return `${e}${i}`;
		}).concat(s ? [`...${s}`] : []).join(",")}}`;
	} else return "";
}, l = (e, t, n) => {
	let r = {
		root: t,
		varCounter: 0,
		variables: {},
		fragmentCounter: 0,
		fragments: []
	}, i = c(n, r, []), a = Object.keys(r.variables), o = a.length > 0 ? `(${a.map((e) => `$${e}:${r.variables[e].typing[1]}`)})` : "", s = n?.__name || "";
	return {
		query: [`${e} ${s}${o}${i}`, ...r.fragments].join(","),
		variables: Object.keys(r.variables).reduce((e, t) => (e[t] = r.variables[t].value, e), {}),
		...s ? { operationName: s.toString() } : {}
	};
}, u = (e, t) => {
	let n;
	if (!e) throw Error("root type is not provided");
	if (t.length === 0) throw Error("path is empty");
	return t.forEach((t) => {
		let r = n ? n.type : e;
		if (!r.fields) throw Error(`type \`${r.name}\` does not have fields`);
		let i = Object.keys(r.fields).filter((e) => e.startsWith("on_")).reduce((e, t) => {
			let n = r.fields && r.fields[t];
			return n && e.push(n.type), e;
		}, [r]), a = null;
		if (i.forEach((e) => {
			let n = e.fields && e.fields[t];
			n && (a = n);
		}), !a) throw Error(`type \`${r.name}\` does not have a field \`${t}\``);
		n = a;
	}), n;
}, ee = ({ queryRoot: e, mutationRoot: t, subscriptionRoot: n, ...r }) => {
	let i = s(r), a = {};
	return e && (a.query = (t) => {
		if (!e) throw Error("queryRoot argument is missing");
		return i(l("query", e, t));
	}), t && (a.mutation = (e) => {
		if (!t) throw Error("mutationRoot argument is missing");
		return i(l("mutation", t, e));
	}), a;
}, te = (e) => {
	let t = Object.assign({}, ...Object.keys(e.types).map((e, t) => ({ [t]: e })));
	return ne(Object.assign({}, ...Object.keys(e.types || {}).map((n) => {
		let r = e.types[n] || {};
		return { [n]: {
			name: n,
			scalar: Object.keys(r).filter((t) => {
				let [n] = r[t] || [];
				return n && e.scalars.includes(n);
			}),
			fields: Object.assign({}, ...Object.keys(r).map((e) => {
				let [n, i] = r[e] || [];
				return n == null ? {} : { [e]: {
					type: t[n],
					args: Object.assign({}, ...Object.keys(i || {}).map((e) => {
						if (!i || !i[e]) return;
						let [n, r] = i[e];
						return { [e]: [t[n], r || t[n]] };
					}))
				} };
			}))
		} };
	})));
}, ne = (e) => (Object.keys(e).forEach((t) => {
	let n = e[t];
	if (!n.fields) return;
	let r = n.fields;
	Object.keys(r).forEach((t) => {
		let n = r[t];
		if (n.args) {
			let t = n.args;
			Object.keys(t).forEach((n) => {
				let r = t[n];
				if (r) {
					let [t] = r;
					typeof t == "string" && (e[t] || (e[t] = { name: t }), r[0] = e[t]);
				}
			});
		}
		let i = n.type;
		typeof i == "string" && (e[i] || (e[i] = { name: i }), n.type = e[i]);
	});
}), e), re = {
	scalars: [
		1,
		3,
		4,
		6,
		8,
		9,
		15,
		16,
		17,
		22,
		24,
		26,
		27,
		34,
		35,
		36,
		37,
		40,
		42,
		48,
		51,
		53,
		55,
		57,
		60,
		63,
		64,
		65,
		66,
		67,
		69,
		70,
		72,
		73,
		76,
		77,
		78,
		84,
		87,
		92,
		93,
		96,
		97,
		99,
		102,
		103,
		113,
		128,
		134,
		135,
		136,
		138,
		147,
		149,
		157,
		160,
		162,
		178,
		186,
		193,
		194,
		201,
		204,
		207,
		218,
		235,
		236,
		238,
		243,
		246,
		255,
		288,
		296,
		297,
		298,
		300,
		301,
		302,
		303,
		304,
		305,
		306,
		313,
		314,
		317,
		354,
		361,
		363,
		364,
		365,
		366,
		368,
		370,
		375,
		390,
		402,
		517,
		541
	],
	types: {
		BillingProductDTO: {
			name: [1],
			description: [1],
			images: [1],
			metadata: [133],
			on_BillingLicensedProduct: [142],
			on_BillingMeteredProduct: [143],
			__typename: [1]
		},
		String: {},
		ApiKey: {
			id: [3],
			name: [1],
			expiresAt: [4],
			revokedAt: [4],
			createdAt: [4],
			updatedAt: [4],
			role: [46],
			__typename: [1]
		},
		UUID: {},
		DateTime: {},
		ApplicationRegistrationSummary: {
			id: [3],
			latestAvailableVersion: [1],
			sourceType: [6],
			logoUrl: [1],
			__typename: [1]
		},
		ApplicationRegistrationSourceType: {},
		ApplicationVariable: {
			id: [3],
			key: [1],
			value: [1],
			description: [1],
			label: [1],
			isSecret: [8],
			isDeprecated: [8],
			type: [1],
			options: [9],
			__typename: [1]
		},
		Boolean: {},
		JSON: {},
		Agent: {
			id: [3],
			name: [1],
			label: [1],
			icon: [1],
			description: [1],
			prompt: [1],
			modelId: [1],
			responseFormat: [9],
			roleId: [3],
			isCustom: [8],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			modelConfiguration: [9],
			evaluationInputs: [1],
			__typename: [1]
		},
		AuthToken: {
			token: [1],
			expiresAt: [4],
			__typename: [1]
		},
		ApplicationTokenPair: {
			applicationAccessToken: [11],
			applicationRefreshToken: [11],
			__typename: [1]
		},
		FrontComponent: {
			id: [3],
			name: [1],
			description: [1],
			sourceComponentPath: [1],
			builtComponentPath: [1],
			componentName: [1],
			builtComponentChecksum: [1],
			universalIdentifier: [3],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			isHeadless: [8],
			usesSdkClient: [8],
			applicationTokenPair: [12],
			applicationVariables: [9],
			frontComponentSharedDependenciesChecksum: [1],
			__typename: [1]
		},
		CommandMenuItem: {
			id: [3],
			workflowVersionId: [3],
			frontComponentId: [3],
			frontComponent: [13],
			engineComponentKey: [16],
			label: [1],
			icon: [1],
			shortLabel: [1],
			position: [15],
			isPinned: [8],
			availabilityType: [17],
			payload: [18],
			hotKeys: [1],
			conditionalAvailabilityExpression: [1],
			availabilityObjectMetadataId: [3],
			navigationTargetObjectMetadataId: [3],
			pageLayoutId: [3],
			universalIdentifier: [3],
			applicationId: [3],
			isActive: [8],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		Float: {},
		EngineComponentKey: {},
		CommandMenuItemAvailabilityType: {},
		CommandMenuItemPayload: {
			on_PathCommandMenuItemPayload: [19],
			on_ObjectMetadataCommandMenuItemPayload: [20],
			__typename: [1]
		},
		PathCommandMenuItemPayload: {
			path: [1],
			__typename: [1]
		},
		ObjectMetadataCommandMenuItemPayload: {
			objectMetadataItemId: [3],
			__typename: [1]
		},
		LogicFunction: {
			id: [3],
			name: [1],
			description: [1],
			runtime: [1],
			timeoutSeconds: [15],
			executionMode: [22],
			sourceHandlerPath: [1],
			handlerName: [1],
			cronTriggerSettings: [9],
			databaseEventTriggerSettings: [9],
			httpRouteTriggerSettings: [9],
			toolTriggerSettings: [9],
			workflowActionTriggerSettings: [9],
			applicationId: [3],
			universalIdentifier: [3],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		LogicFunctionExecutionMode: {},
		Object: {
			id: [3],
			universalIdentifier: [1],
			nameSingular: [1],
			namePlural: [1],
			labelSingular: [1],
			labelPlural: [1],
			description: [1],
			icon: [1],
			shortcut: [1],
			color: [1],
			isRemote: [8],
			isActive: [8],
			isSystem: [8],
			isUIEditable: [8],
			isUICreatable: [8],
			isUIReadOnly: [8],
			isSearchable: [8],
			openRecordIn: [24],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			labelIdentifierFieldMetadataId: [3],
			imageIdentifierFieldMetadataId: [3],
			isLabelSyncedWithName: [8],
			duplicateCriteria: [1],
			fields: [250, {
				paging: [25, "CursorPaging!"],
				filter: [28, "FieldFilter!"]
			}],
			indexMetadatas: [251, {
				paging: [25, "CursorPaging!"],
				filter: [31, "IndexFilter!"]
			}],
			fieldsList: [237],
			indexMetadataList: [245],
			searchFieldMetadataList: [253],
			__typename: [1]
		},
		ObjectOpenRecordIn: {},
		CursorPaging: {
			before: [27],
			after: [27],
			first: [26],
			last: [26],
			__typename: [1]
		},
		Int: {},
		ConnectionCursor: {},
		FieldFilter: {
			and: [28],
			or: [28],
			id: [29],
			isActive: [30],
			isSystem: [30],
			isUIEditable: [30],
			isUIReadOnly: [30],
			objectMetadataId: [29],
			__typename: [1]
		},
		UUIDFilterComparison: {
			is: [8],
			isNot: [8],
			eq: [3],
			neq: [3],
			gt: [3],
			gte: [3],
			lt: [3],
			lte: [3],
			like: [3],
			notLike: [3],
			iLike: [3],
			notILike: [3],
			in: [3],
			notIn: [3],
			__typename: [1]
		},
		BooleanFieldComparison: {
			is: [8],
			isNot: [8],
			__typename: [1]
		},
		IndexFilter: {
			and: [31],
			or: [31],
			id: [29],
			isCustom: [30],
			__typename: [1]
		},
		FullName: {
			firstName: [1],
			lastName: [1],
			__typename: [1]
		},
		WorkspaceMember: {
			id: [3],
			name: [32],
			userEmail: [1],
			colorScheme: [1],
			uiScale: [1],
			openRecordIn: [34],
			avatarUrl: [1],
			locale: [1],
			calendarStartDay: [26],
			timeZone: [1],
			dateFormat: [35],
			timeFormat: [36],
			roles: [46],
			userWorkspaceId: [3],
			numberFormat: [37],
			__typename: [1]
		},
		OpenRecordIn: {},
		WorkspaceMemberDateFormatEnum: {},
		WorkspaceMemberTimeFormatEnum: {},
		WorkspaceMemberNumberFormatEnum: {},
		FieldPermission: {
			id: [3],
			objectMetadataId: [3],
			fieldMetadataId: [3],
			roleId: [3],
			canReadFieldValue: [8],
			canUpdateFieldValue: [8],
			__typename: [1]
		},
		RowLevelPermissionPredicateGroup: {
			id: [1],
			parentRowLevelPermissionPredicateGroupId: [1],
			logicalOperator: [40],
			positionInRowLevelPermissionPredicateGroup: [15],
			roleId: [1],
			objectMetadataId: [1],
			__typename: [1]
		},
		RowLevelPermissionPredicateGroupLogicalOperator: {},
		RowLevelPermissionPredicate: {
			id: [1],
			fieldMetadataId: [1],
			objectMetadataId: [1],
			operand: [42],
			subFieldName: [1],
			workspaceMemberFieldMetadataId: [1],
			workspaceMemberSubFieldName: [1],
			rowLevelPermissionPredicateGroupId: [1],
			positionInRowLevelPermissionPredicateGroup: [15],
			roleId: [1],
			value: [9],
			__typename: [1]
		},
		RowLevelPermissionPredicateOperand: {},
		ObjectPermission: {
			objectMetadataId: [3],
			canReadObjectRecords: [8],
			canUpdateObjectRecords: [8],
			canSoftDeleteObjectRecords: [8],
			canDestroyObjectRecords: [8],
			restrictedFields: [9],
			rowLevelPermissionPredicates: [41],
			rowLevelPermissionPredicateGroups: [39],
			__typename: [1]
		},
		RolePermissionFlag: {
			id: [3],
			roleId: [3],
			flag: [1],
			__typename: [1]
		},
		ApiKeyForRole: {
			id: [3],
			name: [1],
			expiresAt: [4],
			revokedAt: [4],
			__typename: [1]
		},
		Role: {
			id: [3],
			universalIdentifier: [3],
			label: [1],
			description: [1],
			icon: [1],
			isEditable: [8],
			canBeAssignedToUsers: [8],
			canBeAssignedToAgents: [8],
			canBeAssignedToApiKeys: [8],
			workspaceMembers: [33],
			agents: [10],
			apiKeys: [45],
			canUpdateAllSettings: [8],
			canAccessAllTools: [8],
			canReadAllObjectRecords: [8],
			canUpdateAllObjectRecords: [8],
			canSoftDeleteAllObjectRecords: [8],
			canDestroyAllObjectRecords: [8],
			permissionFlags: [44],
			objectPermissions: [43],
			fieldPermissions: [38],
			rowLevelPermissionPredicates: [41],
			rowLevelPermissionPredicateGroups: [39],
			__typename: [1]
		},
		Application: {
			id: [3],
			name: [1],
			description: [1],
			logoFileId: [3],
			version: [1],
			universalIdentifier: [1],
			state: [48],
			packageJsonChecksum: [1],
			packageJsonFileId: [3],
			yarnLockChecksum: [1],
			yarnLockFileId: [3],
			availablePackages: [9],
			applicationRegistrationId: [3],
			canBeUninstalled: [8],
			autoUpgrade: [8],
			defaultRoleId: [1],
			settingsCustomTabFrontComponentId: [3],
			defaultLogicFunctionRole: [46],
			agents: [10],
			frontComponents: [13],
			commandMenuItems: [14],
			logicFunctions: [21],
			objects: [23],
			applicationVariables: [7],
			applicationRegistration: [5],
			logoUrl: [1],
			__typename: [1]
		},
		ApplicationState: {},
		TwoFactorAuthenticationMethodSummary: {
			twoFactorAuthenticationMethodId: [3],
			status: [1],
			strategy: [1],
			__typename: [1]
		},
		UserWorkspace: {
			id: [3],
			user: [71],
			userId: [3],
			locale: [1],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			permissionFlags: [51],
			objectPermissions: [43],
			objectsPermissions: [43],
			twoFactorAuthenticationMethodSummary: [49],
			isImpersonating: [8],
			__typename: [1]
		},
		PermissionFlagType: {},
		ViewField: {
			id: [3],
			universalIdentifier: [3],
			applicationId: [3],
			isSystemSideEffect: [8],
			fieldMetadataId: [3],
			isVisible: [8],
			size: [15],
			position: [15],
			aggregateOperation: [53],
			viewId: [3],
			viewFieldGroupId: [3],
			workspaceId: [3],
			createdAt: [4],
			updatedAt: [4],
			isActive: [8],
			deletedAt: [4],
			isOverridden: [8],
			__typename: [1]
		},
		AggregateOperations: {},
		ViewFilterGroup: {
			id: [3],
			parentViewFilterGroupId: [3],
			logicalOperator: [55],
			positionInViewFilterGroup: [15],
			viewId: [3],
			workspaceId: [3],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			__typename: [1]
		},
		ViewFilterGroupLogicalOperator: {},
		ViewFilter: {
			id: [3],
			fieldMetadataId: [3],
			operand: [57],
			value: [9],
			viewFilterGroupId: [3],
			positionInViewFilterGroup: [15],
			subFieldName: [1],
			relationTargetFieldMetadataId: [3],
			viewId: [3],
			workspaceId: [3],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			__typename: [1]
		},
		ViewFilterOperand: {},
		ViewGroup: {
			id: [3],
			isVisible: [8],
			fieldValue: [1],
			position: [15],
			viewId: [3],
			workspaceId: [3],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			__typename: [1]
		},
		ViewSort: {
			id: [3],
			fieldMetadataId: [3],
			direction: [60],
			subFieldName: [1],
			viewId: [3],
			workspaceId: [3],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			__typename: [1]
		},
		ViewSortDirection: {},
		ViewFieldGroup: {
			id: [3],
			name: [1],
			position: [15],
			isVisible: [8],
			viewId: [3],
			workspaceId: [3],
			createdAt: [4],
			updatedAt: [4],
			isActive: [8],
			deletedAt: [4],
			viewFields: [52],
			isOverridden: [8],
			__typename: [1]
		},
		View: {
			id: [3],
			universalIdentifier: [3],
			applicationId: [3],
			isSystemSideEffect: [8],
			name: [1],
			objectMetadataId: [3],
			type: [63],
			key: [64],
			icon: [1],
			position: [15],
			isCompact: [8],
			isCustom: [8],
			openRecordIn: [65],
			kanbanAggregateOperation: [53],
			kanbanAggregateOperationFieldMetadataId: [3],
			mainGroupByFieldMetadataId: [3],
			shouldHideEmptyGroups: [8],
			kanbanColumnWidth: [26],
			calendarFieldMetadataId: [3],
			calendarEndFieldMetadataId: [3],
			workspaceId: [3],
			anyFieldFilterValue: [1],
			calendarLayout: [66],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			viewFields: [52],
			viewFilters: [56],
			viewFilterGroups: [54],
			viewSorts: [59],
			viewGroups: [58],
			viewFieldGroups: [61],
			visibility: [67],
			createdByUserWorkspaceId: [3],
			isActive: [8],
			__typename: [1]
		},
		ViewType: {},
		ViewKey: {},
		ViewOpenRecordIn: {},
		ViewCalendarLayout: {},
		ViewVisibility: {},
		Workspace: {
			id: [3],
			displayName: [1],
			logo: [1],
			logoFileId: [3],
			inviteHash: [1],
			deletedAt: [4],
			createdAt: [4],
			updatedAt: [4],
			allowImpersonation: [8],
			isPublicInviteLinkEnabled: [8],
			workspaceDiscoverability: [69],
			trashRetentionDays: [15],
			eventLogRetentionDays: [15],
			workspaceMembersCount: [15],
			activationStatus: [70],
			views: [62],
			viewFields: [52],
			viewFilters: [56],
			viewFilterGroups: [54],
			viewGroups: [58],
			viewSorts: [59],
			metadataVersion: [15],
			databaseSchema: [1],
			subdomain: [1],
			customDomain: [1],
			isGoogleAuthEnabled: [8],
			isGoogleAuthBypassEnabled: [8],
			isTwoFactorAuthenticationEnforced: [8],
			isPasswordAuthEnabled: [8],
			isPasswordAuthBypassEnabled: [8],
			isMicrosoftAuthEnabled: [8],
			isMicrosoftAuthBypassEnabled: [8],
			isCustomDomainEnabled: [8],
			isInternalMessagesImportEnabled: [8],
			editableProfileFields: [1],
			defaultRole: [46],
			fastModel: [1],
			smartModel: [1],
			aiAdditionalInstructions: [1],
			enabledAiModelIds: [1],
			useRecommendedModels: [8],
			routerModel: [1],
			workspaceCustomApplication: [47],
			featureFlags: [185],
			billingSubscriptions: [146],
			installedApplications: [47],
			currentBillingSubscription: [146],
			billingCustomer: [145],
			billingEntitlements: [254],
			hasValidSignedEnterpriseKey: [8],
			hasValidEnterpriseValidityToken: [8],
			workspaceUrls: [187],
			workspaceCustomApplicationId: [1],
			__typename: [1]
		},
		WorkspaceDiscoverability: {},
		WorkspaceActivationStatus: {},
		User: {
			id: [3],
			firstName: [1],
			lastName: [1],
			email: [1],
			isEmailVerified: [8],
			disabled: [8],
			canImpersonate: [8],
			canAccessFullAdminPanel: [8],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			locale: [1],
			workspaceMember: [33],
			userWorkspaces: [50],
			onboardingStatus: [72],
			previousOnboardingStatus: [72],
			currentWorkspace: [68],
			currentUserWorkspace: [50],
			userVars: [73],
			workspaceMembers: [33],
			deletedWorkspaceMembers: [228],
			hasPassword: [8],
			supportUserHash: [1],
			isWorkspaceCreator: [8],
			workspaces: [50],
			availableWorkspaces: [227],
			__typename: [1]
		},
		OnboardingStatus: {},
		JSONObject: {},
		ApplicationRegistration: {
			id: [3],
			universalIdentifier: [1],
			name: [1],
			oAuthClientId: [1],
			oAuthRedirectUris: [1],
			oAuthScopes: [1],
			ownerWorkspaceId: [3],
			sourceType: [6],
			sourcePackage: [1],
			latestAvailableVersion: [1],
			isListed: [8],
			isVetted: [8],
			isPreInstalled: [8],
			createdAt: [4],
			updatedAt: [4],
			isConfigured: [8],
			logoUrl: [1],
			galleryImagesUrls: [1],
			__typename: [1]
		},
		UsageLimit: {
			id: [3],
			resourceType: [76],
			operationType: [77],
			spenderType: [1],
			spenderId: [1],
			limitKind: [1],
			windowSeconds: [26],
			limitValueType: [1],
			limitValue: [78],
			burstValue: [78],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		UsageResourceType: {},
		UsageOperationType: {},
		BigInt: {},
		SdkClientChecksums: {
			core: [1],
			metadata: [1],
			__typename: [1]
		},
		RatioAggregateConfig: {
			fieldMetadataId: [3],
			optionValue: [1],
			__typename: [1]
		},
		RichTextBody: {
			blocknote: [1],
			markdown: [1],
			__typename: [1]
		},
		GridPosition: {
			row: [15],
			column: [15],
			rowSpan: [15],
			columnSpan: [15],
			__typename: [1]
		},
		PageLayoutWidget: {
			id: [3],
			universalIdentifier: [3],
			isSystemSideEffect: [8],
			applicationId: [3],
			pageLayoutTabId: [3],
			title: [1],
			type: [84],
			objectMetadataId: [3],
			gridPosition: [82],
			position: [85],
			configuration: [90],
			conditionalDisplay: [9],
			conditionalAvailabilityExpression: [1],
			createdAt: [4],
			updatedAt: [4],
			isActive: [8],
			deletedAt: [4],
			isOverridden: [8],
			__typename: [1]
		},
		WidgetType: {},
		PageLayoutWidgetPosition: {
			on_PageLayoutWidgetGridPosition: [86],
			on_PageLayoutWidgetVerticalListPosition: [88],
			on_PageLayoutWidgetCanvasPosition: [89],
			__typename: [1]
		},
		PageLayoutWidgetGridPosition: {
			layoutMode: [87],
			row: [26],
			column: [26],
			rowSpan: [26],
			columnSpan: [26],
			__typename: [1]
		},
		PageLayoutTabLayoutMode: {},
		PageLayoutWidgetVerticalListPosition: {
			layoutMode: [87],
			index: [26],
			__typename: [1]
		},
		PageLayoutWidgetCanvasPosition: {
			layoutMode: [87],
			__typename: [1]
		},
		WidgetConfiguration: {
			on_AggregateChartConfiguration: [91],
			on_StandaloneRichTextConfiguration: [94],
			on_PieChartConfiguration: [95],
			on_LineChartConfiguration: [98],
			on_IframeConfiguration: [100],
			on_BarChartConfiguration: [101],
			on_CalendarConfiguration: [104],
			on_FrontComponentConfiguration: [105],
			on_EmailsConfiguration: [106],
			on_EmailThreadConfiguration: [107],
			on_CallRecordingSummaryConfiguration: [108],
			on_CallRecordingTranscriptConfiguration: [109],
			on_MessageCampaignBodyConfiguration: [110],
			on_MessageCampaignDetailsConfiguration: [111],
			on_FieldConfiguration: [112],
			on_FieldRichTextConfiguration: [114],
			on_FieldsConfiguration: [115],
			on_FormFieldConfiguration: [116],
			on_FilesConfiguration: [117],
			on_NotesConfiguration: [118],
			on_TasksConfiguration: [119],
			on_TimelineConfiguration: [120],
			on_ViewConfiguration: [121],
			on_RecordTableConfiguration: [122],
			on_WorkflowConfiguration: [123],
			on_WorkflowRunConfiguration: [124],
			on_WorkflowVersionConfiguration: [125],
			__typename: [1]
		},
		AggregateChartConfiguration: {
			configurationType: [92],
			aggregateFieldMetadataId: [3],
			aggregateOperation: [53],
			label: [1],
			displayDataLabel: [8],
			numberFormat: [93],
			description: [1],
			filter: [9],
			timezone: [1],
			firstDayOfTheWeek: [26],
			prefix: [1],
			suffix: [1],
			ratioAggregateConfig: [80],
			__typename: [1]
		},
		WidgetConfigurationType: {},
		ChartNumberFormat: {},
		StandaloneRichTextConfiguration: {
			configurationType: [92],
			body: [81],
			__typename: [1]
		},
		PieChartConfiguration: {
			configurationType: [92],
			aggregateFieldMetadataId: [3],
			aggregateOperation: [53],
			groupByFieldMetadataId: [3],
			groupBySubFieldName: [1],
			dateGranularity: [96],
			orderBy: [97],
			manualSortOrder: [1],
			displayDataLabel: [8],
			showCenterMetric: [8],
			displayLegend: [8],
			hideEmptyCategory: [8],
			numberFormat: [93],
			splitMultiValueFields: [8],
			description: [1],
			color: [1],
			filter: [9],
			timezone: [1],
			firstDayOfTheWeek: [26],
			__typename: [1]
		},
		ObjectRecordGroupByDateGranularity: {},
		GraphOrderBy: {},
		LineChartConfiguration: {
			configurationType: [92],
			aggregateFieldMetadataId: [3],
			aggregateOperation: [53],
			primaryAxisGroupByFieldMetadataId: [3],
			primaryAxisGroupBySubFieldName: [1],
			primaryAxisDateGranularity: [96],
			primaryAxisOrderBy: [97],
			primaryAxisManualSortOrder: [1],
			secondaryAxisGroupByFieldMetadataId: [3],
			secondaryAxisGroupBySubFieldName: [1],
			secondaryAxisGroupByDateGranularity: [96],
			secondaryAxisOrderBy: [97],
			secondaryAxisManualSortOrder: [1],
			omitNullValues: [8],
			splitMultiValueFields: [8],
			axisNameDisplay: [99],
			displayDataLabel: [8],
			displayLegend: [8],
			numberFormat: [93],
			rangeMin: [15],
			rangeMax: [15],
			description: [1],
			color: [1],
			filter: [9],
			isStacked: [8],
			isCumulative: [8],
			timezone: [1],
			firstDayOfTheWeek: [26],
			__typename: [1]
		},
		AxisNameDisplay: {},
		IframeConfiguration: {
			configurationType: [92],
			url: [1],
			__typename: [1]
		},
		BarChartConfiguration: {
			configurationType: [92],
			aggregateFieldMetadataId: [3],
			aggregateOperation: [53],
			primaryAxisGroupByFieldMetadataId: [3],
			primaryAxisGroupBySubFieldName: [1],
			primaryAxisDateGranularity: [96],
			primaryAxisOrderBy: [97],
			primaryAxisManualSortOrder: [1],
			secondaryAxisGroupByFieldMetadataId: [3],
			secondaryAxisGroupBySubFieldName: [1],
			secondaryAxisGroupByDateGranularity: [96],
			secondaryAxisOrderBy: [97],
			secondaryAxisManualSortOrder: [1],
			omitNullValues: [8],
			splitMultiValueFields: [8],
			axisNameDisplay: [99],
			displayDataLabel: [8],
			displayLegend: [8],
			numberFormat: [93],
			rangeMin: [15],
			rangeMax: [15],
			description: [1],
			color: [1],
			filter: [9],
			groupMode: [102],
			layout: [103],
			isCumulative: [8],
			timezone: [1],
			firstDayOfTheWeek: [26],
			__typename: [1]
		},
		BarChartGroupMode: {},
		BarChartLayout: {},
		CalendarConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		FrontComponentConfiguration: {
			configurationType: [92],
			frontComponentId: [3],
			headerCommandMenuItemUniversalIdentifiers: [3],
			__typename: [1]
		},
		EmailsConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		EmailThreadConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		CallRecordingSummaryConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		CallRecordingTranscriptConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		MessageCampaignBodyConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		MessageCampaignDetailsConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		FieldConfiguration: {
			configurationType: [92],
			fieldMetadataId: [1],
			fieldDisplayMode: [113],
			viewId: [1],
			nestedRelationFieldMetadataId: [1],
			isUIEditable: [8],
			__typename: [1]
		},
		FieldDisplayMode: {},
		FieldRichTextConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		FieldsConfiguration: {
			configurationType: [92],
			viewId: [1],
			newFieldDefaultVisibility: [8],
			shouldAllowUserToSeeHiddenFields: [8],
			__typename: [1]
		},
		FormFieldConfiguration: {
			configurationType: [92],
			fieldMetadataId: [1],
			__typename: [1]
		},
		FilesConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		NotesConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		TasksConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		TimelineConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		ViewConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		RecordTableConfiguration: {
			configurationType: [92],
			viewId: [1],
			recordLimit: [26],
			isUIEditable: [8],
			__typename: [1]
		},
		WorkflowConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		WorkflowRunConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		WorkflowVersionConfiguration: {
			configurationType: [92],
			__typename: [1]
		},
		PageLayoutTab: {
			id: [3],
			universalIdentifier: [3],
			isSystemSideEffect: [8],
			applicationId: [3],
			title: [1],
			position: [15],
			pageLayoutId: [3],
			widgets: [83],
			icon: [1],
			layoutMode: [87],
			createdAt: [4],
			updatedAt: [4],
			isActive: [8],
			deletedAt: [4],
			isOverridden: [8],
			__typename: [1]
		},
		PageLayout: {
			id: [3],
			name: [1],
			type: [128],
			objectMetadataId: [3],
			tabs: [126],
			defaultTabToFocusOnMobileAndSidePanelId: [3],
			universalIdentifier: [3],
			applicationId: [3],
			isSystemSideEffect: [8],
			isFirstTabPinned: [8],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			__typename: [1]
		},
		PageLayoutType: {},
		ApplicationConnectionProviderOAuthConfig: {
			scopes: [1],
			isClientCredentialsConfigured: [8],
			__typename: [1]
		},
		ApplicationConnectionProvider: {
			id: [3],
			applicationId: [1],
			type: [1],
			name: [1],
			displayName: [1],
			oauth: [129],
			__typename: [1]
		},
		BillingSubscriptionSchedulePhaseItem: {
			price: [1],
			quantity: [15],
			__typename: [1]
		},
		BillingSubscriptionSchedulePhase: {
			start_date: [15],
			end_date: [15],
			items: [131],
			__typename: [1]
		},
		BillingProductMetadata: {
			planKey: [134],
			priceUsageBased: [135],
			productKey: [136],
			__typename: [1]
		},
		BillingPlanKey: {},
		BillingUsageType: {},
		BillingProductKey: {},
		BillingPriceLicensed: {
			recurringInterval: [138],
			unitAmount: [15],
			stripePriceId: [1],
			priceUsageType: [135],
			creditAmount: [15],
			__typename: [1]
		},
		SubscriptionInterval: {},
		BillingPriceTier: {
			upTo: [15],
			flatAmount: [15],
			unitAmount: [15],
			__typename: [1]
		},
		BillingPriceMetered: {
			tiers: [139],
			recurringInterval: [138],
			stripePriceId: [1],
			priceUsageType: [135],
			__typename: [1]
		},
		BillingProduct: {
			name: [1],
			description: [1],
			images: [1],
			metadata: [133],
			__typename: [1]
		},
		BillingLicensedProduct: {
			name: [1],
			description: [1],
			images: [1],
			metadata: [133],
			prices: [137],
			__typename: [1]
		},
		BillingMeteredProduct: {
			name: [1],
			description: [1],
			images: [1],
			metadata: [133],
			prices: [140],
			__typename: [1]
		},
		BillingSubscriptionItem: {
			id: [3],
			hasReachedCurrentPeriodCap: [8],
			quantity: [15],
			stripePriceId: [1],
			billingProduct: [0],
			__typename: [1]
		},
		BillingCustomer: {
			id: [3],
			hasPaymentMethod: [8],
			__typename: [1]
		},
		BillingSubscription: {
			id: [3],
			status: [147],
			interval: [138],
			billingSubscriptionItems: [144],
			currentPeriodEnd: [4],
			metadata: [9],
			phases: [132],
			cancelAt: [4],
			__typename: [1]
		},
		SubscriptionStatus: {},
		LogicFunctionExecutionResult: {
			data: [9],
			logs: [1],
			duration: [15],
			status: [149],
			error: [9],
			__typename: [1]
		},
		LogicFunctionExecutionStatus: {},
		EnterpriseLicenseInfoDTO: {
			isValid: [8],
			licensee: [1],
			expiresAt: [4],
			subscriptionId: [1],
			__typename: [1]
		},
		EnterpriseSubscriptionStatusDTO: {
			status: [1],
			licensee: [1],
			expiresAt: [4],
			cancelAt: [4],
			currentPeriodEnd: [4],
			isCancellationScheduled: [8],
			__typename: [1]
		},
		ApprovedAccessDomain: {
			id: [3],
			domain: [1],
			isValidated: [8],
			createdAt: [4],
			__typename: [1]
		},
		FileWithSignedUrl: {
			id: [3],
			path: [1],
			size: [15],
			createdAt: [4],
			url: [1],
			__typename: [1]
		},
		FileUploadTarget: {
			fileId: [3],
			uploadUrl: [1],
			contentType: [1],
			expiresAt: [4],
			__typename: [1]
		},
		RecordIdentifier: {
			id: [3],
			labelIdentifier: [1],
			imageIdentifier: [1],
			__typename: [1]
		},
		NavigationMenuItem: {
			id: [3],
			userWorkspaceId: [3],
			targetRecordId: [3],
			targetObjectMetadataId: [3],
			viewId: [3],
			type: [157],
			name: [1],
			link: [1],
			icon: [1],
			color: [1],
			folderId: [3],
			pageLayoutId: [3],
			position: [15],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			targetRecordIdentifier: [155],
			__typename: [1]
		},
		NavigationMenuItemType: {},
		ObjectRecordEventProperties: {
			updatedFields: [1],
			before: [9],
			after: [9],
			diff: [9],
			__typename: [1]
		},
		MetadataEvent: {
			type: [160],
			metadataName: [1],
			recordId: [1],
			properties: [158],
			updatedCollectionHash: [1],
			__typename: [1]
		},
		MetadataEventAction: {},
		ObjectRecordEvent: {
			action: [162],
			objectNameSingular: [1],
			recordId: [1],
			userId: [1],
			workspaceMemberId: [1],
			properties: [158],
			__typename: [1]
		},
		DatabaseEventAction: {},
		ObjectRecordEventWithQueryIds: {
			queryIds: [1],
			objectRecordEvent: [161],
			__typename: [1]
		},
		EventSubscription: {
			eventStreamId: [1],
			objectRecordEventsWithQueryIds: [163],
			metadataEvents: [159],
			__typename: [1]
		},
		UserSession: {
			id: [3],
			workspaceId: [3],
			authProvider: [1],
			isImpersonating: [8],
			userAgent: [1],
			ipAddress: [1],
			createdAt: [4],
			lastActiveAt: [4],
			expiresAt: [4],
			isCurrent: [8],
			__typename: [1]
		},
		BillingEndTrialPeriod: {
			status: [147],
			hasPaymentMethod: [8],
			billingPortalUrl: [1],
			currentBillingSubscription: [146],
			billingSubscriptions: [146],
			__typename: [1]
		},
		BillingResourceCreditUsage: {
			productKey: [136],
			periodStart: [4],
			periodEnd: [4],
			usedCredits: [15],
			grantedCredits: [15],
			rolloverCredits: [15],
			totalGrantedCredits: [15],
			unitPriceCents: [15],
			__typename: [1]
		},
		BillingPlan: {
			planKey: [134],
			baseProducts: [142],
			resourceCreditProducts: [142],
			meteredProducts: [143],
			__typename: [1]
		},
		BillingPaymentIntent: {
			clientSecret: [1],
			paymentIntentType: [1],
			__typename: [1]
		},
		BillingSession: {
			url: [1],
			__typename: [1]
		},
		BillingUpdate: {
			currentBillingSubscription: [146],
			billingSubscriptions: [146],
			__typename: [1]
		},
		InviteSuggestion: {
			email: [1],
			displayName: [1],
			__typename: [1]
		},
		OnboardingStepNavigation: {
			onboardingStatus: [72],
			previousOnboardingStatus: [72],
			__typename: [1]
		},
		OnboardingStepSuccess: {
			success: [8],
			__typename: [1]
		},
		WorkspaceInvitation: {
			id: [3],
			email: [1],
			roleId: [3],
			expiresAt: [4],
			__typename: [1]
		},
		SendInvitations: {
			success: [8],
			errors: [1],
			result: [175],
			__typename: [1]
		},
		PublicConnectionParametersOutput: {
			host: [1],
			port: [15],
			username: [1],
			connectionSecurity: [178],
			__typename: [1]
		},
		EmailConnectionSecurity: {},
		PublicImapSmtpCaldavConnectionParameters: {
			IMAP: [177],
			SMTP: [177],
			CALDAV: [177],
			__typename: [1]
		},
		ConnectedAccountPublicDTO: {
			id: [3],
			handle: [1],
			provider: [1],
			lastCredentialsRefreshedAt: [4],
			authFailedAt: [4],
			archivedAt: [4],
			handleAliases: [1],
			scopes: [1],
			lastSignedInAt: [4],
			userWorkspaceId: [3],
			connectionProviderId: [3],
			applicationId: [3],
			name: [1],
			visibility: [1],
			createdAt: [4],
			updatedAt: [4],
			connectionParameters: [179],
			__typename: [1]
		},
		UsageBreakdownItem: {
			key: [1],
			label: [1],
			creditsUsed: [15],
			__typename: [1]
		},
		UsageTimeSeries: {
			date: [1],
			creditsUsed: [15],
			__typename: [1]
		},
		UsageUserDaily: {
			userWorkspaceId: [1],
			dailyUsage: [182],
			__typename: [1]
		},
		UsageAnalytics: {
			usageByUser: [181],
			usageByOperationType: [181],
			usageByModel: [181],
			timeSeries: [182],
			periodStart: [4],
			periodEnd: [4],
			userDailyUsage: [183],
			__typename: [1]
		},
		FeatureFlag: {
			key: [186],
			value: [8],
			__typename: [1]
		},
		FeatureFlagKey: {},
		WorkspaceUrls: {
			customUrl: [1],
			subdomainUrl: [1],
			__typename: [1]
		},
		ApplicationRegistrationVariable: {
			id: [3],
			key: [1],
			value: [1],
			description: [1],
			isSecret: [8],
			isRequired: [8],
			isDeprecated: [8],
			isFilled: [8],
			type: [1],
			options: [9],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		VersionDistributionEntry: {
			version: [1],
			count: [26],
			__typename: [1]
		},
		ApplicationRegistrationStats: {
			activeInstalls: [26],
			suspendedInstalls: [26],
			mostInstalledVersion: [1],
			versionDistribution: [189],
			__typename: [1]
		},
		BillingTrialPeriod: {
			duration: [15],
			isCreditCardRequired: [8],
			__typename: [1]
		},
		SSOIdentityProvider: {
			id: [3],
			name: [1],
			type: [193],
			status: [194],
			issuer: [1],
			__typename: [1]
		},
		IdentityProviderType: {},
		SSOIdentityProviderStatus: {},
		AuthProviders: {
			sso: [192],
			google: [8],
			magicLink: [8],
			password: [8],
			microsoft: [8],
			__typename: [1]
		},
		AuthBypassProviders: {
			google: [8],
			password: [8],
			microsoft: [8],
			__typename: [1]
		},
		PublicWorkspaceData: {
			id: [3],
			authProviders: [195],
			authBypassProviders: [196],
			logo: [1],
			displayName: [1],
			workspaceUrls: [187],
			__typename: [1]
		},
		PublicWorkspaceDataSummary: {
			id: [3],
			logo: [1],
			displayName: [1],
			__typename: [1]
		},
		NativeModelCapabilities: {
			webSearch: [8],
			twitterSearch: [8],
			__typename: [1]
		},
		ClientAiModelConfig: {
			modelId: [1],
			label: [1],
			modelFamily: [201],
			modelFamilyLabel: [1],
			sdkPackage: [1],
			inputCostPerMillionTokens: [15],
			outputCostPerMillionTokens: [15],
			nativeCapabilities: [199],
			isDeprecated: [8],
			isRecommended: [8],
			providerName: [1],
			providerLabel: [1],
			contextWindowTokens: [15],
			maxOutputTokens: [15],
			dataResidency: [1],
			__typename: [1]
		},
		ModelFamily: {},
		Billing: {
			isBillingEnabled: [8],
			billingUrl: [1],
			stripePublishableKey: [1],
			trialPeriods: [191],
			__typename: [1]
		},
		Support: {
			supportDriver: [204],
			supportFrontChatId: [1],
			__typename: [1]
		},
		SupportDriver: {},
		Sentry: {
			environment: [1],
			release: [1],
			dsn: [1],
			tracesSampleRate: [15],
			__typename: [1]
		},
		Captcha: {
			provider: [207],
			siteKey: [1],
			__typename: [1]
		},
		CaptchaDriverType: {},
		ApiConfig: {
			mutationMaximumAffectedRecords: [15],
			__typename: [1]
		},
		PublicFeatureFlagMetadata: {
			label: [1],
			description: [1],
			icon: [1],
			imagePath: [1],
			__typename: [1]
		},
		PublicFeatureFlag: {
			key: [186],
			metadata: [209],
			__typename: [1]
		},
		ClientConfigMaintenanceMode: {
			startAt: [4],
			endAt: [4],
			link: [1],
			__typename: [1]
		},
		ClientConfig: {
			appVersion: [1],
			authProviders: [195],
			billing: [202],
			aiModels: [200],
			signInPrefilled: [8],
			isMultiWorkspaceEnabled: [8],
			isEmailVerificationRequired: [8],
			defaultSubdomain: [1],
			frontDomain: [1],
			publicFunctionDomain: [1],
			analyticsEnabled: [8],
			support: [203],
			isAttachmentPreviewEnabled: [8],
			sentry: [205],
			captcha: [206],
			api: [208],
			canManageFeatureFlags: [8],
			publicFeatureFlags: [210],
			isCookieSessionEnabled: [8],
			isMicrosoftMessagingEnabled: [8],
			isMicrosoftCalendarEnabled: [8],
			isGoogleMessagingEnabled: [8],
			isGoogleCalendarEnabled: [8],
			isConfigVariablesInDbEnabled: [8],
			isImapSmtpCaldavEnabled: [8],
			isEmailingDomainInDemoMode: [8],
			allowRequestsToTwentyIcons: [8],
			calendarBookingPageId: [1],
			isBookCallOnboardingStepEnabled: [8],
			isCompanyEnrichmentEnabled: [8],
			isCloudflareIntegrationEnabled: [8],
			isClickHouseConfigured: [8],
			isWorkspaceSchemaDDLLocked: [8],
			isOnboardingAiChatEnabled: [8],
			enterpriseInstanceType: [1],
			maintenance: [211],
			__typename: [1]
		},
		ClaimableApplicationRegistration: {
			id: [1],
			universalIdentifier: [1],
			name: [1],
			sourcePackage: [1],
			logoUrl: [1],
			description: [1],
			author: [1],
			isOwned: [8],
			__typename: [1]
		},
		CreateApplicationRegistration: {
			applicationRegistration: [74],
			clientSecret: [1],
			__typename: [1]
		},
		PublicApplicationRegistration: {
			id: [3],
			name: [1],
			logoUrl: [1],
			websiteUrl: [1],
			oAuthScopes: [1],
			__typename: [1]
		},
		RotateClientSecret: {
			clientSecret: [1],
			__typename: [1]
		},
		AppConnection: {
			id: [218],
			providerName: [1],
			name: [1],
			handle: [1],
			visibility: [1],
			userWorkspaceId: [1],
			workspaceMemberId: [1],
			accessToken: [1],
			scopes: [1],
			authFailedAt: [1],
			__typename: [1]
		},
		ID: {},
		ResendEmailVerificationToken: {
			success: [8],
			__typename: [1]
		},
		DeleteSso: {
			identityProviderId: [3],
			__typename: [1]
		},
		EditSso: {
			id: [3],
			type: [193],
			issuer: [1],
			name: [1],
			status: [194],
			__typename: [1]
		},
		WorkspaceNameAndId: {
			displayName: [1],
			id: [3],
			__typename: [1]
		},
		FindAvailableSSOIDP: {
			type: [193],
			id: [3],
			issuer: [1],
			name: [1],
			status: [194],
			workspace: [222],
			__typename: [1]
		},
		SetupSso: {
			id: [3],
			type: [193],
			issuer: [1],
			name: [1],
			status: [194],
			__typename: [1]
		},
		SSOConnection: {
			type: [193],
			id: [3],
			issuer: [1],
			name: [1],
			status: [194],
			__typename: [1]
		},
		AvailableWorkspace: {
			id: [3],
			displayName: [1],
			loginToken: [1],
			personalInviteToken: [1],
			inviteHash: [1],
			workspaceUrls: [187],
			logo: [1],
			sso: [225],
			__typename: [1]
		},
		AvailableWorkspaces: {
			availableWorkspacesForSignIn: [226],
			availableWorkspacesForSignUp: [226],
			__typename: [1]
		},
		DeletedWorkspaceMember: {
			id: [3],
			name: [32],
			userEmail: [1],
			avatarUrl: [1],
			userWorkspaceId: [3],
			__typename: [1]
		},
		MarketplaceApp: {
			id: [1],
			name: [1],
			description: [1],
			author: [1],
			category: [1],
			logoUrl: [1],
			sourcePackage: [1],
			isVetted: [8],
			__typename: [1]
		},
		MarketplaceAppRoleObjectPermission: {
			universalIdentifier: [1],
			objectUniversalIdentifier: [1],
			canReadObjectRecords: [8],
			canUpdateObjectRecords: [8],
			canSoftDeleteObjectRecords: [8],
			canDestroyObjectRecords: [8],
			__typename: [1]
		},
		MarketplaceAppRoleFieldPermission: {
			universalIdentifier: [1],
			objectUniversalIdentifier: [1],
			fieldUniversalIdentifier: [1],
			canReadFieldValue: [8],
			canUpdateFieldValue: [8],
			__typename: [1]
		},
		MarketplaceAppRole: {
			universalIdentifier: [1],
			label: [1],
			description: [1],
			icon: [1],
			canUpdateAllSettings: [8],
			canAccessAllTools: [8],
			canReadAllObjectRecords: [8],
			canUpdateAllObjectRecords: [8],
			canSoftDeleteAllObjectRecords: [8],
			canDestroyAllObjectRecords: [8],
			permissionFlagUniversalIdentifiers: [1],
			objectPermissions: [230],
			fieldPermissions: [231],
			__typename: [1]
		},
		MarketplaceAppDetail: {
			universalIdentifier: [1],
			id: [1],
			name: [1],
			sourceType: [6],
			sourcePackage: [1],
			latestAvailableVersion: [1],
			isListed: [8],
			isVetted: [8],
			description: [1],
			author: [1],
			category: [1],
			logoUrl: [1],
			websiteUrl: [1],
			aboutDescription: [1],
			termsUrl: [1],
			emailSupport: [1],
			issueReportUrl: [1],
			screenshots: [1],
			galleryImages: [1],
			defaultRoleUniversalIdentifier: [1],
			roles: [232],
			manifest: [9],
			__typename: [1]
		},
		WorkspaceCompanyEnrichmentResult: {
			outcome: [235],
			enrichment: [9],
			personOutcome: [236],
			personEnrichment: [9],
			isBookCallOnboardingStepPending: [8],
			__typename: [1]
		},
		WorkspaceCompanyEnrichmentOutcome: {},
		WorkspacePersonEnrichmentOutcome: {},
		Field: {
			id: [3],
			universalIdentifier: [1],
			type: [238],
			name: [1],
			label: [1],
			description: [1],
			icon: [1],
			isActive: [8],
			isSystem: [8],
			isUIEditable: [8],
			isUIReadOnly: [8],
			isNullable: [8],
			isUnique: [8],
			defaultValue: [9],
			options: [9],
			settings: [9],
			objectMetadataId: [3],
			isLabelSyncedWithName: [8],
			morphId: [3],
			createdAt: [4],
			updatedAt: [4],
			applicationId: [3],
			object: [23],
			relation: [242],
			morphRelations: [242],
			__typename: [1]
		},
		FieldMetadataType: {},
		PageInfo: {
			hasNextPage: [8],
			hasPreviousPage: [8],
			startCursor: [27],
			endCursor: [27],
			__typename: [1]
		},
		FieldEdge: {
			node: [237],
			cursor: [27],
			__typename: [1]
		},
		FieldConnection: {
			pageInfo: [239],
			edges: [240],
			__typename: [1]
		},
		Relation: {
			type: [243],
			sourceObjectMetadata: [23],
			targetObjectMetadata: [23],
			sourceFieldMetadata: [237],
			targetFieldMetadata: [237],
			__typename: [1]
		},
		RelationType: {},
		IndexField: {
			id: [3],
			fieldMetadataId: [3],
			order: [15],
			subFieldName: [1],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		Index: {
			id: [3],
			name: [1],
			isCustom: [8],
			isUnique: [8],
			indexWhereClause: [1],
			indexType: [246],
			createdAt: [4],
			updatedAt: [4],
			indexFieldMetadataList: [244],
			__typename: [1]
		},
		IndexType: {},
		IndexEdge: {
			node: [245],
			cursor: [27],
			__typename: [1]
		},
		ObjectEdge: {
			node: [23],
			cursor: [27],
			__typename: [1]
		},
		ObjectConnection: {
			pageInfo: [239],
			edges: [248],
			__typename: [1]
		},
		ObjectFieldsConnection: {
			pageInfo: [239],
			edges: [240],
			__typename: [1]
		},
		ObjectIndexMetadatasConnection: {
			pageInfo: [239],
			edges: [247],
			__typename: [1]
		},
		ObjectRecordCount: {
			objectNamePlural: [1],
			totalCount: [26],
			__typename: [1]
		},
		SearchField: {
			id: [3],
			fieldMetadataId: [3],
			tsVectorFieldMetadataId: [3],
			position: [15],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		BillingEntitlement: {
			key: [255],
			value: [8],
			__typename: [1]
		},
		BillingEntitlementKey: {},
		DomainRecord: {
			validationType: [1],
			type: [1],
			status: [1],
			key: [1],
			value: [1],
			__typename: [1]
		},
		DomainValidRecords: {
			id: [3],
			domain: [1],
			records: [256],
			isCustomDomainEnabled: [8],
			__typename: [1]
		},
		UpsertRowLevelPermissionPredicatesResult: {
			predicates: [41],
			predicateGroups: [39],
			__typename: [1]
		},
		LogicFunctionLogs: {
			logs: [1],
			__typename: [1]
		},
		DeleteTwoFactorAuthenticationMethod: {
			success: [8],
			__typename: [1]
		},
		InitiateTwoFactorAuthenticationProvisioning: {
			uri: [1],
			__typename: [1]
		},
		VerifyTwoFactorAuthenticationMethod: {
			success: [8],
			__typename: [1]
		},
		AuthorizeApp: {
			redirectUrl: [1],
			__typename: [1]
		},
		AuthTokenPair: {
			accessOrWorkspaceAgnosticToken: [11],
			refreshToken: [11],
			__typename: [1]
		},
		AvailableWorkspacesAndAccessTokens: {
			tokens: [264],
			availableWorkspaces: [227],
			__typename: [1]
		},
		EmailPasswordResetLink: {
			success: [8],
			__typename: [1]
		},
		GetAuthorizationUrlForSSO: {
			authorizationURL: [1],
			type: [1],
			id: [3],
			__typename: [1]
		},
		InvalidatePassword: {
			success: [8],
			__typename: [1]
		},
		WorkspaceUrlsAndId: {
			workspaceUrls: [187],
			id: [3],
			__typename: [1]
		},
		SignUp: {
			loginToken: [11],
			workspace: [269],
			__typename: [1]
		},
		TransientToken: {
			transientToken: [11],
			__typename: [1]
		},
		ValidatePasswordResetToken: {
			id: [3],
			email: [1],
			hasPassword: [8],
			__typename: [1]
		},
		VerifyEmailAndGetLoginToken: {
			loginToken: [11],
			workspaceUrls: [187],
			__typename: [1]
		},
		SubdomainAvailabilityDTO: {
			isValid: [8],
			available: [8],
			suggestedSubdomain: [1],
			suggestedSubdomains: [1],
			__typename: [1]
		},
		WorkspaceCreationDefaultsDTO: {
			displayName: [1],
			subdomain: [1],
			__typename: [1]
		},
		ApiKeyToken: {
			token: [1],
			__typename: [1]
		},
		AuthTokens: {
			tokens: [264],
			__typename: [1]
		},
		LoginToken: {
			loginToken: [11],
			__typename: [1]
		},
		CheckUserExist: {
			exists: [8],
			availableWorkspacesCount: [15],
			isEmailVerified: [8],
			__typename: [1]
		},
		WorkspaceInviteHashValid: {
			isValid: [8],
			__typename: [1]
		},
		Impersonate: {
			loginToken: [11],
			workspace: [269],
			__typename: [1]
		},
		StopImpersonation: {
			canRestoreImpersonatorSession: [8],
			__typename: [1]
		},
		ApplicationAuthorization: {
			id: [3],
			applicationId: [3],
			workspaceId: [3],
			applicationName: [1],
			applicationUniversalIdentifier: [1],
			scopes: [1],
			lastAuthorizedAt: [4],
			lastUsedAt: [4],
			createdAt: [4],
			__typename: [1]
		},
		File: {
			id: [3],
			path: [1],
			size: [15],
			createdAt: [4],
			__typename: [1]
		},
		ApplicationFileCompletionError: {
			fileId: [3],
			message: [1],
			__typename: [1]
		},
		CompleteApplicationFileUploadsResult: {
			files: [284],
			errors: [285],
			__typename: [1]
		},
		ApplicationFileUploadTarget: {
			fileId: [3],
			fileFolder: [288],
			filePath: [1],
			uploadUrl: [1],
			contentType: [1],
			expiresAt: [4],
			__typename: [1]
		},
		FileFolder: {},
		ApplicationFileUploadError: {
			fileFolder: [288],
			filePath: [1],
			message: [1],
			__typename: [1]
		},
		CreateApplicationFileUploadsResult: {
			targets: [287],
			errors: [289],
			__typename: [1]
		},
		DevelopmentApplication: {
			id: [1],
			universalIdentifier: [1],
			__typename: [1]
		},
		WorkspaceMigration: {
			applicationUniversalIdentifier: [1],
			actions: [9],
			__typename: [1]
		},
		PublicDomain: {
			id: [3],
			domain: [1],
			isValidated: [8],
			applicationId: [3],
			createdAt: [4],
			__typename: [1]
		},
		VerificationRecord: {
			type: [1],
			key: [1],
			value: [1],
			priority: [15],
			status: [1],
			__typename: [1]
		},
		EmailingDomain: {
			id: [3],
			createdAt: [4],
			updatedAt: [4],
			domain: [1],
			status: [296],
			tenantStatus: [297],
			unsubscribeHostnameStatus: [298],
			verificationRecords: [294],
			verifiedAt: [4],
			__typename: [1]
		},
		EmailingDomainStatus: {},
		EmailingDomainTenantStatus: {},
		UnsubscribeHostnameStatus: {},
		MessageChannel: {
			id: [3],
			visibility: [300],
			handle: [1],
			displayName: [1],
			type: [301],
			isContactAutoCreationEnabled: [8],
			contactAutoCreationPolicy: [302],
			messageFolderImportPolicy: [303],
			excludeNonProfessionalEmails: [8],
			excludeGroupEmails: [8],
			pendingGroupEmailsAction: [304],
			isSyncEnabled: [8],
			syncedAt: [4],
			syncStatus: [305],
			syncStage: [306],
			syncStageStartedAt: [4],
			throttleFailureCount: [15],
			throttleRetryAfter: [4],
			connectedAccountId: [3],
			createdAt: [4],
			updatedAt: [4],
			connectedAccount: [180],
			__typename: [1]
		},
		MessageChannelVisibility: {},
		MessageChannelType: {},
		MessageChannelContactAutoCreationPolicy: {},
		MessageFolderImportPolicy: {},
		MessageChannelPendingGroupEmailsAction: {},
		MessageChannelSyncStatus: {},
		MessageChannelSyncStage: {},
		CreateEmailGroupChannelOutput: {
			messageChannel: [299],
			forwardingAddress: [1],
			__typename: [1]
		},
		CampaignAudiencePreviewDTO: {
			totalMembers: [26],
			withoutEmail: [26],
			duplicateEmails: [26],
			overCap: [26],
			globallyUnsubscribed: [26],
			topicUnsubscribed: [26],
			sendable: [26],
			__typename: [1]
		},
		CancelMessageCampaignOutputDTO: {
			campaignId: [1],
			canceledMessageCount: [26],
			__typename: [1]
		},
		SendEmailViaDomainOutput: {
			messageId: [1],
			__typename: [1]
		},
		SendMessageCampaignOutputDTO: {
			campaignId: [1],
			queuedCount: [26],
			audience: [308],
			__typename: [1]
		},
		MessageSuppression: {
			id: [3],
			createdAt: [4],
			emailAddress: [1],
			reason: [313],
			source: [314],
			unsubscribeTopicId: [3],
			__typename: [1]
		},
		MessageSuppressionReason: {},
		MessageSuppressionSource: {},
		MessageSuppressionList: {
			records: [312],
			totalCount: [26],
			__typename: [1]
		},
		UnsubscribeTopic: {
			id: [3],
			createdAt: [4],
			updatedAt: [4],
			name: [1],
			description: [1],
			visibility: [317],
			__typename: [1]
		},
		UnsubscribeTopicVisibility: {},
		AutocompleteResult: {
			text: [1],
			placeId: [1],
			__typename: [1]
		},
		Location: {
			lat: [15],
			lng: [15],
			__typename: [1]
		},
		PlaceDetailsResult: {
			street: [1],
			state: [1],
			postcode: [1],
			city: [1],
			country: [1],
			location: [319],
			__typename: [1]
		},
		ImapSmtpCaldavPublicConnectionParams: {
			host: [1],
			port: [15],
			username: [1],
			connectionSecurity: [178],
			__typename: [1]
		},
		ImapSmtpCaldavPublicConnectionParameters: {
			name: [1],
			IMAP: [321],
			SMTP: [321],
			CALDAV: [321],
			__typename: [1]
		},
		ConnectedImapSmtpCaldavAccount: {
			id: [3],
			handle: [1],
			provider: [1],
			userWorkspaceId: [3],
			connectionParameters: [322],
			__typename: [1]
		},
		ImapSmtpCaldavConnectionSuccess: {
			success: [8],
			connectedAccountId: [1],
			__typename: [1]
		},
		Webhook: {
			id: [3],
			targetUrl: [1],
			operations: [1],
			description: [1],
			secret: [1],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			__typename: [1]
		},
		ToolIndexEntry: {
			name: [1],
			label: [1],
			description: [1],
			category: [1],
			objectName: [1],
			icon: [1],
			inputSchema: [9],
			__typename: [1]
		},
		AgentMessagePart: {
			id: [3],
			messageId: [3],
			orderIndex: [26],
			type: [1],
			textContent: [1],
			reasoningContent: [1],
			toolName: [1],
			toolCallId: [1],
			toolInput: [9],
			toolOutput: [9],
			state: [1],
			providerExecuted: [8],
			errorMessage: [1],
			errorDetails: [9],
			sourceUrlSourceId: [1],
			sourceUrlUrl: [1],
			sourceUrlTitle: [1],
			sourceDocumentSourceId: [1],
			sourceDocumentMediaType: [1],
			sourceDocumentTitle: [1],
			sourceDocumentFilename: [1],
			fileMediaType: [1],
			fileFilename: [1],
			fileId: [3],
			fileUrl: [1],
			providerMetadata: [9],
			createdAt: [4],
			__typename: [1]
		},
		RunAgentResult: {
			result: [9],
			error: [1],
			success: [8],
			__typename: [1]
		},
		ChannelSyncSuccess: {
			success: [8],
			__typename: [1]
		},
		CreateCalendarEventOutput: {
			success: [8],
			iCalUid: [1],
			calendarEventId: [1],
			conferenceLink: [1],
			error: [1],
			__typename: [1]
		},
		BarChartSeries: {
			key: [1],
			label: [1],
			__typename: [1]
		},
		BarChartData: {
			data: [9],
			indexBy: [1],
			keys: [1],
			series: [331],
			xAxisLabel: [1],
			yAxisLabel: [1],
			showLegend: [8],
			showDataLabels: [8],
			layout: [103],
			groupMode: [102],
			hasTooManyGroups: [8],
			formattedToRawLookup: [9],
			__typename: [1]
		},
		LineChartDataPoint: {
			x: [1],
			y: [15],
			__typename: [1]
		},
		LineChartSeries: {
			key: [1],
			label: [1],
			data: [333],
			__typename: [1]
		},
		LineChartData: {
			series: [334],
			xAxisLabel: [1],
			yAxisLabel: [1],
			showLegend: [8],
			showDataLabels: [8],
			hasTooManyGroups: [8],
			formattedToRawLookup: [9],
			__typename: [1]
		},
		PieChartDataItem: {
			key: [1],
			value: [15],
			__typename: [1]
		},
		PieChartData: {
			data: [336],
			showLegend: [8],
			showDataLabels: [8],
			showCenterMetric: [8],
			hasTooManyGroups: [8],
			formattedToRawLookup: [9],
			__typename: [1]
		},
		DuplicatedDashboard: {
			id: [3],
			title: [1],
			pageLayoutId: [3],
			position: [15],
			createdAt: [1],
			updatedAt: [1],
			__typename: [1]
		},
		SendEmailOutput: {
			success: [8],
			error: [1],
			messageThreadId: [1],
			__typename: [1]
		},
		Analytics: {
			success: [8],
			__typename: [1]
		},
		EventLogRecord: {
			event: [1],
			timestamp: [4],
			userId: [1],
			properties: [9],
			recordId: [1],
			objectMetadataId: [1],
			isCustom: [8],
			__typename: [1]
		},
		EventLogPageInfo: {
			endCursor: [1],
			hasNextPage: [8],
			__typename: [1]
		},
		EventLogQueryResult: {
			records: [341],
			totalCount: [26],
			pageInfo: [342],
			__typename: [1]
		},
		Skill: {
			id: [3],
			name: [1],
			label: [1],
			icon: [1],
			description: [1],
			content: [1],
			isCustom: [8],
			isActive: [8],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		AgentMessage: {
			id: [3],
			threadId: [3],
			turnId: [3],
			agentId: [3],
			role: [1],
			status: [1],
			parts: [327],
			processedAt: [4],
			createdAt: [4],
			__typename: [1]
		},
		AgentChatThread: {
			id: [218],
			title: [1],
			totalInputTokens: [26],
			totalOutputTokens: [26],
			contextWindowTokens: [26],
			conversationSize: [26],
			totalInputCredits: [15],
			totalOutputCredits: [15],
			createdAt: [4],
			updatedAt: [4],
			deletedAt: [4],
			lastMessageAt: [4],
			__typename: [1]
		},
		AiSystemPromptSection: {
			title: [1],
			content: [1],
			estimatedTokenCount: [26],
			__typename: [1]
		},
		AiSystemPromptPreview: {
			sections: [347],
			estimatedTokenCount: [26],
			__typename: [1]
		},
		ChatStreamError: {
			code: [1],
			message: [1],
			__typename: [1]
		},
		ChatStreamCatchupChunks: {
			chunks: [9],
			maxSeq: [26],
			error: [349],
			__typename: [1]
		},
		SendChatMessageResult: {
			messageId: [1],
			queued: [8],
			streamId: [1],
			__typename: [1]
		},
		AgentChatEvent: {
			threadId: [1],
			event: [9],
			__typename: [1]
		},
		StartWorkspaceSetupChatResult: {
			outcome: [354],
			thread: [346],
			__typename: [1]
		},
		WorkspaceSetupChatOutcome: {},
		AgentTurnEvaluation: {
			id: [3],
			turnId: [3],
			score: [26],
			comment: [1],
			createdAt: [4],
			__typename: [1]
		},
		AgentTurn: {
			id: [3],
			threadId: [3],
			agentId: [3],
			evaluations: [355],
			messages: [345],
			createdAt: [4],
			__typename: [1]
		},
		WorkspaceAiStats: {
			conversationsCount: [26],
			skillsCount: [26],
			toolsCount: [26],
			__typename: [1]
		},
		EnqueueJobResult: {
			enqueued: [8],
			logicFunctionUniversalIdentifier: [1],
			__typename: [1]
		},
		EnqueueJobsResult: {
			enqueued: [8],
			logicFunctionUniversalIdentifier: [1],
			enqueuedJobsCount: [26],
			__typename: [1]
		},
		AppKeyValue: {
			key: [1],
			value: [9],
			scope: [361],
			__typename: [1]
		},
		AppKeyValueScope: {},
		CalendarChannel: {
			id: [3],
			handle: [1],
			syncStatus: [363],
			syncStage: [364],
			visibility: [365],
			isContactAutoCreationEnabled: [8],
			contactAutoCreationPolicy: [366],
			isSyncEnabled: [8],
			syncedAt: [4],
			syncStageStartedAt: [4],
			throttleFailureCount: [15],
			connectedAccountId: [3],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		CalendarChannelSyncStatus: {},
		CalendarChannelSyncStage: {},
		CalendarChannelVisibility: {},
		CalendarChannelContactAutoCreationPolicy: {},
		MessageFolder: {
			id: [3],
			name: [1],
			isSentFolder: [8],
			isSynced: [8],
			parentFolderId: [1],
			externalId: [1],
			pendingSyncAction: [368],
			messageChannelId: [3],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		MessageFolderPendingSyncAction: {},
		MetadataTranslation: {
			metadataName: [1],
			recordId: [3],
			objectMetadataId: [3],
			property: [1],
			locale: [1],
			sourceValue: [1],
			canonicalValue: [1],
			value: [1],
			provenance: [370],
			__typename: [1]
		},
		MetadataTranslationProvenance: {},
		TimelineActivityTypeEmitThrough: {
			relationFieldUniversalIdentifier: [3],
			triggerFieldUniversalIdentifiers: [3],
			happensAtFieldUniversalIdentifier: [3],
			__typename: [1]
		},
		TimelineActivityTypeEmit: {
			on: [1],
			objectUniversalIdentifier: [3],
			through: [371],
			__typename: [1]
		},
		TimelineActivityType: {
			id: [3],
			universalIdentifier: [3],
			name: [1],
			label: [1],
			emit: [372],
			action: [1],
			icon: [1],
			frontComponentUniversalIdentifier: [3],
			objectUniversalIdentifier: [3],
			replacesTimelineActivityTypeUniversalIdentifier: [3],
			isActive: [8],
			applicationId: [3],
			createdAt: [4],
			updatedAt: [4],
			__typename: [1]
		},
		CollectionHash: {
			collectionName: [375],
			hash: [1],
			__typename: [1]
		},
		AllMetadataName: {},
		MinimalObjectMetadata: {
			id: [3],
			nameSingular: [1],
			namePlural: [1],
			labelSingular: [1],
			labelPlural: [1],
			icon: [1],
			color: [1],
			isActive: [8],
			isSystem: [8],
			isRemote: [8],
			__typename: [1]
		},
		MinimalView: {
			id: [3],
			type: [63],
			key: [64],
			objectMetadataId: [3],
			__typename: [1]
		},
		MinimalMetadata: {
			objectMetadataItems: [376],
			views: [377],
			collectionHashes: [374],
			__typename: [1]
		},
		Query: {
			navigationMenuItems: [156],
			navigationMenuItem: [156, { id: [3, "UUID!"] }],
			applicationSdkClientChecksums: [79, { applicationId: [3, "UUID!"] }],
			isApplicationStopped: [8, { applicationUniversalIdentifier: [1, "String!"] }],
			enterprisePortalSession: [1, { returnUrlPath: [1] }],
			enterpriseCheckoutSession: [1, { billingInterval: [1] }],
			enterpriseSubscriptionStatus: [151],
			getUsageAnalytics: [184, { input: [380] }],
			usageLimits: [75],
			getViewFilterGroups: [54, { viewId: [1] }],
			getViewFilterGroup: [54, { id: [1, "String!"] }],
			getViewFilters: [56, { viewId: [1] }],
			getViewFilter: [56, { id: [1, "String!"] }],
			getViews: [62, {
				objectMetadataId: [1],
				viewTypes: [63, "[ViewType!]"]
			}],
			getView: [62, { id: [1, "String!"] }],
			getViewSorts: [59, { viewId: [1] }],
			getViewSort: [59, { id: [1, "String!"] }],
			getViewFields: [52, { viewId: [1, "String!"] }],
			getViewField: [52, { id: [1, "String!"] }],
			getViewFieldGroups: [61, { viewId: [1, "String!"] }],
			getViewFieldGroup: [61, { id: [1, "String!"] }],
			apiKeys: [2],
			getApiKeyRoles: [46],
			apiKey: [2, { input: [381, "GetApiKeyInput!"] }],
			currentUserSessions: [165],
			myConnectedAccounts: [180],
			applicationConnectionProviders: [130, { applicationId: [3, "UUID!"] }],
			getInviteSuggestions: [172],
			billingPortalSession: [170, {
				returnUrlPath: [1],
				forPaymentMethodUpdate: [8]
			}],
			listPlans: [168],
			getResourceCreditUsage: [167],
			findWorkspaceInvitations: [175],
			getApprovedAccessDomains: [152],
			getPageLayoutTabs: [126, { pageLayoutId: [1, "String!"] }],
			getPageLayoutTab: [126, { id: [1, "String!"] }],
			getPageLayouts: [127, {
				objectMetadataId: [1],
				pageLayoutType: [128]
			}],
			getPageLayout: [127, { id: [1, "String!"] }],
			getPageLayoutWidgets: [83, { pageLayoutTabId: [1, "String!"] }],
			getPageLayoutWidget: [83, { id: [1, "String!"] }],
			findManyAgents: [10],
			findOneAgent: [10, { input: [382, "AgentIdInput!"] }],
			objects: [249, {
				paging: [25, "CursorPaging!"],
				filter: [383, "ObjectFilter!"]
			}],
			object: [23, { id: [3, "UUID!"] }],
			objectRecordCounts: [252],
			mostlyEmptyFieldMetadataIds: [3, { objectMetadataId: [3, "UUID!"] }],
			findOneLogicFunction: [21, { input: [384, "LogicFunctionIdInput!"] }],
			findManyLogicFunctions: [21],
			getAvailablePackages: [9, { input: [384, "LogicFunctionIdInput!"] }],
			getLogicFunctionSourceCode: [1, { input: [384, "LogicFunctionIdInput!"] }],
			commandMenuItems: [14],
			commandMenuItem: [14, { id: [3, "UUID!"] }],
			frontComponents: [13],
			frontComponent: [13, { id: [3, "UUID!"] }],
			currentWorkspace: [68],
			getPublicWorkspaceDataByDomain: [197, { origin: [1] }],
			getPublicWorkspaceDataById: [198, { id: [3, "UUID!"] }],
			findApplicationRegistrationByClientId: [215, { clientId: [1, "String!"] }],
			findApplicationRegistrationByUniversalIdentifier: [74, { universalIdentifier: [1, "String!"] }],
			findManyApplicationRegistrations: [74],
			findOneApplicationRegistration: [74, { id: [1, "String!"] }],
			findApplicationRegistrationStats: [190, { id: [1, "String!"] }],
			findApplicationRegistrationVariables: [188, { applicationRegistrationId: [1, "String!"] }],
			applicationRegistrationTarballUrl: [1, { id: [1, "String!"] }],
			findClaimableApplicationRegistration: [213, {
				sourcePackage: [1],
				universalIdentifier: [1]
			}],
			githubClaimAuthorizationUrl: [1, { applicationRegistrationId: [1, "String!"] }],
			findManyApplications: [47],
			findOneApplication: [47, {
				id: [3],
				universalIdentifier: [3]
			}],
			findManyMarketplaceApps: [229, { universalIdentifiers: [1, "[String!]"] }],
			findMarketplaceAppDetail: [233, { universalIdentifier: [1, "String!"] }],
			publicMarketplaceApps: [229, { isVetted: [8, "Boolean!"] }],
			publicMarketplaceAppDetail: [233, { universalIdentifier: [1, "String!"] }],
			fields: [241, {
				paging: [25, "CursorPaging!"],
				filter: [28, "FieldFilter!"]
			}],
			field: [237, { id: [3, "UUID!"] }],
			getViewGroups: [58, { viewId: [1] }],
			getViewGroup: [58, { id: [1, "String!"] }],
			getRoles: [46],
			previewMessageCampaignAudience: [308, { input: [385, "PreviewMessageCampaignAudienceInput!"] }],
			messageSuppressions: [315, { input: [386, "FindMessageSuppressionsInput!"] }],
			unsubscribeTopics: [316],
			myMessageChannels: [299, { connectedAccountId: [3] }],
			getEmailingDomains: [295],
			getToolIndex: [326],
			getToolInputSchema: [9, { toolName: [1, "String!"] }],
			webhooks: [325],
			webhook: [325, { id: [3, "UUID!"] }],
			myMessageFolders: [367, { messageChannelId: [3] }],
			myCalendarChannels: [362, { connectedAccountId: [3] }],
			minimalMetadata: [378],
			appKeyValue: [360, {
				key: [1, "String!"],
				scope: [361]
			}],
			appConnections: [217, { filter: [387] }],
			appConnection: [217, { id: [218, "ID!"] }],
			findWorkspaceAiStats: [357],
			chatThreads: [346],
			chatThread: [346, { id: [3, "UUID!"] }],
			chatMessages: [345, { threadId: [3, "UUID!"] }],
			chatStreamCatchupChunks: [350, { threadId: [3, "UUID!"] }],
			getAiSystemPromptPreview: [348],
			skills: [344],
			skill: [344, { id: [3, "UUID!"] }],
			agentTurns: [356, { agentId: [3, "UUID!"] }],
			timelineActivityTypes: [373],
			metadataTranslations: [369, { input: [388, "MetadataTranslationsInput!"] }],
			checkUserExists: [279, {
				email: [1, "String!"],
				captchaToken: [1]
			}],
			checkWorkspaceInviteHashIsValid: [280, { inviteHash: [1, "String!"] }],
			findWorkspaceFromInviteHash: [68, { inviteHash: [1, "String!"] }],
			checkWorkspaceSubdomainAvailability: [274, { subdomain: [1, "String!"] }],
			getWorkspaceCreationDefaults: [275],
			validatePasswordResetToken: [272, { passwordResetToken: [1, "String!"] }],
			currentUser: [71],
			getSSOIdentityProviders: [223],
			eventLogs: [343, { input: [389, "EventLogQueryInput!"] }],
			pieChartData: [337, { input: [393, "PieChartDataInput!"] }],
			lineChartData: [335, { input: [394, "LineChartDataInput!"] }],
			barChartData: [332, { input: [395, "BarChartDataInput!"] }],
			callRecordingIdForCalendarEvent: [3, { calendarEventId: [3, "UUID!"] }],
			getConnectedImapSmtpCaldavAccount: [323, { id: [3, "UUID!"] }],
			getAutoCompleteAddress: [318, {
				address: [1, "String!"],
				token: [1, "String!"],
				country: [1],
				isFieldCity: [8]
			}],
			getAddressDetails: [320, {
				placeId: [1, "String!"],
				token: [1, "String!"]
			}],
			findManyPublicDomains: [293],
			currentUserApplicationAuthorizations: [283],
			__typename: [1]
		},
		UsageAnalyticsInput: {
			periodStart: [4],
			periodEnd: [4],
			userWorkspaceId: [1],
			operationTypes: [77],
			__typename: [1]
		},
		GetApiKeyInput: {
			id: [3],
			__typename: [1]
		},
		AgentIdInput: {
			id: [3],
			__typename: [1]
		},
		ObjectFilter: {
			and: [383],
			or: [383],
			id: [29],
			universalIdentifier: [29],
			isActive: [30],
			isRemote: [30],
			isSearchable: [30],
			isSystem: [30],
			isUICreatable: [30],
			isUIEditable: [30],
			isUIReadOnly: [30],
			__typename: [1]
		},
		LogicFunctionIdInput: {
			id: [218],
			__typename: [1]
		},
		PreviewMessageCampaignAudienceInput: {
			listId: [1],
			unsubscribeTopicId: [1],
			__typename: [1]
		},
		FindMessageSuppressionsInput: {
			reason: [313],
			searchTerm: [1],
			unsubscribeTopicId: [3],
			limit: [26],
			offset: [26],
			__typename: [1]
		},
		ListAppConnectionsInput: {
			providerName: [1],
			userWorkspaceId: [1],
			visibility: [1],
			__typename: [1]
		},
		MetadataTranslationsInput: {
			objectMetadataId: [3],
			fieldMetadataId: [3],
			locale: [1],
			__typename: [1]
		},
		EventLogQueryInput: {
			table: [390],
			filters: [391],
			first: [26],
			after: [1],
			__typename: [1]
		},
		EventLogTable: {},
		EventLogFiltersInput: {
			eventType: [1],
			userWorkspaceId: [1],
			dateRange: [392],
			recordId: [1],
			objectMetadataId: [1],
			__typename: [1]
		},
		EventLogDateRangeInput: {
			start: [4],
			end: [4],
			__typename: [1]
		},
		PieChartDataInput: {
			objectMetadataId: [3],
			configuration: [9],
			__typename: [1]
		},
		LineChartDataInput: {
			objectMetadataId: [3],
			configuration: [9],
			__typename: [1]
		},
		BarChartDataInput: {
			objectMetadataId: [3],
			configuration: [9],
			__typename: [1]
		},
		Mutation: {
			addQueryToEventStream: [8, { input: [397, "AddQuerySubscriptionInput!"] }],
			removeQueryFromEventStream: [8, { input: [398, "RemoveQueryFromEventStreamInput!"] }],
			createManyNavigationMenuItems: [156, { inputs: [399, "[CreateNavigationMenuItemInput!]!"] }],
			createNavigationMenuItem: [156, { input: [399, "CreateNavigationMenuItemInput!"] }],
			updateManyNavigationMenuItems: [156, { inputs: [400, "[UpdateOneNavigationMenuItemInput!]!"] }],
			updateNavigationMenuItem: [156, { input: [400, "UpdateOneNavigationMenuItemInput!"] }],
			deleteManyNavigationMenuItems: [156, { ids: [3, "[UUID!]!"] }],
			deleteNavigationMenuItem: [156, { id: [3, "UUID!"] }],
			createFileUpload: [154, {
				filename: [1, "String!"],
				size: [15, "Float!"],
				fileFolder: [288, "FileFolder!"],
				fieldMetadataId: [1],
				fieldMetadataUniversalIdentifier: [1]
			}],
			completeFileUpload: [153, { fileId: [1, "String!"] }],
			refreshEnterpriseValidityToken: [8],
			releaseEnterpriseServerBinding: [150],
			setEnterpriseKey: [150, { enterpriseKey: [1, "String!"] }],
			uploadEmailAttachmentFile: [153, { file: [402, "Upload!"] }],
			uploadAiChatFile: [153, { file: [402, "Upload!"] }],
			uploadWorkflowFile: [153, { file: [402, "Upload!"] }],
			uploadWorkspaceLogo: [153, { file: [402, "Upload!"] }],
			uploadWorkspaceMemberProfilePicture: [153, { file: [402, "Upload!"] }],
			uploadFilesFieldFile: [153, {
				file: [402, "Upload!"],
				fieldMetadataId: [1, "String!"]
			}],
			uploadFilesFieldFileByUniversalIdentifier: [153, {
				file: [402, "Upload!"],
				fieldMetadataUniversalIdentifier: [1, "String!"]
			}],
			upsertUsageLimit: [75, { input: [403, "UpsertUsageLimitInput!"] }],
			deleteUsageLimit: [8, { usageLimitId: [3, "UUID!"] }],
			createViewFilterGroup: [54, { input: [404, "CreateViewFilterGroupInput!"] }],
			updateViewFilterGroup: [54, {
				id: [1, "String!"],
				input: [405, "UpdateViewFilterGroupInput!"]
			}],
			deleteViewFilterGroup: [8, { id: [1, "String!"] }],
			destroyViewFilterGroup: [8, { id: [1, "String!"] }],
			createViewFilter: [56, { input: [406, "CreateViewFilterInput!"] }],
			updateViewFilter: [56, { input: [407, "UpdateViewFilterInput!"] }],
			deleteViewFilter: [56, { input: [409, "DeleteViewFilterInput!"] }],
			destroyViewFilter: [56, { input: [410, "DestroyViewFilterInput!"] }],
			createView: [62, { input: [411, "CreateViewInput!"] }],
			updateView: [62, {
				id: [1, "String!"],
				input: [412, "UpdateViewInput!"]
			}],
			deleteView: [8, { id: [1, "String!"] }],
			destroyView: [8, { id: [1, "String!"] }],
			upsertViewWidget: [62, { input: [413, "UpsertViewWidgetInput!"] }],
			createViewSort: [59, { input: [419, "CreateViewSortInput!"] }],
			updateViewSort: [59, { input: [420, "UpdateViewSortInput!"] }],
			deleteViewSort: [8, { input: [422, "DeleteViewSortInput!"] }],
			destroyViewSort: [8, { input: [423, "DestroyViewSortInput!"] }],
			updateViewField: [52, { input: [424, "UpdateViewFieldInput!"] }],
			createViewField: [52, { input: [426, "CreateViewFieldInput!"] }],
			createManyViewFields: [52, { inputs: [426, "[CreateViewFieldInput!]!"] }],
			deleteViewField: [52, { input: [427, "DeleteViewFieldInput!"] }],
			destroyViewField: [52, { input: [428, "DestroyViewFieldInput!"] }],
			updateViewFieldGroup: [61, { input: [429, "UpdateViewFieldGroupInput!"] }],
			createViewFieldGroup: [61, { input: [431, "CreateViewFieldGroupInput!"] }],
			createManyViewFieldGroups: [61, { inputs: [431, "[CreateViewFieldGroupInput!]!"] }],
			deleteViewFieldGroup: [61, { input: [432, "DeleteViewFieldGroupInput!"] }],
			destroyViewFieldGroup: [61, { input: [433, "DestroyViewFieldGroupInput!"] }],
			upsertFieldsWidget: [62, { input: [434, "UpsertFieldsWidgetInput!"] }],
			createApiKey: [2, { input: [437, "CreateApiKeyInput!"] }],
			updateApiKey: [2, { input: [438, "UpdateApiKeyInput!"] }],
			revokeApiKey: [2, { input: [439, "RevokeApiKeyInput!"] }],
			assignRoleToApiKey: [8, {
				apiKeyId: [3, "UUID!"],
				roleId: [3, "UUID!"]
			}],
			revokeUserSession: [8, { userSessionId: [3, "UUID!"] }],
			revokeAllOtherUserSessions: [26],
			deleteConnectedAccount: [180, { id: [3, "UUID!"] }],
			updateOneApplicationVariable: [8, {
				key: [1, "String!"],
				value: [1, "String!"],
				applicationId: [3, "UUID!"]
			}],
			skipSyncEmailOnboardingStep: [174, { isAutoSkipped: [8, "Boolean!"] }],
			completeBookCallOnboardingStep: [174, {
				hasBookedCall: [8, "Boolean!"],
				isAutoSkipped: [8, "Boolean!"]
			}],
			triggerInstallAppsOnboardingStep: [174, {
				universalIdentifiers: [1, "[String!]!"],
				isAutoSkipped: [8, "Boolean!"]
			}],
			goBackToPreviousOnboardingStep: [173],
			checkoutSession: [170, {
				recurringInterval: [138, "SubscriptionInterval!"],
				plan: [134, "BillingPlanKey!"],
				requirePaymentMethod: [8, "Boolean!"],
				successUrlPath: [1]
			}],
			createSubscriptionPaymentIntent: [169, {
				recurringInterval: [138, "SubscriptionInterval!"],
				plan: [134, "BillingPlanKey!"],
				requirePaymentMethod: [8, "Boolean!"],
				successUrlPath: [1],
				idempotencyKey: [1, "String!"]
			}],
			createBillingPaymentMethodSetupIntent: [169],
			switchSubscriptionInterval: [171],
			switchBillingPlan: [171],
			cancelSwitchBillingPlan: [171],
			cancelSwitchBillingInterval: [171],
			setResourceCreditSubscriptionPrice: [171, { priceId: [1, "String!"] }],
			endSubscriptionTrialPeriod: [166],
			cancelSwitchResourceCreditPrice: [171],
			deleteWorkspaceInvitation: [1, { appTokenId: [1, "String!"] }],
			resendWorkspaceInvitation: [176, { appTokenId: [1, "String!"] }],
			sendInvitations: [176, {
				emails: [1, "[String!]!"],
				roleId: [3]
			}],
			createApprovedAccessDomain: [152, { input: [440, "CreateApprovedAccessDomainInput!"] }],
			deleteApprovedAccessDomain: [8, { input: [441, "DeleteApprovedAccessDomainInput!"] }],
			validateApprovedAccessDomain: [152, { input: [442, "ValidateApprovedAccessDomainInput!"] }],
			createPageLayoutTab: [126, { input: [443, "CreatePageLayoutTabInput!"] }],
			updatePageLayoutTab: [126, {
				id: [1, "String!"],
				input: [444, "UpdatePageLayoutTabInput!"]
			}],
			destroyPageLayoutTab: [8, { id: [1, "String!"] }],
			createPageLayout: [127, { input: [445, "CreatePageLayoutInput!"] }],
			updatePageLayout: [127, {
				id: [1, "String!"],
				input: [446, "UpdatePageLayoutInput!"]
			}],
			destroyPageLayout: [8, { id: [1, "String!"] }],
			updatePageLayoutWithTabsAndWidgets: [127, {
				id: [1, "String!"],
				input: [447, "UpdatePageLayoutWithTabsInput!"]
			}],
			resetPageLayoutToDefault: [127, { id: [1, "String!"] }],
			resetPageLayoutWidgetToDefault: [83, { id: [1, "String!"] }],
			resetPageLayoutTabToDefault: [126, { id: [1, "String!"] }],
			createPageLayoutWidget: [83, { input: [450, "CreatePageLayoutWidgetInput!"] }],
			updatePageLayoutWidget: [83, {
				id: [1, "String!"],
				input: [451, "UpdatePageLayoutWidgetInput!"]
			}],
			destroyPageLayoutWidget: [8, { id: [1, "String!"] }],
			createOneAgent: [10, { input: [452, "CreateAgentInput!"] }],
			updateOneAgent: [10, { input: [453, "UpdateAgentInput!"] }],
			deleteOneAgent: [10, { input: [382, "AgentIdInput!"] }],
			createOneObject: [23, { input: [454, "CreateOneObjectInput!"] }],
			deleteOneObject: [23, { input: [456, "DeleteOneObjectInput!"] }],
			updateOneObject: [23, { input: [457, "UpdateOneObjectInput!"] }],
			createOneIndex: [245, { input: [460, "CreateOneIndexInput!"] }],
			deleteOneIndex: [245, { input: [463, "DeleteOneIndexInput!"] }],
			deleteOneLogicFunction: [21, { input: [384, "LogicFunctionIdInput!"] }],
			createOneLogicFunction: [21, { input: [464, "CreateLogicFunctionFromSourceInput!"] }],
			executeOneLogicFunction: [148, { input: [465, "ExecuteOneLogicFunctionInput!"] }],
			updateOneLogicFunction: [8, { input: [466, "UpdateLogicFunctionFromSourceInput!"] }],
			createCommandMenuItem: [14, { input: [468, "CreateCommandMenuItemInput!"] }],
			updateCommandMenuItem: [14, { input: [469, "UpdateCommandMenuItemInput!"] }],
			resetCommandMenuItem: [14, { id: [3, "UUID!"] }],
			deleteCommandMenuItem: [14, { id: [3, "UUID!"] }],
			createFrontComponent: [13, { input: [470, "CreateFrontComponentInput!"] }],
			updateFrontComponent: [13, { input: [471, "UpdateFrontComponentInput!"] }],
			deleteFrontComponent: [13, { id: [3, "UUID!"] }],
			activateWorkspace: [68, { data: [473, "ActivateWorkspaceInput!"] }],
			updateWorkspace: [68, { data: [474, "UpdateWorkspaceInput!"] }],
			deleteCurrentWorkspace: [68],
			checkCustomDomainValidRecords: [257],
			enrichWorkspaceCompany: [234],
			upgradeApplication: [8, {
				appRegistrationId: [1, "String!"],
				targetVersion: [1, "String!"]
			}],
			createApplicationRegistration: [214, { input: [475, "CreateApplicationRegistrationInput!"] }],
			updateApplicationRegistration: [74, { input: [476, "UpdateApplicationRegistrationInput!"] }],
			deleteApplicationRegistration: [8, { id: [1, "String!"] }],
			rotateApplicationRegistrationClientSecret: [216, { id: [1, "String!"] }],
			createApplicationRegistrationVariable: [188, { input: [478, "CreateApplicationRegistrationVariableInput!"] }],
			updateApplicationRegistrationVariable: [188, { input: [479, "UpdateApplicationRegistrationVariableInput!"] }],
			deleteApplicationRegistrationVariable: [8, { id: [1, "String!"] }],
			uploadAppTarball: [74, {
				file: [402, "Upload!"],
				universalIdentifier: [1]
			}],
			claimApplicationRegistrationOwnership: [74, { applicationRegistrationId: [1, "String!"] }],
			transferApplicationRegistrationOwnership: [74, {
				applicationRegistrationId: [1, "String!"],
				targetWorkspaceSubdomain: [1, "String!"]
			}],
			installMarketplaceApp: [8, {
				universalIdentifier: [1, "String!"],
				version: [1]
			}],
			installApplication: [47, {
				universalIdentifier: [1, "String!"],
				version: [1]
			}],
			updateApplication: [47, {
				id: [3, "UUID!"],
				input: [481, "UpdateApplicationInput!"]
			}],
			uninstallApplication: [8, { universalIdentifier: [1, "String!"] }],
			syncMarketplaceCatalog: [8],
			createOneField: [237, { input: [482, "CreateOneFieldMetadataInput!"] }],
			updateOneField: [237, { input: [484, "UpdateOneFieldMetadataInput!"] }],
			deleteOneField: [237, { input: [486, "DeleteOneFieldInput!"] }],
			createViewGroup: [58, { input: [487, "CreateViewGroupInput!"] }],
			createManyViewGroups: [58, { inputs: [487, "[CreateViewGroupInput!]!"] }],
			updateViewGroup: [58, { input: [488, "UpdateViewGroupInput!"] }],
			updateManyViewGroups: [58, { inputs: [488, "[UpdateViewGroupInput!]!"] }],
			deleteViewGroup: [58, { input: [490, "DeleteViewGroupInput!"] }],
			destroyViewGroup: [58, { input: [491, "DestroyViewGroupInput!"] }],
			updateWorkspaceMemberRole: [33, {
				workspaceMemberId: [3, "UUID!"],
				roleId: [3, "UUID!"]
			}],
			createOneRole: [46, { createRoleInput: [492, "CreateRoleInput!"] }],
			updateOneRole: [46, { updateRoleInput: [493, "UpdateRoleInput!"] }],
			deleteOneRole: [1, { roleId: [3, "UUID!"] }],
			upsertObjectPermissions: [43, { upsertObjectPermissionsInput: [495, "UpsertObjectPermissionsInput!"] }],
			upsertPermissionFlags: [44, { upsertPermissionFlagsInput: [497, "UpsertPermissionFlagsInput!"] }],
			upsertFieldPermissions: [38, { upsertFieldPermissionsInput: [498, "UpsertFieldPermissionsInput!"] }],
			upsertRowLevelPermissionPredicates: [258, { input: [500, "UpsertRowLevelPermissionPredicatesInput!"] }],
			assignRoleToAgent: [8, {
				agentId: [3, "UUID!"],
				roleId: [3, "UUID!"]
			}],
			removeRoleFromAgent: [8, { agentId: [3, "UUID!"] }],
			sendEmailViaEmailingDomain: [310, { input: [503, "SendEmailViaDomainInput!"] }],
			sendMessageCampaign: [311, { input: [504, "SendMessageCampaignInput!"] }],
			cancelMessageCampaign: [309, { input: [505, "CancelMessageCampaignInput!"] }],
			sendMessageCampaignTest: [310, { input: [506, "SendMessageCampaignTestInput!"] }],
			createMessageSuppression: [312, { input: [507, "CreateMessageSuppressionInput!"] }],
			deleteMessageSuppression: [8, { id: [3, "UUID!"] }],
			createUnsubscribeTopic: [316, { input: [508, "CreateUnsubscribeTopicInput!"] }],
			updateUnsubscribeTopic: [316, { input: [509, "UpdateUnsubscribeTopicInput!"] }],
			deleteUnsubscribeTopic: [8, { id: [1, "String!"] }],
			updateMessageChannel: [299, { input: [510, "UpdateMessageChannelInput!"] }],
			createEmailGroupChannel: [307, { input: [512, "CreateEmailGroupChannelInput!"] }],
			updateEmailGroupChannel: [299, { input: [513, "UpdateEmailGroupChannelInput!"] }],
			deleteEmailGroupChannel: [299, { id: [3, "UUID!"] }],
			createEmailingDomain: [295, { input: [514, "CreateEmailingDomainInput!"] }],
			deleteEmailingDomain: [8, { id: [1, "String!"] }],
			verifyEmailingDomain: [295, { id: [1, "String!"] }],
			runAgent: [328, { input: [515, "RunAgentInput!"] }],
			createWebhook: [325, { input: [518, "CreateWebhookInput!"] }],
			updateWebhook: [325, { input: [519, "UpdateWebhookInput!"] }],
			deleteWebhook: [325, { id: [3, "UUID!"] }],
			updateMessageFolder: [367, { input: [521, "UpdateMessageFolderInput!"] }],
			updateMessageFolders: [367, { input: [523, "UpdateMessageFoldersInput!"] }],
			updateCalendarChannel: [362, { input: [524, "UpdateCalendarChannelInput!"] }],
			setAppKeyValue: [360, { input: [526, "SetAppKeyValueInput!"] }],
			deleteAppKeyValue: [8, {
				key: [1, "String!"],
				scope: [361]
			}],
			enqueueJob: [358, { input: [527, "EnqueueJobInput!"] }],
			enqueueJobs: [359, { input: [528, "EnqueueJobsInput!"] }],
			createChatThread: [346],
			sendChatMessage: [351, {
				threadId: [3, "UUID!"],
				text: [1, "String!"],
				messageId: [3, "UUID!"],
				browsingContext: [9],
				modelId: [1],
				fileAttachments: [529, "[FileAttachmentInput!]"]
			}],
			retryChatMessage: [351, {
				threadId: [3, "UUID!"],
				modelId: [1]
			}],
			answerAgentChatQuestion: [351, {
				threadId: [3, "UUID!"],
				messageId: [3, "UUID!"],
				answers: [530, "[AgentChatQuestionAnswerInput!]!"],
				modelId: [1],
				fileAttachments: [529, "[FileAttachmentInput!]"]
			}],
			stopAgentChatStream: [8, { threadId: [3, "UUID!"] }],
			renameChatThread: [346, {
				id: [3, "UUID!"],
				title: [1, "String!"]
			}],
			archiveChatThread: [346, { id: [3, "UUID!"] }],
			unarchiveChatThread: [346, { id: [3, "UUID!"] }],
			deleteChatThread: [8, { id: [3, "UUID!"] }],
			deleteQueuedChatMessage: [8, { messageId: [3, "UUID!"] }],
			startWorkspaceSetupChat: [353, {
				companyContext: [9],
				personContext: [9]
			}],
			createSkill: [344, { input: [531, "CreateSkillInput!"] }],
			updateSkill: [344, { input: [532, "UpdateSkillInput!"] }],
			deleteSkill: [344, { id: [3, "UUID!"] }],
			activateSkill: [344, { id: [3, "UUID!"] }],
			deactivateSkill: [344, { id: [3, "UUID!"] }],
			evaluateAgentTurn: [355, { turnId: [3, "UUID!"] }],
			runEvaluationInput: [356, {
				agentId: [3, "UUID!"],
				input: [1, "String!"]
			}],
			updateTimelineActivityType: [373, { input: [533, "UpdateTimelineActivityTypeInput!"] }],
			resetTimelineActivityType: [373, { id: [3, "UUID!"] }],
			getAuthorizationUrlForSSO: [267, { input: [534, "GetAuthorizationUrlForSSOInput!"] }],
			getLoginTokenFromCredentials: [278, {
				email: [1, "String!"],
				password: [1, "String!"],
				captchaToken: [1],
				locale: [1],
				verifyEmailRedirectPath: [1],
				origin: [1, "String!"]
			}],
			signIn: [265, {
				email: [1, "String!"],
				password: [1, "String!"],
				captchaToken: [1],
				locale: [1],
				verifyEmailRedirectPath: [1]
			}],
			verifyEmailAndGetLoginToken: [273, {
				emailVerificationToken: [1, "String!"],
				email: [1, "String!"],
				captchaToken: [1],
				origin: [1, "String!"]
			}],
			verifyEmailAndGetWorkspaceAgnosticToken: [265, {
				emailVerificationToken: [1, "String!"],
				email: [1, "String!"],
				captchaToken: [1]
			}],
			getAuthTokensFromOTP: [277, {
				otp: [1, "String!"],
				loginToken: [1, "String!"],
				captchaToken: [1],
				origin: [1, "String!"]
			}],
			signUp: [265, {
				email: [1, "String!"],
				password: [1, "String!"],
				captchaToken: [1],
				locale: [1],
				verifyEmailRedirectPath: [1]
			}],
			signUpInWorkspace: [270, {
				email: [1, "String!"],
				password: [1, "String!"],
				workspaceId: [3],
				workspaceInviteHash: [1],
				workspacePersonalInviteToken: [1],
				captchaToken: [1],
				locale: [1],
				verifyEmailRedirectPath: [1]
			}],
			signUpInNewWorkspace: [270, { input: [535] }],
			uploadNewWorkspaceLogo: [153, {
				workspaceId: [1, "String!"],
				file: [402, "Upload!"]
			}],
			generateTransientToken: [271],
			getAuthTokensFromLoginToken: [277, {
				loginToken: [1, "String!"],
				origin: [1, "String!"]
			}],
			getAuthTokensFromSSOExchangeToken: [277, { ssoExchangeToken: [1, "String!"] }],
			authorizeApp: [263, {
				clientId: [1, "String!"],
				codeChallenge: [1],
				redirectUrl: [1, "String!"],
				state: [1],
				scope: [1],
				issuer: [1]
			}],
			renewToken: [277, { appToken: [1, "String!"] }],
			signOut: [8, { refreshToken: [1] }],
			generateApiKeyToken: [276, {
				apiKeyId: [3, "UUID!"],
				expiresAt: [1, "String!"]
			}],
			generatePlaygroundToken: [11],
			emailPasswordResetLink: [266, {
				email: [1, "String!"],
				workspaceId: [3],
				captchaToken: [1]
			}],
			updatePasswordViaResetToken: [268, {
				passwordResetToken: [1, "String!"],
				newPassword: [1, "String!"]
			}],
			initiateOTPProvisioning: [261, {
				loginToken: [1, "String!"],
				origin: [1, "String!"]
			}],
			initiateOTPProvisioningForAuthenticatedUser: [261],
			deleteTwoFactorAuthenticationMethod: [260, { twoFactorAuthenticationMethodId: [3, "UUID!"] }],
			verifyTwoFactorAuthenticationMethodForAuthenticatedUser: [262, { otp: [1, "String!"] }],
			deleteUser: [71],
			deleteUserFromWorkspace: [50, { workspaceMemberIdToDelete: [1, "String!"] }],
			updateWorkspaceMemberSettings: [8, { input: [536, "UpdateWorkspaceMemberSettingsInput!"] }],
			updateUserEmail: [8, {
				newEmail: [1, "String!"],
				verifyEmailRedirectPath: [1]
			}],
			resendEmailVerificationToken: [219, {
				email: [1, "String!"],
				origin: [1, "String!"]
			}],
			createOIDCIdentityProvider: [224, { input: [537, "SetupOIDCSsoInput!"] }],
			createSAMLIdentityProvider: [224, { input: [538, "SetupSAMLSsoInput!"] }],
			deleteSSOIdentityProvider: [220, { input: [539, "DeleteSsoInput!"] }],
			editSSOIdentityProvider: [221, { input: [540, "EditSsoInput!"] }],
			createObjectEvent: [340, {
				event: [1, "String!"],
				recordId: [3, "UUID!"],
				objectMetadataId: [3, "UUID!"],
				properties: [9]
			}],
			trackAnalytics: [340, {
				type: [541, "AnalyticsType!"],
				name: [1],
				event: [1],
				properties: [9]
			}],
			duplicateDashboard: [338, { id: [3, "UUID!"] }],
			impersonate: [281, {
				userId: [3, "UUID!"],
				workspaceId: [3, "UUID!"]
			}],
			stopImpersonation: [282],
			createCalendarEvent: [330, { input: [542, "CreateCalendarEventInput!"] }],
			sendEmail: [339, { input: [543, "SendEmailInput!"] }],
			startChannelSync: [329, { connectedAccountId: [3, "UUID!"] }],
			saveImapSmtpCaldavAccount: [324, {
				handle: [1, "String!"],
				connectionParameters: [545, "EmailAccountConnectionParameters!"],
				id: [3]
			}],
			updateLabPublicFeatureFlag: [185, { input: [547, "UpdateLabPublicFeatureFlagInput!"] }],
			createPublicDomain: [293, {
				domain: [1, "String!"],
				applicationId: [1, "String!"]
			}],
			deletePublicDomain: [8, { domain: [1, "String!"] }],
			checkPublicDomainValidRecords: [257, { domain: [1, "String!"] }],
			createDevelopmentApplication: [291, {
				universalIdentifier: [1, "String!"],
				name: [1, "String!"]
			}],
			syncApplication: [292, {
				manifest: [9, "JSON!"],
				dryRun: [8]
			}],
			uploadApplicationFile: [284, {
				file: [402, "Upload!"],
				applicationUniversalIdentifier: [1, "String!"],
				fileFolder: [288, "FileFolder!"],
				filePath: [1, "String!"]
			}],
			createApplicationFileUploads: [290, {
				applicationUniversalIdentifier: [1, "String!"],
				files: [548, "[ApplicationFileUploadRequestInput!]!"]
			}],
			completeApplicationFileUploads: [286, {
				applicationUniversalIdentifier: [1, "String!"],
				fileIds: [3, "[UUID!]!"]
			}],
			revokeApplicationAuthorization: [8, { applicationAuthorizationId: [3, "UUID!"] }],
			generateApplicationToken: [12, { applicationId: [3, "UUID!"] }],
			renewApplicationToken: [12, { applicationRefreshToken: [1, "String!"] }],
			__typename: [1]
		},
		AddQuerySubscriptionInput: {
			eventStreamId: [1],
			queryId: [1],
			operationSignature: [9],
			__typename: [1]
		},
		RemoveQueryFromEventStreamInput: {
			eventStreamId: [1],
			queryId: [1],
			__typename: [1]
		},
		CreateNavigationMenuItemInput: {
			id: [3],
			userWorkspaceId: [3],
			targetRecordId: [3],
			targetObjectMetadataId: [3],
			viewId: [3],
			type: [157],
			name: [1],
			link: [1],
			icon: [1],
			color: [1],
			folderId: [3],
			pageLayoutId: [3],
			position: [15],
			__typename: [1]
		},
		UpdateOneNavigationMenuItemInput: {
			id: [3],
			update: [401],
			__typename: [1]
		},
		UpdateNavigationMenuItemInput: {
			folderId: [3],
			position: [15],
			name: [1],
			link: [1],
			icon: [1],
			color: [1],
			pageLayoutId: [3],
			__typename: [1]
		},
		Upload: {},
		UpsertUsageLimitInput: {
			resourceType: [76],
			operationType: [77],
			spenderType: [1],
			spenderId: [1],
			limitKind: [1],
			windowSeconds: [26],
			limitValue: [78],
			burstValue: [78],
			__typename: [1]
		},
		CreateViewFilterGroupInput: {
			id: [3],
			parentViewFilterGroupId: [3],
			logicalOperator: [55],
			positionInViewFilterGroup: [15],
			viewId: [3],
			__typename: [1]
		},
		UpdateViewFilterGroupInput: {
			id: [3],
			parentViewFilterGroupId: [3],
			logicalOperator: [55],
			positionInViewFilterGroup: [15],
			viewId: [3],
			__typename: [1]
		},
		CreateViewFilterInput: {
			id: [3],
			fieldMetadataId: [3],
			operand: [57],
			value: [9],
			viewFilterGroupId: [3],
			positionInViewFilterGroup: [15],
			subFieldName: [1],
			relationTargetFieldMetadataId: [3],
			viewId: [3],
			__typename: [1]
		},
		UpdateViewFilterInput: {
			id: [3],
			update: [408],
			__typename: [1]
		},
		UpdateViewFilterInputUpdates: {
			fieldMetadataId: [3],
			operand: [57],
			value: [9],
			viewFilterGroupId: [3],
			positionInViewFilterGroup: [15],
			subFieldName: [1],
			relationTargetFieldMetadataId: [3],
			__typename: [1]
		},
		DeleteViewFilterInput: {
			id: [3],
			__typename: [1]
		},
		DestroyViewFilterInput: {
			id: [3],
			__typename: [1]
		},
		CreateViewInput: {
			id: [3],
			name: [1],
			objectMetadataId: [3],
			type: [63],
			key: [64],
			icon: [1],
			position: [15],
			isCompact: [8],
			shouldHideEmptyGroups: [8],
			kanbanColumnWidth: [26],
			openRecordIn: [65],
			kanbanAggregateOperation: [53],
			kanbanAggregateOperationFieldMetadataId: [3],
			anyFieldFilterValue: [1],
			calendarLayout: [66],
			calendarFieldMetadataId: [3],
			calendarEndFieldMetadataId: [3],
			mainGroupByFieldMetadataId: [3],
			visibility: [67],
			__typename: [1]
		},
		UpdateViewInput: {
			id: [3],
			name: [1],
			type: [63],
			icon: [1],
			position: [15],
			isCompact: [8],
			openRecordIn: [65],
			kanbanAggregateOperation: [53],
			kanbanAggregateOperationFieldMetadataId: [3],
			anyFieldFilterValue: [1],
			calendarLayout: [66],
			calendarFieldMetadataId: [3],
			calendarEndFieldMetadataId: [3],
			visibility: [67],
			mainGroupByFieldMetadataId: [3],
			shouldHideEmptyGroups: [8],
			kanbanColumnWidth: [26],
			__typename: [1]
		},
		UpsertViewWidgetInput: {
			widgetId: [3],
			view: [414],
			viewFields: [415],
			viewFilters: [416],
			viewFilterGroups: [417],
			viewSorts: [418],
			__typename: [1]
		},
		UpsertViewWidgetViewSettingsInput: {
			type: [63],
			mainGroupByFieldMetadataId: [3],
			shouldHideEmptyGroups: [8],
			openRecordIn: [65],
			kanbanAggregateOperation: [53],
			kanbanAggregateOperationFieldMetadataId: [3],
			kanbanColumnWidth: [26],
			calendarLayout: [66],
			calendarFieldMetadataId: [3],
			calendarEndFieldMetadataId: [3],
			__typename: [1]
		},
		UpsertViewWidgetViewFieldInput: {
			viewFieldId: [3],
			fieldMetadataId: [3],
			isVisible: [8],
			position: [15],
			size: [15],
			aggregateOperation: [53],
			__typename: [1]
		},
		UpsertViewWidgetViewFilterInput: {
			id: [3],
			fieldMetadataId: [3],
			operand: [57],
			value: [9],
			viewFilterGroupId: [3],
			positionInViewFilterGroup: [15],
			subFieldName: [1],
			relationTargetFieldMetadataId: [3],
			__typename: [1]
		},
		UpsertViewWidgetViewFilterGroupInput: {
			id: [3],
			parentViewFilterGroupId: [3],
			logicalOperator: [55],
			positionInViewFilterGroup: [15],
			__typename: [1]
		},
		UpsertViewWidgetViewSortInput: {
			id: [3],
			fieldMetadataId: [3],
			direction: [60],
			__typename: [1]
		},
		CreateViewSortInput: {
			id: [3],
			fieldMetadataId: [3],
			direction: [60],
			subFieldName: [1],
			viewId: [3],
			__typename: [1]
		},
		UpdateViewSortInput: {
			id: [3],
			update: [421],
			__typename: [1]
		},
		UpdateViewSortInputUpdates: {
			direction: [60],
			subFieldName: [1],
			__typename: [1]
		},
		DeleteViewSortInput: {
			id: [3],
			__typename: [1]
		},
		DestroyViewSortInput: {
			id: [3],
			__typename: [1]
		},
		UpdateViewFieldInput: {
			id: [3],
			update: [425],
			__typename: [1]
		},
		UpdateViewFieldInputUpdates: {
			isVisible: [8],
			size: [15],
			position: [15],
			aggregateOperation: [53],
			viewFieldGroupId: [3],
			__typename: [1]
		},
		CreateViewFieldInput: {
			id: [3],
			fieldMetadataId: [3],
			viewId: [3],
			isVisible: [8],
			size: [15],
			position: [15],
			aggregateOperation: [53],
			viewFieldGroupId: [3],
			__typename: [1]
		},
		DeleteViewFieldInput: {
			id: [3],
			__typename: [1]
		},
		DestroyViewFieldInput: {
			id: [3],
			__typename: [1]
		},
		UpdateViewFieldGroupInput: {
			id: [3],
			update: [430],
			__typename: [1]
		},
		UpdateViewFieldGroupInputUpdates: {
			name: [1],
			position: [15],
			isVisible: [8],
			deletedAt: [1],
			__typename: [1]
		},
		CreateViewFieldGroupInput: {
			id: [3],
			name: [1],
			viewId: [3],
			position: [15],
			isVisible: [8],
			__typename: [1]
		},
		DeleteViewFieldGroupInput: {
			id: [3],
			__typename: [1]
		},
		DestroyViewFieldGroupInput: {
			id: [3],
			__typename: [1]
		},
		UpsertFieldsWidgetInput: {
			widgetId: [3],
			groups: [435],
			fields: [436],
			__typename: [1]
		},
		UpsertFieldsWidgetGroupInput: {
			id: [3],
			name: [1],
			position: [15],
			isVisible: [8],
			fields: [436],
			__typename: [1]
		},
		UpsertFieldsWidgetFieldInput: {
			viewFieldId: [3],
			fieldMetadataId: [3],
			isVisible: [8],
			position: [15],
			__typename: [1]
		},
		CreateApiKeyInput: {
			name: [1],
			expiresAt: [1],
			revokedAt: [1],
			roleId: [3],
			__typename: [1]
		},
		UpdateApiKeyInput: {
			id: [3],
			name: [1],
			expiresAt: [1],
			revokedAt: [1],
			__typename: [1]
		},
		RevokeApiKeyInput: {
			id: [3],
			__typename: [1]
		},
		CreateApprovedAccessDomainInput: {
			domain: [1],
			email: [1],
			__typename: [1]
		},
		DeleteApprovedAccessDomainInput: {
			id: [3],
			__typename: [1]
		},
		ValidateApprovedAccessDomainInput: {
			validationToken: [1],
			approvedAccessDomainId: [3],
			__typename: [1]
		},
		CreatePageLayoutTabInput: {
			title: [1],
			position: [15],
			pageLayoutId: [3],
			layoutMode: [87],
			__typename: [1]
		},
		UpdatePageLayoutTabInput: {
			title: [1],
			position: [15],
			icon: [1],
			layoutMode: [87],
			__typename: [1]
		},
		CreatePageLayoutInput: {
			name: [1],
			type: [128],
			objectMetadataId: [3],
			__typename: [1]
		},
		UpdatePageLayoutInput: {
			name: [1],
			type: [128],
			objectMetadataId: [3],
			__typename: [1]
		},
		UpdatePageLayoutWithTabsInput: {
			name: [1],
			type: [128],
			objectMetadataId: [3],
			isFirstTabPinned: [8],
			tabs: [448],
			__typename: [1]
		},
		UpdatePageLayoutTabWithWidgetsInput: {
			id: [3],
			title: [1],
			position: [15],
			icon: [1],
			layoutMode: [87],
			widgets: [449],
			__typename: [1]
		},
		UpdatePageLayoutWidgetWithIdInput: {
			id: [3],
			pageLayoutTabId: [3],
			title: [1],
			type: [84],
			objectMetadataId: [3],
			position: [9],
			configuration: [9],
			conditionalDisplay: [9],
			conditionalAvailabilityExpression: [1],
			__typename: [1]
		},
		CreatePageLayoutWidgetInput: {
			pageLayoutTabId: [3],
			title: [1],
			type: [84],
			objectMetadataId: [3],
			position: [9],
			configuration: [9],
			__typename: [1]
		},
		UpdatePageLayoutWidgetInput: {
			pageLayoutTabId: [3],
			title: [1],
			type: [84],
			objectMetadataId: [3],
			position: [9],
			configuration: [9],
			conditionalDisplay: [9],
			conditionalAvailabilityExpression: [1],
			__typename: [1]
		},
		CreateAgentInput: {
			name: [1],
			label: [1],
			icon: [1],
			description: [1],
			prompt: [1],
			modelId: [1],
			roleId: [3],
			responseFormat: [9],
			modelConfiguration: [9],
			evaluationInputs: [1],
			__typename: [1]
		},
		UpdateAgentInput: {
			id: [3],
			name: [1],
			label: [1],
			icon: [1],
			description: [1],
			prompt: [1],
			modelId: [1],
			roleId: [3],
			responseFormat: [9],
			modelConfiguration: [9],
			evaluationInputs: [1],
			__typename: [1]
		},
		CreateOneObjectInput: {
			object: [455],
			__typename: [1]
		},
		CreateObjectInput: {
			nameSingular: [1],
			namePlural: [1],
			labelSingular: [1],
			labelPlural: [1],
			description: [1],
			icon: [1],
			shortcut: [1],
			color: [1],
			skipNameField: [8],
			isRemote: [8],
			primaryKeyColumnType: [1],
			primaryKeyFieldMetadataSettings: [9],
			isLabelSyncedWithName: [8],
			__typename: [1]
		},
		DeleteOneObjectInput: {
			id: [3],
			__typename: [1]
		},
		UpdateOneObjectInput: {
			update: [458],
			id: [3],
			__typename: [1]
		},
		UpdateObjectPayload: {
			labelSingular: [1],
			labelPlural: [1],
			nameSingular: [1],
			namePlural: [1],
			description: [1],
			icon: [1],
			shortcut: [1],
			color: [1],
			isActive: [8],
			labelIdentifierFieldMetadataId: [3],
			imageIdentifierFieldMetadataId: [3],
			isLabelSyncedWithName: [8],
			isSearchable: [8],
			openRecordIn: [24],
			translations: [459],
			__typename: [1]
		},
		MetadataTranslationOverrideInput: {
			locale: [1],
			property: [1],
			value: [1],
			__typename: [1]
		},
		CreateOneIndexInput: {
			index: [461],
			__typename: [1]
		},
		CreateIndexInput: {
			objectMetadataId: [3],
			fields: [462],
			indexType: [246],
			__typename: [1]
		},
		CreateIndexFieldInput: {
			fieldMetadataId: [3],
			subFieldName: [1],
			__typename: [1]
		},
		DeleteOneIndexInput: {
			id: [3],
			__typename: [1]
		},
		CreateLogicFunctionFromSourceInput: {
			id: [3],
			universalIdentifier: [3],
			name: [1],
			description: [1],
			timeoutSeconds: [15],
			source: [9],
			cronTriggerSettings: [9],
			databaseEventTriggerSettings: [9],
			httpRouteTriggerSettings: [9],
			serverRouteTriggerSettings: [9],
			toolTriggerSettings: [9],
			workflowActionTriggerSettings: [9],
			__typename: [1]
		},
		ExecuteOneLogicFunctionInput: {
			id: [3],
			payload: [9],
			__typename: [1]
		},
		UpdateLogicFunctionFromSourceInput: {
			id: [3],
			update: [467],
			__typename: [1]
		},
		UpdateLogicFunctionFromSourceInputUpdates: {
			name: [1],
			description: [1],
			timeoutSeconds: [15],
			sourceHandlerCode: [1],
			handlerName: [1],
			sourceHandlerPath: [1],
			cronTriggerSettings: [9],
			databaseEventTriggerSettings: [9],
			httpRouteTriggerSettings: [9],
			toolTriggerSettings: [9],
			workflowActionTriggerSettings: [9],
			__typename: [1]
		},
		CreateCommandMenuItemInput: {
			workflowVersionId: [3],
			frontComponentId: [3],
			engineComponentKey: [16],
			label: [1],
			icon: [1],
			shortLabel: [1],
			position: [15],
			isPinned: [8],
			availabilityType: [17],
			hotKeys: [1],
			conditionalAvailabilityExpression: [1],
			availabilityObjectMetadataId: [3],
			payload: [9],
			navigationTargetObjectMetadataId: [3],
			pageLayoutId: [3],
			__typename: [1]
		},
		UpdateCommandMenuItemInput: {
			id: [3],
			label: [1],
			icon: [1],
			shortLabel: [1],
			position: [15],
			isPinned: [8],
			availabilityType: [17],
			availabilityObjectMetadataId: [3],
			engineComponentKey: [16],
			hotKeys: [1],
			pageLayoutId: [3],
			__typename: [1]
		},
		CreateFrontComponentInput: {
			id: [3],
			name: [1],
			description: [1],
			sourceComponentPath: [1],
			builtComponentPath: [1],
			componentName: [1],
			builtComponentChecksum: [1],
			__typename: [1]
		},
		UpdateFrontComponentInput: {
			id: [3],
			update: [472],
			__typename: [1]
		},
		UpdateFrontComponentInputUpdates: {
			name: [1],
			description: [1],
			__typename: [1]
		},
		ActivateWorkspaceInput: {
			displayName: [1],
			__typename: [1]
		},
		UpdateWorkspaceInput: {
			subdomain: [1],
			customDomain: [1],
			displayName: [1],
			logo: [1],
			inviteHash: [1],
			isPublicInviteLinkEnabled: [8],
			workspaceDiscoverability: [69],
			allowImpersonation: [8],
			isGoogleAuthEnabled: [8],
			isMicrosoftAuthEnabled: [8],
			isPasswordAuthEnabled: [8],
			isGoogleAuthBypassEnabled: [8],
			isMicrosoftAuthBypassEnabled: [8],
			isPasswordAuthBypassEnabled: [8],
			defaultRoleId: [3],
			isTwoFactorAuthenticationEnforced: [8],
			trashRetentionDays: [15],
			eventLogRetentionDays: [15],
			fastModel: [1],
			smartModel: [1],
			aiAdditionalInstructions: [1],
			editableProfileFields: [1],
			enabledAiModelIds: [1],
			useRecommendedModels: [8],
			isInternalMessagesImportEnabled: [8],
			__typename: [1]
		},
		CreateApplicationRegistrationInput: {
			name: [1],
			universalIdentifier: [1],
			oAuthRedirectUris: [1],
			oAuthScopes: [1],
			__typename: [1]
		},
		UpdateApplicationRegistrationInput: {
			id: [1],
			update: [477],
			__typename: [1]
		},
		UpdateApplicationRegistrationPayload: {
			name: [1],
			oAuthRedirectUris: [1],
			oAuthScopes: [1],
			isListed: [8],
			isPreInstalled: [8],
			isVetted: [8],
			__typename: [1]
		},
		CreateApplicationRegistrationVariableInput: {
			applicationRegistrationId: [1],
			key: [1],
			value: [1],
			description: [1],
			isSecret: [8],
			__typename: [1]
		},
		UpdateApplicationRegistrationVariableInput: {
			id: [1],
			update: [480],
			__typename: [1]
		},
		UpdateApplicationRegistrationVariablePayload: {
			value: [1],
			resetValue: [8],
			description: [1],
			__typename: [1]
		},
		UpdateApplicationInput: {
			autoUpgrade: [8],
			__typename: [1]
		},
		CreateOneFieldMetadataInput: {
			field: [483],
			__typename: [1]
		},
		CreateFieldInput: {
			type: [238],
			name: [1],
			label: [1],
			description: [1],
			icon: [1],
			isActive: [8],
			isSystem: [8],
			isUIEditable: [8],
			isUIReadOnly: [8],
			isNullable: [8],
			isUnique: [8],
			defaultValue: [9],
			options: [9],
			settings: [9],
			objectMetadataId: [3],
			isLabelSyncedWithName: [8],
			isRemoteCreation: [8],
			relationCreationPayload: [9],
			morphRelationsCreationPayload: [9],
			__typename: [1]
		},
		UpdateOneFieldMetadataInput: {
			id: [3],
			update: [485],
			__typename: [1]
		},
		UpdateFieldInput: {
			universalIdentifier: [1],
			name: [1],
			label: [1],
			description: [1],
			icon: [1],
			isActive: [8],
			isSystem: [8],
			isUIEditable: [8],
			isUIReadOnly: [8],
			isNullable: [8],
			isUnique: [8],
			defaultValue: [9],
			options: [9],
			settings: [9],
			objectMetadataId: [3],
			isLabelSyncedWithName: [8],
			morphRelationsUpdatePayload: [9],
			translations: [459],
			__typename: [1]
		},
		DeleteOneFieldInput: {
			id: [3],
			__typename: [1]
		},
		CreateViewGroupInput: {
			id: [3],
			isVisible: [8],
			fieldValue: [1],
			position: [15],
			viewId: [3],
			__typename: [1]
		},
		UpdateViewGroupInput: {
			id: [3],
			update: [489],
			__typename: [1]
		},
		UpdateViewGroupInputUpdates: {
			fieldMetadataId: [3],
			isVisible: [8],
			fieldValue: [1],
			position: [15],
			__typename: [1]
		},
		DeleteViewGroupInput: {
			id: [3],
			__typename: [1]
		},
		DestroyViewGroupInput: {
			id: [3],
			__typename: [1]
		},
		CreateRoleInput: {
			id: [1],
			label: [1],
			description: [1],
			icon: [1],
			canUpdateAllSettings: [8],
			canAccessAllTools: [8],
			canReadAllObjectRecords: [8],
			canUpdateAllObjectRecords: [8],
			canSoftDeleteAllObjectRecords: [8],
			canDestroyAllObjectRecords: [8],
			canBeAssignedToUsers: [8],
			canBeAssignedToAgents: [8],
			canBeAssignedToApiKeys: [8],
			__typename: [1]
		},
		UpdateRoleInput: {
			update: [494],
			id: [3],
			__typename: [1]
		},
		UpdateRolePayload: {
			label: [1],
			description: [1],
			icon: [1],
			canUpdateAllSettings: [8],
			canAccessAllTools: [8],
			canReadAllObjectRecords: [8],
			canUpdateAllObjectRecords: [8],
			canSoftDeleteAllObjectRecords: [8],
			canDestroyAllObjectRecords: [8],
			canBeAssignedToUsers: [8],
			canBeAssignedToAgents: [8],
			canBeAssignedToApiKeys: [8],
			__typename: [1]
		},
		UpsertObjectPermissionsInput: {
			roleId: [3],
			objectPermissions: [496],
			__typename: [1]
		},
		ObjectPermissionInput: {
			objectMetadataId: [3],
			canReadObjectRecords: [8],
			canUpdateObjectRecords: [8],
			canSoftDeleteObjectRecords: [8],
			canDestroyObjectRecords: [8],
			__typename: [1]
		},
		UpsertPermissionFlagsInput: {
			roleId: [3],
			permissionFlagKeys: [1],
			__typename: [1]
		},
		UpsertFieldPermissionsInput: {
			roleId: [3],
			fieldPermissions: [499],
			__typename: [1]
		},
		FieldPermissionInput: {
			objectMetadataId: [3],
			fieldMetadataId: [3],
			canReadFieldValue: [8],
			canUpdateFieldValue: [8],
			__typename: [1]
		},
		UpsertRowLevelPermissionPredicatesInput: {
			roleId: [3],
			objectMetadataId: [3],
			predicates: [501],
			predicateGroups: [502],
			__typename: [1]
		},
		RowLevelPermissionPredicateInput: {
			id: [3],
			fieldMetadataId: [3],
			operand: [42],
			value: [9],
			subFieldName: [1],
			workspaceMemberFieldMetadataId: [1],
			workspaceMemberSubFieldName: [1],
			rowLevelPermissionPredicateGroupId: [3],
			positionInRowLevelPermissionPredicateGroup: [15],
			__typename: [1]
		},
		RowLevelPermissionPredicateGroupInput: {
			id: [3],
			objectMetadataId: [3],
			parentRowLevelPermissionPredicateGroupId: [3],
			logicalOperator: [40],
			positionInRowLevelPermissionPredicateGroup: [15],
			__typename: [1]
		},
		SendEmailViaDomainInput: {
			emailingDomainId: [1],
			to: [1],
			cc: [1],
			bcc: [1],
			subject: [1],
			text: [1],
			html: [1],
			from: [1],
			replyTo: [1],
			__typename: [1]
		},
		SendMessageCampaignInput: {
			campaignId: [1],
			__typename: [1]
		},
		CancelMessageCampaignInput: {
			campaignId: [1],
			__typename: [1]
		},
		SendMessageCampaignTestInput: {
			toAddress: [1],
			unsubscribeTopicId: [1],
			subject: [1],
			body: [1],
			fromAddress: [1],
			__typename: [1]
		},
		CreateMessageSuppressionInput: {
			emailAddress: [1],
			unsubscribeTopicId: [3],
			__typename: [1]
		},
		CreateUnsubscribeTopicInput: {
			name: [1],
			description: [1],
			visibility: [317],
			__typename: [1]
		},
		UpdateUnsubscribeTopicInput: {
			id: [1],
			name: [1],
			description: [1],
			visibility: [317],
			__typename: [1]
		},
		UpdateMessageChannelInput: {
			id: [3],
			update: [511],
			__typename: [1]
		},
		UpdateMessageChannelInputUpdates: {
			visibility: [300],
			isContactAutoCreationEnabled: [8],
			contactAutoCreationPolicy: [302],
			messageFolderImportPolicy: [303],
			isSyncEnabled: [8],
			excludeNonProfessionalEmails: [8],
			excludeGroupEmails: [8],
			__typename: [1]
		},
		CreateEmailGroupChannelInput: {
			handle: [1],
			displayName: [1],
			__typename: [1]
		},
		UpdateEmailGroupChannelInput: {
			id: [3],
			displayName: [1],
			__typename: [1]
		},
		CreateEmailingDomainInput: {
			domain: [1],
			__typename: [1]
		},
		RunAgentInput: {
			agentUniversalIdentifier: [1],
			prompt: [1],
			runAsWorkspaceMemberId: [3],
			messages: [516],
			__typename: [1]
		},
		RunAgentMessageInput: {
			role: [517],
			content: [1],
			__typename: [1]
		},
		RunAgentMessageRole: {},
		CreateWebhookInput: {
			id: [3],
			targetUrl: [1],
			operations: [1],
			description: [1],
			secret: [1],
			__typename: [1]
		},
		UpdateWebhookInput: {
			id: [3],
			update: [520],
			__typename: [1]
		},
		UpdateWebhookInputUpdates: {
			targetUrl: [1],
			operations: [1],
			description: [1],
			secret: [1],
			__typename: [1]
		},
		UpdateMessageFolderInput: {
			id: [3],
			update: [522],
			__typename: [1]
		},
		UpdateMessageFolderInputUpdates: {
			isSynced: [8],
			__typename: [1]
		},
		UpdateMessageFoldersInput: {
			ids: [3],
			update: [522],
			__typename: [1]
		},
		UpdateCalendarChannelInput: {
			id: [3],
			update: [525],
			__typename: [1]
		},
		UpdateCalendarChannelInputUpdates: {
			visibility: [365],
			isContactAutoCreationEnabled: [8],
			contactAutoCreationPolicy: [366],
			isSyncEnabled: [8],
			__typename: [1]
		},
		SetAppKeyValueInput: {
			key: [1],
			value: [9],
			scope: [361],
			__typename: [1]
		},
		EnqueueJobInput: {
			logicFunctionUniversalIdentifier: [1],
			payload: [9],
			retryLimit: [26],
			delayMs: [26],
			__typename: [1]
		},
		EnqueueJobsInput: {
			logicFunctionUniversalIdentifier: [1],
			payloads: [9],
			retryLimit: [26],
			delayMs: [26],
			__typename: [1]
		},
		FileAttachmentInput: {
			id: [3],
			filename: [1],
			__typename: [1]
		},
		AgentChatQuestionAnswerInput: {
			questionIndex: [26],
			selectedOptionIndices: [26],
			freeText: [1],
			__typename: [1]
		},
		CreateSkillInput: {
			id: [3],
			name: [1],
			label: [1],
			icon: [1],
			description: [1],
			content: [1],
			__typename: [1]
		},
		UpdateSkillInput: {
			id: [3],
			name: [1],
			label: [1],
			icon: [1],
			description: [1],
			content: [1],
			isActive: [8],
			__typename: [1]
		},
		UpdateTimelineActivityTypeInput: {
			id: [3],
			label: [1],
			icon: [1],
			isActive: [8],
			translations: [459],
			__typename: [1]
		},
		GetAuthorizationUrlForSSOInput: {
			identityProviderId: [3],
			workspaceInviteHash: [1],
			__typename: [1]
		},
		SignUpInNewWorkspaceInput: {
			displayName: [1],
			subdomain: [1],
			__typename: [1]
		},
		UpdateWorkspaceMemberSettingsInput: {
			workspaceMemberId: [3],
			update: [9],
			__typename: [1]
		},
		SetupOIDCSsoInput: {
			name: [1],
			issuer: [1],
			clientID: [1],
			clientSecret: [1],
			__typename: [1]
		},
		SetupSAMLSsoInput: {
			name: [1],
			issuer: [1],
			id: [3],
			ssoURL: [1],
			certificate: [1],
			fingerprint: [1],
			__typename: [1]
		},
		DeleteSsoInput: {
			identityProviderId: [3],
			__typename: [1]
		},
		EditSsoInput: {
			id: [3],
			status: [194],
			__typename: [1]
		},
		AnalyticsType: {},
		CreateCalendarEventInput: {
			connectedAccountId: [1],
			title: [1],
			description: [1],
			location: [1],
			startsAt: [1],
			endsAt: [1],
			isFullDay: [8],
			timeZone: [1],
			attendees: [1],
			sendInvitations: [8],
			addConferencing: [8],
			__typename: [1]
		},
		SendEmailInput: {
			connectedAccountId: [1],
			fromHandle: [1],
			to: [1],
			cc: [1],
			bcc: [1],
			subject: [1],
			body: [1],
			inReplyTo: [1],
			draftMessageId: [1],
			files: [544],
			__typename: [1]
		},
		SendEmailAttachmentInput: {
			id: [1],
			name: [1],
			__typename: [1]
		},
		EmailAccountConnectionParameters: {
			name: [1],
			IMAP: [546],
			SMTP: [546],
			CALDAV: [546],
			__typename: [1]
		},
		ConnectionParametersInput: {
			host: [1],
			port: [15],
			username: [1],
			password: [1],
			connectionSecurity: [178],
			__typename: [1]
		},
		UpdateLabPublicFeatureFlagInput: {
			publicFeatureFlag: [1],
			value: [8],
			__typename: [1]
		},
		ApplicationFileUploadRequestInput: {
			fileFolder: [288],
			filePath: [1],
			size: [26],
			__typename: [1]
		},
		Subscription: {
			onEventSubscription: [164, { eventStreamId: [1, "String!"] }],
			logicFunctionLogs: [259, { input: [550, "LogicFunctionLogsInput!"] }],
			onAgentChatEvent: [352, { threadId: [3, "UUID!"] }],
			eventLogsLive: [341, { table: [390, "EventLogTable!"] }],
			__typename: [1]
		},
		LogicFunctionLogsInput: {
			applicationId: [3],
			applicationUniversalIdentifier: [3],
			name: [1],
			id: [3],
			universalIdentifier: [3],
			__typename: [1]
		}
	}
}, ie = /* @__PURE__ */ t({
	enumAggregateOperations: () => su,
	enumAllMetadataName: () => Sd,
	enumAnalyticsType: () => Td,
	enumAppKeyValueScope: () => hd,
	enumApplicationRegistrationSourceType: () => Jl,
	enumApplicationState: () => au,
	enumAxisNameDisplay: () => Du,
	enumBarChartGroupMode: () => Ou,
	enumBarChartLayout: () => ku,
	enumBillingEntitlementKey: () => $u,
	enumBillingPlanKey: () => Mu,
	enumBillingProductKey: () => Pu,
	enumBillingUsageType: () => Nu,
	enumCalendarChannelContactAutoCreationPolicy: () => yd,
	enumCalendarChannelSyncStage: () => _d,
	enumCalendarChannelSyncStatus: () => gd,
	enumCalendarChannelVisibility: () => vd,
	enumCaptchaDriverType: () => qu,
	enumChartNumberFormat: () => wu,
	enumCommandMenuItemAvailabilityType: () => Xl,
	enumDatabaseEventAction: () => Bu,
	enumEmailConnectionSecurity: () => Vu,
	enumEmailingDomainStatus: () => td,
	enumEmailingDomainTenantStatus: () => nd,
	enumEngineComponentKey: () => Yl,
	enumEventLogTable: () => Cd,
	enumFeatureFlagKey: () => Hu,
	enumFieldDisplayMode: () => Au,
	enumFieldMetadataType: () => Xu,
	enumFileFolder: () => ed,
	enumGraphOrderBy: () => Eu,
	enumIdentityProviderType: () => Uu,
	enumIndexType: () => Qu,
	enumLogicFunctionExecutionMode: () => Zl,
	enumLogicFunctionExecutionStatus: () => Lu,
	enumMessageChannelContactAutoCreationPolicy: () => od,
	enumMessageChannelPendingGroupEmailsAction: () => cd,
	enumMessageChannelSyncStage: () => ud,
	enumMessageChannelSyncStatus: () => ld,
	enumMessageChannelType: () => ad,
	enumMessageChannelVisibility: () => id,
	enumMessageFolderImportPolicy: () => sd,
	enumMessageFolderPendingSyncAction: () => bd,
	enumMessageSuppressionReason: () => dd,
	enumMessageSuppressionSource: () => fd,
	enumMetadataEventAction: () => zu,
	enumMetadataTranslationProvenance: () => xd,
	enumModelFamily: () => Gu,
	enumNavigationMenuItemType: () => Ru,
	enumObjectOpenRecordIn: () => Ql,
	enumObjectRecordGroupByDateGranularity: () => Tu,
	enumOnboardingStatus: () => vu,
	enumOpenRecordIn: () => $l,
	enumPageLayoutTabLayoutMode: () => Su,
	enumPageLayoutType: () => ju,
	enumPermissionFlagType: () => ou,
	enumRelationType: () => Zu,
	enumRowLevelPermissionPredicateGroupLogicalOperator: () => ru,
	enumRowLevelPermissionPredicateOperand: () => iu,
	enumRunAgentMessageRole: () => wd,
	enumSsoIdentityProviderStatus: () => Wu,
	enumSubscriptionInterval: () => Fu,
	enumSubscriptionStatus: () => Iu,
	enumSupportDriver: () => Ku,
	enumUnsubscribeHostnameStatus: () => rd,
	enumUnsubscribeTopicVisibility: () => pd,
	enumUsageOperationType: () => bu,
	enumUsageResourceType: () => yu,
	enumViewCalendarLayout: () => mu,
	enumViewFilterGroupLogicalOperator: () => cu,
	enumViewFilterOperand: () => lu,
	enumViewKey: () => fu,
	enumViewOpenRecordIn: () => pu,
	enumViewSortDirection: () => uu,
	enumViewType: () => du,
	enumViewVisibility: () => hu,
	enumWidgetConfigurationType: () => Cu,
	enumWidgetType: () => xu,
	enumWorkspaceActivationStatus: () => _u,
	enumWorkspaceCompanyEnrichmentOutcome: () => Ju,
	enumWorkspaceDiscoverability: () => gu,
	enumWorkspaceMemberDateFormatEnum: () => eu,
	enumWorkspaceMemberNumberFormatEnum: () => nu,
	enumWorkspaceMemberTimeFormatEnum: () => tu,
	enumWorkspacePersonEnrichmentOutcome: () => Yu,
	enumWorkspaceSetupChatOutcome: () => md,
	isAgent: () => y,
	isAgentChatEvent: () => sl,
	isAgentChatThread: () => Yc,
	isAgentMessage: () => qc,
	isAgentMessagePart: () => dc,
	isAgentTurn: () => pl,
	isAgentTurnEvaluation: () => dl,
	isAggregateChartConfiguration: () => ct,
	isAiSystemPromptPreview: () => $c,
	isAiSystemPromptSection: () => Zc,
	isAnalytics: () => Lc,
	isApiConfig: () => ji,
	isApiKey: () => p,
	isApiKeyForRole: () => ue,
	isApiKeyToken: () => Go,
	isAppConnection: () => Yi,
	isAppKeyValue: () => xl,
	isApplication: () => me,
	isApplicationAuthorization: () => as,
	isApplicationConnectionProvider: () => hn,
	isApplicationConnectionProviderOAuthConfig: () => pn,
	isApplicationFileCompletionError: () => ls,
	isApplicationFileUploadError: () => hs,
	isApplicationFileUploadTarget: () => ps,
	isApplicationRegistration: () => Re,
	isApplicationRegistrationStats: () => ai,
	isApplicationRegistrationSummary: () => h,
	isApplicationRegistrationVariable: () => ti,
	isApplicationTokenPair: () => C,
	isApplicationVariable: () => _,
	isApprovedAccessDomain: () => qn,
	isAuthBypassProviders: () => pi,
	isAuthProviders: () => di,
	isAuthToken: () => x,
	isAuthTokenPair: () => xo,
	isAuthTokens: () => qo,
	isAuthorizeApp: () => yo,
	isAutocompleteResult: () => qs,
	isAvailableWorkspace: () => da,
	isAvailableWorkspaces: () => pa,
	isAvailableWorkspacesAndAccessTokens: () => Co,
	isBarChartConfiguration: () => vt,
	isBarChartData: () => xc,
	isBarChartSeries: () => yc,
	isBilling: () => Ci,
	isBillingCustomer: () => Ln,
	isBillingEndTrialPeriod: () => hr,
	isBillingEntitlement: () => ro,
	isBillingLicensedProduct: () => jn,
	isBillingMeteredProduct: () => Nn,
	isBillingPaymentIntent: () => xr,
	isBillingPlan: () => yr,
	isBillingPriceLicensed: () => Cn,
	isBillingPriceMetered: () => Dn,
	isBillingPriceTier: () => Tn,
	isBillingProduct: () => kn,
	isBillingProductDTO: () => d,
	isBillingProductMetadata: () => xn,
	isBillingResourceCreditUsage: () => _r,
	isBillingSession: () => Cr,
	isBillingSubscription: () => zn,
	isBillingSubscriptionItem: () => Fn,
	isBillingSubscriptionSchedulePhase: () => yn,
	isBillingSubscriptionSchedulePhaseItem: () => _n,
	isBillingTrialPeriod: () => si,
	isBillingUpdate: () => Tr,
	isCalendarChannel: () => Cl,
	isCalendarConfiguration: () => bt,
	isCallRecordingSummaryConfiguration: () => Ot,
	isCallRecordingTranscriptConfiguration: () => At,
	isCampaignAudiencePreviewDTO: () => Ns,
	isCancelMessageCampaignOutputDTO: () => Fs,
	isCaptcha: () => ki,
	isChannelSyncSuccess: () => hc,
	isChatStreamCatchupChunks: () => rl,
	isChatStreamError: () => tl,
	isCheckUserExist: () => Zo,
	isClaimableApplicationRegistration: () => Vi,
	isClientAiModelConfig: () => xi,
	isClientConfig: () => zi,
	isClientConfigMaintenanceMode: () => Li,
	isCollectionHash: () => Fl,
	isCommandMenuItem: () => D,
	isCommandMenuItemPayload: () => k,
	isCompleteApplicationFileUploadsResult: () => ds,
	isConnectedAccountPublicDTO: () => Vr,
	isConnectedImapSmtpCaldavAccount: () => rc,
	isCreateApplicationFileUploadsResult: () => _s,
	isCreateApplicationRegistration: () => Ui,
	isCreateCalendarEventOutput: () => _c,
	isCreateEmailGroupChannelOutput: () => js,
	isDeleteSso: () => $i,
	isDeleteTwoFactorAuthenticationMethod: () => po,
	isDeletedWorkspaceMember: () => ha,
	isDevelopmentApplication: () => ys,
	isDomainRecord: () => ao,
	isDomainValidRecords: () => so,
	isDuplicatedDashboard: () => Nc,
	isEditSso: () => ta,
	isEmailPasswordResetLink: () => To,
	isEmailThreadConfiguration: () => Et,
	isEmailingDomain: () => Ds,
	isEmailsConfiguration: () => wt,
	isEnqueueJobResult: () => _l,
	isEnqueueJobsResult: () => yl,
	isEnterpriseLicenseInfoDTO: () => Un,
	isEnterpriseSubscriptionStatusDTO: () => Gn,
	isEventLogPageInfo: () => Vc,
	isEventLogQueryResult: () => Uc,
	isEventLogRecord: () => zc,
	isEventSubscription: () => dr,
	isFeatureFlag: () => Zr,
	isField: () => ka,
	isFieldConfiguration: () => It,
	isFieldConnection: () => Fa,
	isFieldEdge: () => Na,
	isFieldPermission: () => U,
	isFieldRichTextConfiguration: () => Rt,
	isFieldsConfiguration: () => Bt,
	isFile: () => ss,
	isFileUploadTarget: () => Zn,
	isFileWithSignedUrl: () => Yn,
	isFilesConfiguration: () => Wt,
	isFindAvailableSSOIDP: () => aa,
	isFormFieldConfiguration: () => Ht,
	isFrontComponent: () => T,
	isFrontComponentConfiguration: () => St,
	isFullName: () => z,
	isGetAuthorizationUrlForSSO: () => Do,
	isGridPosition: () => Je,
	isIframeConfiguration: () => gt,
	isImapSmtpCaldavConnectionSuccess: () => ac,
	isImapSmtpCaldavPublicConnectionParameters: () => tc,
	isImapSmtpCaldavPublicConnectionParams: () => $s,
	isImpersonate: () => ts,
	isIndex: () => Va,
	isIndexEdge: () => Ua,
	isIndexField: () => za,
	isInitiateTwoFactorAuthenticationProvisioning: () => ho,
	isInvalidatePassword: () => ko,
	isInviteSuggestion: () => Dr,
	isLineChartConfiguration: () => mt,
	isLineChartData: () => Dc,
	isLineChartDataPoint: () => Cc,
	isLineChartSeries: () => Tc,
	isLocation: () => Ys,
	isLogicFunction: () => F,
	isLogicFunctionExecutionResult: () => Vn,
	isLogicFunctionLogs: () => uo,
	isLoginToken: () => Yo,
	isMarketplaceApp: () => _a,
	isMarketplaceAppDetail: () => Ta,
	isMarketplaceAppRole: () => Ca,
	isMarketplaceAppRoleFieldPermission: () => xa,
	isMarketplaceAppRoleObjectPermission: () => ya,
	isMessageCampaignBodyConfiguration: () => Mt,
	isMessageCampaignDetailsConfiguration: () => Pt,
	isMessageChannel: () => ks,
	isMessageFolder: () => Tl,
	isMessageSuppression: () => Vs,
	isMessageSuppressionList: () => Us,
	isMetadataEvent: () => ar,
	isMetadataTranslation: () => Dl,
	isMinimalMetadata: () => Vl,
	isMinimalObjectMetadata: () => Ll,
	isMinimalView: () => zl,
	isMutation: () => Gl,
	isNativeModelCapabilities: () => yi,
	isNavigationMenuItem: () => tr,
	isNotesConfiguration: () => Kt,
	isObject: () => L,
	isObjectConnection: () => qa,
	isObjectEdge: () => Ga,
	isObjectFieldsConnection: () => Ya,
	isObjectIndexMetadatasConnection: () => Za,
	isObjectMetadataCommandMenuItemPayload: () => N,
	isObjectPermission: () => oe,
	isObjectRecordCount: () => $a,
	isObjectRecordEvent: () => sr,
	isObjectRecordEventProperties: () => rr,
	isObjectRecordEventWithQueryIds: () => lr,
	isOnboardingStepNavigation: () => kr,
	isOnboardingStepSuccess: () => jr,
	isPageInfo: () => ja,
	isPageLayout: () => dn,
	isPageLayoutTab: () => ln,
	isPageLayoutWidget: () => Xe,
	isPageLayoutWidgetCanvasPosition: () => it,
	isPageLayoutWidgetGridPosition: () => et,
	isPageLayoutWidgetPosition: () => Qe,
	isPageLayoutWidgetVerticalListPosition: () => nt,
	isPathCommandMenuItemPayload: () => j,
	isPieChartConfiguration: () => ft,
	isPieChartData: () => jc,
	isPieChartDataItem: () => kc,
	isPlaceDetailsResult: () => Zs,
	isPublicApplicationRegistration: () => Gi,
	isPublicConnectionParametersOutput: () => Lr,
	isPublicDomain: () => Cs,
	isPublicFeatureFlag: () => Fi,
	isPublicFeatureFlagMetadata: () => Ni,
	isPublicImapSmtpCaldavConnectionParameters: () => zr,
	isPublicWorkspaceData: () => hi,
	isPublicWorkspaceDataSummary: () => _i,
	isQuery: () => Ul,
	isRatioAggregateConfig: () => We,
	isRecordIdentifier: () => $n,
	isRecordTableConfiguration: () => en,
	isRelation: () => La,
	isResendEmailVerificationToken: () => Zi,
	isRichTextBody: () => Ke,
	isRole: () => fe,
	isRolePermissionFlag: () => ce,
	isRotateClientSecret: () => qi,
	isRowLevelPermissionPredicate: () => q,
	isRowLevelPermissionPredicateGroup: () => G,
	isRunAgentResult: () => pc,
	isSSOConnection: () => la,
	isSSOIdentityProvider: () => li,
	isSdkClientChecksums: () => He,
	isSearchField: () => to,
	isSendChatMessageResult: () => al,
	isSendEmailOutput: () => Fc,
	isSendEmailViaDomainOutput: () => Ls,
	isSendInvitations: () => Fr,
	isSendMessageCampaignOutputDTO: () => zs,
	isSentry: () => Di,
	isSetupSso: () => sa,
	isSignUp: () => No,
	isSkill: () => Gc,
	isStandaloneRichTextConfiguration: () => ut,
	isStartWorkspaceSetupChatResult: () => ll,
	isStopImpersonation: () => rs,
	isSubdomainAvailabilityDTO: () => Vo,
	isSubscription: () => ql,
	isSupport: () => Ti,
	isTasksConfiguration: () => Jt,
	isTimelineActivityType: () => Nl,
	isTimelineActivityTypeEmit: () => jl,
	isTimelineActivityTypeEmitThrough: () => kl,
	isTimelineConfiguration: () => Xt,
	isToolIndexEntry: () => lc,
	isTransientToken: () => Fo,
	isTwoFactorAuthenticationMethodSummary: () => ge,
	isUnsubscribeTopic: () => Gs,
	isUpsertRowLevelPermissionPredicatesResult: () => co,
	isUsageAnalytics: () => Yr,
	isUsageBreakdownItem: () => Ur,
	isUsageLimit: () => Be,
	isUsageTimeSeries: () => Gr,
	isUsageUserDaily: () => qr,
	isUser: () => Ie,
	isUserSession: () => pr,
	isUserWorkspace: () => ve,
	isValidatePasswordResetToken: () => Lo,
	isVerificationRecord: () => Ts,
	isVerifyEmailAndGetLoginToken: () => zo,
	isVerifyTwoFactorAuthenticationMethod: () => _o,
	isVersionDistributionEntry: () => ri,
	isView: () => Me,
	isViewConfiguration: () => Qt,
	isViewField: () => be,
	isViewFieldGroup: () => Ae,
	isViewFilter: () => we,
	isViewFilterGroup: () => Se,
	isViewGroup: () => Ee,
	isViewSort: () => Oe,
	isWebhook: () => sc,
	isWidgetConfiguration: () => ot,
	isWorkflowConfiguration: () => nn,
	isWorkflowRunConfiguration: () => an,
	isWorkflowVersionConfiguration: () => sn,
	isWorkspace: () => Pe,
	isWorkspaceAiStats: () => hl,
	isWorkspaceCompanyEnrichmentResult: () => Da,
	isWorkspaceCreationDefaultsDTO: () => Uo,
	isWorkspaceInvitation: () => Nr,
	isWorkspaceInviteHashValid: () => $o,
	isWorkspaceMember: () => V,
	isWorkspaceMigration: () => xs,
	isWorkspaceNameAndId: () => ra,
	isWorkspaceUrls: () => $r,
	isWorkspaceUrlsAndId: () => jo
}), ae = ["BillingLicensedProduct", "BillingMeteredProduct"], d = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingProductDTO\"");
	return ae.includes(e.__typename);
}, f = ["ApiKey"], p = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApiKey\"");
	return f.includes(e.__typename);
}, m = ["ApplicationRegistrationSummary"], h = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationRegistrationSummary\"");
	return m.includes(e.__typename);
}, g = ["ApplicationVariable"], _ = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationVariable\"");
	return g.includes(e.__typename);
}, v = ["Agent"], y = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgent\"");
	return v.includes(e.__typename);
}, b = ["AuthToken"], x = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAuthToken\"");
	return b.includes(e.__typename);
}, S = ["ApplicationTokenPair"], C = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationTokenPair\"");
	return S.includes(e.__typename);
}, w = ["FrontComponent"], T = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFrontComponent\"");
	return w.includes(e.__typename);
}, E = ["CommandMenuItem"], D = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCommandMenuItem\"");
	return E.includes(e.__typename);
}, O = ["PathCommandMenuItemPayload", "ObjectMetadataCommandMenuItemPayload"], k = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCommandMenuItemPayload\"");
	return O.includes(e.__typename);
}, A = ["PathCommandMenuItemPayload"], j = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPathCommandMenuItemPayload\"");
	return A.includes(e.__typename);
}, M = ["ObjectMetadataCommandMenuItemPayload"], N = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectMetadataCommandMenuItemPayload\"");
	return M.includes(e.__typename);
}, P = ["LogicFunction"], F = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLogicFunction\"");
	return P.includes(e.__typename);
}, I = ["Object"], L = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObject\"");
	return I.includes(e.__typename);
}, R = ["FullName"], z = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFullName\"");
	return R.includes(e.__typename);
}, B = ["WorkspaceMember"], V = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceMember\"");
	return B.includes(e.__typename);
}, H = ["FieldPermission"], U = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFieldPermission\"");
	return H.includes(e.__typename);
}, W = ["RowLevelPermissionPredicateGroup"], G = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRowLevelPermissionPredicateGroup\"");
	return W.includes(e.__typename);
}, K = ["RowLevelPermissionPredicate"], q = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRowLevelPermissionPredicate\"");
	return K.includes(e.__typename);
}, J = ["ObjectPermission"], oe = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectPermission\"");
	return J.includes(e.__typename);
}, se = ["RolePermissionFlag"], ce = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRolePermissionFlag\"");
	return se.includes(e.__typename);
}, le = ["ApiKeyForRole"], ue = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApiKeyForRole\"");
	return le.includes(e.__typename);
}, de = ["Role"], fe = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRole\"");
	return de.includes(e.__typename);
}, pe = ["Application"], me = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplication\"");
	return pe.includes(e.__typename);
}, he = ["TwoFactorAuthenticationMethodSummary"], ge = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTwoFactorAuthenticationMethodSummary\"");
	return he.includes(e.__typename);
}, _e = ["UserWorkspace"], ve = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUserWorkspace\"");
	return _e.includes(e.__typename);
}, ye = ["ViewField"], be = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewField\"");
	return ye.includes(e.__typename);
}, xe = ["ViewFilterGroup"], Se = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewFilterGroup\"");
	return xe.includes(e.__typename);
}, Ce = ["ViewFilter"], we = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewFilter\"");
	return Ce.includes(e.__typename);
}, Te = ["ViewGroup"], Ee = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewGroup\"");
	return Te.includes(e.__typename);
}, De = ["ViewSort"], Oe = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewSort\"");
	return De.includes(e.__typename);
}, ke = ["ViewFieldGroup"], Ae = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewFieldGroup\"");
	return ke.includes(e.__typename);
}, je = ["View"], Me = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isView\"");
	return je.includes(e.__typename);
}, Ne = ["Workspace"], Pe = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspace\"");
	return Ne.includes(e.__typename);
}, Fe = ["User"], Ie = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUser\"");
	return Fe.includes(e.__typename);
}, Le = ["ApplicationRegistration"], Re = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationRegistration\"");
	return Le.includes(e.__typename);
}, ze = ["UsageLimit"], Be = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUsageLimit\"");
	return ze.includes(e.__typename);
}, Ve = ["SdkClientChecksums"], He = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSdkClientChecksums\"");
	return Ve.includes(e.__typename);
}, Ue = ["RatioAggregateConfig"], We = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRatioAggregateConfig\"");
	return Ue.includes(e.__typename);
}, Ge = ["RichTextBody"], Ke = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRichTextBody\"");
	return Ge.includes(e.__typename);
}, qe = ["GridPosition"], Je = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isGridPosition\"");
	return qe.includes(e.__typename);
}, Ye = ["PageLayoutWidget"], Xe = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayoutWidget\"");
	return Ye.includes(e.__typename);
}, Ze = [
	"PageLayoutWidgetGridPosition",
	"PageLayoutWidgetVerticalListPosition",
	"PageLayoutWidgetCanvasPosition"
], Qe = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayoutWidgetPosition\"");
	return Ze.includes(e.__typename);
}, $e = ["PageLayoutWidgetGridPosition"], et = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayoutWidgetGridPosition\"");
	return $e.includes(e.__typename);
}, tt = ["PageLayoutWidgetVerticalListPosition"], nt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayoutWidgetVerticalListPosition\"");
	return tt.includes(e.__typename);
}, rt = ["PageLayoutWidgetCanvasPosition"], it = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayoutWidgetCanvasPosition\"");
	return rt.includes(e.__typename);
}, at = /* @__PURE__ */ "AggregateChartConfiguration.StandaloneRichTextConfiguration.PieChartConfiguration.LineChartConfiguration.IframeConfiguration.BarChartConfiguration.CalendarConfiguration.FrontComponentConfiguration.EmailsConfiguration.EmailThreadConfiguration.CallRecordingSummaryConfiguration.CallRecordingTranscriptConfiguration.MessageCampaignBodyConfiguration.MessageCampaignDetailsConfiguration.FieldConfiguration.FieldRichTextConfiguration.FieldsConfiguration.FormFieldConfiguration.FilesConfiguration.NotesConfiguration.TasksConfiguration.TimelineConfiguration.ViewConfiguration.RecordTableConfiguration.WorkflowConfiguration.WorkflowRunConfiguration.WorkflowVersionConfiguration".split("."), ot = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWidgetConfiguration\"");
	return at.includes(e.__typename);
}, st = ["AggregateChartConfiguration"], ct = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAggregateChartConfiguration\"");
	return st.includes(e.__typename);
}, lt = ["StandaloneRichTextConfiguration"], ut = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isStandaloneRichTextConfiguration\"");
	return lt.includes(e.__typename);
}, dt = ["PieChartConfiguration"], ft = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPieChartConfiguration\"");
	return dt.includes(e.__typename);
}, pt = ["LineChartConfiguration"], mt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLineChartConfiguration\"");
	return pt.includes(e.__typename);
}, ht = ["IframeConfiguration"], gt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isIframeConfiguration\"");
	return ht.includes(e.__typename);
}, _t = ["BarChartConfiguration"], vt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBarChartConfiguration\"");
	return _t.includes(e.__typename);
}, yt = ["CalendarConfiguration"], bt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCalendarConfiguration\"");
	return yt.includes(e.__typename);
}, xt = ["FrontComponentConfiguration"], St = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFrontComponentConfiguration\"");
	return xt.includes(e.__typename);
}, Ct = ["EmailsConfiguration"], wt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEmailsConfiguration\"");
	return Ct.includes(e.__typename);
}, Tt = ["EmailThreadConfiguration"], Et = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEmailThreadConfiguration\"");
	return Tt.includes(e.__typename);
}, Dt = ["CallRecordingSummaryConfiguration"], Ot = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCallRecordingSummaryConfiguration\"");
	return Dt.includes(e.__typename);
}, kt = ["CallRecordingTranscriptConfiguration"], At = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCallRecordingTranscriptConfiguration\"");
	return kt.includes(e.__typename);
}, jt = ["MessageCampaignBodyConfiguration"], Mt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMessageCampaignBodyConfiguration\"");
	return jt.includes(e.__typename);
}, Nt = ["MessageCampaignDetailsConfiguration"], Pt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMessageCampaignDetailsConfiguration\"");
	return Nt.includes(e.__typename);
}, Ft = ["FieldConfiguration"], It = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFieldConfiguration\"");
	return Ft.includes(e.__typename);
}, Lt = ["FieldRichTextConfiguration"], Rt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFieldRichTextConfiguration\"");
	return Lt.includes(e.__typename);
}, zt = ["FieldsConfiguration"], Bt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFieldsConfiguration\"");
	return zt.includes(e.__typename);
}, Vt = ["FormFieldConfiguration"], Ht = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFormFieldConfiguration\"");
	return Vt.includes(e.__typename);
}, Ut = ["FilesConfiguration"], Wt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFilesConfiguration\"");
	return Ut.includes(e.__typename);
}, Gt = ["NotesConfiguration"], Kt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isNotesConfiguration\"");
	return Gt.includes(e.__typename);
}, qt = ["TasksConfiguration"], Jt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTasksConfiguration\"");
	return qt.includes(e.__typename);
}, Yt = ["TimelineConfiguration"], Xt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTimelineConfiguration\"");
	return Yt.includes(e.__typename);
}, Zt = ["ViewConfiguration"], Qt = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isViewConfiguration\"");
	return Zt.includes(e.__typename);
}, $t = ["RecordTableConfiguration"], en = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRecordTableConfiguration\"");
	return $t.includes(e.__typename);
}, tn = ["WorkflowConfiguration"], nn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkflowConfiguration\"");
	return tn.includes(e.__typename);
}, rn = ["WorkflowRunConfiguration"], an = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkflowRunConfiguration\"");
	return rn.includes(e.__typename);
}, on = ["WorkflowVersionConfiguration"], sn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkflowVersionConfiguration\"");
	return on.includes(e.__typename);
}, cn = ["PageLayoutTab"], ln = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayoutTab\"");
	return cn.includes(e.__typename);
}, un = ["PageLayout"], dn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageLayout\"");
	return un.includes(e.__typename);
}, fn = ["ApplicationConnectionProviderOAuthConfig"], pn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationConnectionProviderOAuthConfig\"");
	return fn.includes(e.__typename);
}, mn = ["ApplicationConnectionProvider"], hn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationConnectionProvider\"");
	return mn.includes(e.__typename);
}, gn = ["BillingSubscriptionSchedulePhaseItem"], _n = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingSubscriptionSchedulePhaseItem\"");
	return gn.includes(e.__typename);
}, vn = ["BillingSubscriptionSchedulePhase"], yn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingSubscriptionSchedulePhase\"");
	return vn.includes(e.__typename);
}, bn = ["BillingProductMetadata"], xn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingProductMetadata\"");
	return bn.includes(e.__typename);
}, Sn = ["BillingPriceLicensed"], Cn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingPriceLicensed\"");
	return Sn.includes(e.__typename);
}, wn = ["BillingPriceTier"], Tn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingPriceTier\"");
	return wn.includes(e.__typename);
}, En = ["BillingPriceMetered"], Dn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingPriceMetered\"");
	return En.includes(e.__typename);
}, On = ["BillingProduct"], kn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingProduct\"");
	return On.includes(e.__typename);
}, An = ["BillingLicensedProduct"], jn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingLicensedProduct\"");
	return An.includes(e.__typename);
}, Mn = ["BillingMeteredProduct"], Nn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingMeteredProduct\"");
	return Mn.includes(e.__typename);
}, Pn = ["BillingSubscriptionItem"], Fn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingSubscriptionItem\"");
	return Pn.includes(e.__typename);
}, In = ["BillingCustomer"], Ln = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingCustomer\"");
	return In.includes(e.__typename);
}, Rn = ["BillingSubscription"], zn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingSubscription\"");
	return Rn.includes(e.__typename);
}, Bn = ["LogicFunctionExecutionResult"], Vn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLogicFunctionExecutionResult\"");
	return Bn.includes(e.__typename);
}, Hn = ["EnterpriseLicenseInfoDTO"], Un = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEnterpriseLicenseInfoDTO\"");
	return Hn.includes(e.__typename);
}, Wn = ["EnterpriseSubscriptionStatusDTO"], Gn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEnterpriseSubscriptionStatusDTO\"");
	return Wn.includes(e.__typename);
}, Kn = ["ApprovedAccessDomain"], qn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApprovedAccessDomain\"");
	return Kn.includes(e.__typename);
}, Jn = ["FileWithSignedUrl"], Yn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFileWithSignedUrl\"");
	return Jn.includes(e.__typename);
}, Xn = ["FileUploadTarget"], Zn = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFileUploadTarget\"");
	return Xn.includes(e.__typename);
}, Qn = ["RecordIdentifier"], $n = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRecordIdentifier\"");
	return Qn.includes(e.__typename);
}, er = ["NavigationMenuItem"], tr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isNavigationMenuItem\"");
	return er.includes(e.__typename);
}, nr = ["ObjectRecordEventProperties"], rr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectRecordEventProperties\"");
	return nr.includes(e.__typename);
}, ir = ["MetadataEvent"], ar = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMetadataEvent\"");
	return ir.includes(e.__typename);
}, or = ["ObjectRecordEvent"], sr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectRecordEvent\"");
	return or.includes(e.__typename);
}, cr = ["ObjectRecordEventWithQueryIds"], lr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectRecordEventWithQueryIds\"");
	return cr.includes(e.__typename);
}, ur = ["EventSubscription"], dr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEventSubscription\"");
	return ur.includes(e.__typename);
}, fr = ["UserSession"], pr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUserSession\"");
	return fr.includes(e.__typename);
}, mr = ["BillingEndTrialPeriod"], hr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingEndTrialPeriod\"");
	return mr.includes(e.__typename);
}, gr = ["BillingResourceCreditUsage"], _r = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingResourceCreditUsage\"");
	return gr.includes(e.__typename);
}, vr = ["BillingPlan"], yr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingPlan\"");
	return vr.includes(e.__typename);
}, br = ["BillingPaymentIntent"], xr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingPaymentIntent\"");
	return br.includes(e.__typename);
}, Sr = ["BillingSession"], Cr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingSession\"");
	return Sr.includes(e.__typename);
}, wr = ["BillingUpdate"], Tr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingUpdate\"");
	return wr.includes(e.__typename);
}, Er = ["InviteSuggestion"], Dr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isInviteSuggestion\"");
	return Er.includes(e.__typename);
}, Or = ["OnboardingStepNavigation"], kr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isOnboardingStepNavigation\"");
	return Or.includes(e.__typename);
}, Ar = ["OnboardingStepSuccess"], jr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isOnboardingStepSuccess\"");
	return Ar.includes(e.__typename);
}, Mr = ["WorkspaceInvitation"], Nr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceInvitation\"");
	return Mr.includes(e.__typename);
}, Pr = ["SendInvitations"], Fr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSendInvitations\"");
	return Pr.includes(e.__typename);
}, Ir = ["PublicConnectionParametersOutput"], Lr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicConnectionParametersOutput\"");
	return Ir.includes(e.__typename);
}, Rr = ["PublicImapSmtpCaldavConnectionParameters"], zr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicImapSmtpCaldavConnectionParameters\"");
	return Rr.includes(e.__typename);
}, Br = ["ConnectedAccountPublicDTO"], Vr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isConnectedAccountPublicDTO\"");
	return Br.includes(e.__typename);
}, Hr = ["UsageBreakdownItem"], Ur = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUsageBreakdownItem\"");
	return Hr.includes(e.__typename);
}, Wr = ["UsageTimeSeries"], Gr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUsageTimeSeries\"");
	return Wr.includes(e.__typename);
}, Kr = ["UsageUserDaily"], qr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUsageUserDaily\"");
	return Kr.includes(e.__typename);
}, Jr = ["UsageAnalytics"], Yr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUsageAnalytics\"");
	return Jr.includes(e.__typename);
}, Xr = ["FeatureFlag"], Zr = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFeatureFlag\"");
	return Xr.includes(e.__typename);
}, Qr = ["WorkspaceUrls"], $r = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceUrls\"");
	return Qr.includes(e.__typename);
}, ei = ["ApplicationRegistrationVariable"], ti = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationRegistrationVariable\"");
	return ei.includes(e.__typename);
}, ni = ["VersionDistributionEntry"], ri = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isVersionDistributionEntry\"");
	return ni.includes(e.__typename);
}, ii = ["ApplicationRegistrationStats"], ai = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationRegistrationStats\"");
	return ii.includes(e.__typename);
}, oi = ["BillingTrialPeriod"], si = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingTrialPeriod\"");
	return oi.includes(e.__typename);
}, ci = ["SSOIdentityProvider"], li = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSSOIdentityProvider\"");
	return ci.includes(e.__typename);
}, ui = ["AuthProviders"], di = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAuthProviders\"");
	return ui.includes(e.__typename);
}, fi = ["AuthBypassProviders"], pi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAuthBypassProviders\"");
	return fi.includes(e.__typename);
}, mi = ["PublicWorkspaceData"], hi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicWorkspaceData\"");
	return mi.includes(e.__typename);
}, gi = ["PublicWorkspaceDataSummary"], _i = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicWorkspaceDataSummary\"");
	return gi.includes(e.__typename);
}, vi = ["NativeModelCapabilities"], yi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isNativeModelCapabilities\"");
	return vi.includes(e.__typename);
}, bi = ["ClientAiModelConfig"], xi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isClientAiModelConfig\"");
	return bi.includes(e.__typename);
}, Si = ["Billing"], Ci = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBilling\"");
	return Si.includes(e.__typename);
}, wi = ["Support"], Ti = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSupport\"");
	return wi.includes(e.__typename);
}, Ei = ["Sentry"], Di = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSentry\"");
	return Ei.includes(e.__typename);
}, Oi = ["Captcha"], ki = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCaptcha\"");
	return Oi.includes(e.__typename);
}, Ai = ["ApiConfig"], ji = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApiConfig\"");
	return Ai.includes(e.__typename);
}, Mi = ["PublicFeatureFlagMetadata"], Ni = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicFeatureFlagMetadata\"");
	return Mi.includes(e.__typename);
}, Pi = ["PublicFeatureFlag"], Fi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicFeatureFlag\"");
	return Pi.includes(e.__typename);
}, Ii = ["ClientConfigMaintenanceMode"], Li = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isClientConfigMaintenanceMode\"");
	return Ii.includes(e.__typename);
}, Ri = ["ClientConfig"], zi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isClientConfig\"");
	return Ri.includes(e.__typename);
}, Bi = ["ClaimableApplicationRegistration"], Vi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isClaimableApplicationRegistration\"");
	return Bi.includes(e.__typename);
}, Hi = ["CreateApplicationRegistration"], Ui = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCreateApplicationRegistration\"");
	return Hi.includes(e.__typename);
}, Wi = ["PublicApplicationRegistration"], Gi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicApplicationRegistration\"");
	return Wi.includes(e.__typename);
}, Ki = ["RotateClientSecret"], qi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRotateClientSecret\"");
	return Ki.includes(e.__typename);
}, Ji = ["AppConnection"], Yi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAppConnection\"");
	return Ji.includes(e.__typename);
}, Xi = ["ResendEmailVerificationToken"], Zi = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isResendEmailVerificationToken\"");
	return Xi.includes(e.__typename);
}, Qi = ["DeleteSso"], $i = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDeleteSso\"");
	return Qi.includes(e.__typename);
}, ea = ["EditSso"], ta = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEditSso\"");
	return ea.includes(e.__typename);
}, na = ["WorkspaceNameAndId"], ra = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceNameAndId\"");
	return na.includes(e.__typename);
}, ia = ["FindAvailableSSOIDP"], aa = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFindAvailableSSOIDP\"");
	return ia.includes(e.__typename);
}, oa = ["SetupSso"], sa = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSetupSso\"");
	return oa.includes(e.__typename);
}, ca = ["SSOConnection"], la = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSSOConnection\"");
	return ca.includes(e.__typename);
}, ua = ["AvailableWorkspace"], da = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAvailableWorkspace\"");
	return ua.includes(e.__typename);
}, fa = ["AvailableWorkspaces"], pa = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAvailableWorkspaces\"");
	return fa.includes(e.__typename);
}, ma = ["DeletedWorkspaceMember"], ha = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDeletedWorkspaceMember\"");
	return ma.includes(e.__typename);
}, ga = ["MarketplaceApp"], _a = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMarketplaceApp\"");
	return ga.includes(e.__typename);
}, va = ["MarketplaceAppRoleObjectPermission"], ya = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMarketplaceAppRoleObjectPermission\"");
	return va.includes(e.__typename);
}, ba = ["MarketplaceAppRoleFieldPermission"], xa = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMarketplaceAppRoleFieldPermission\"");
	return ba.includes(e.__typename);
}, Sa = ["MarketplaceAppRole"], Ca = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMarketplaceAppRole\"");
	return Sa.includes(e.__typename);
}, wa = ["MarketplaceAppDetail"], Ta = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMarketplaceAppDetail\"");
	return wa.includes(e.__typename);
}, Ea = ["WorkspaceCompanyEnrichmentResult"], Da = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceCompanyEnrichmentResult\"");
	return Ea.includes(e.__typename);
}, Oa = ["Field"], ka = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isField\"");
	return Oa.includes(e.__typename);
}, Aa = ["PageInfo"], ja = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPageInfo\"");
	return Aa.includes(e.__typename);
}, Ma = ["FieldEdge"], Na = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFieldEdge\"");
	return Ma.includes(e.__typename);
}, Pa = ["FieldConnection"], Fa = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFieldConnection\"");
	return Pa.includes(e.__typename);
}, Ia = ["Relation"], La = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRelation\"");
	return Ia.includes(e.__typename);
}, Ra = ["IndexField"], za = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isIndexField\"");
	return Ra.includes(e.__typename);
}, Ba = ["Index"], Va = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isIndex\"");
	return Ba.includes(e.__typename);
}, Ha = ["IndexEdge"], Ua = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isIndexEdge\"");
	return Ha.includes(e.__typename);
}, Wa = ["ObjectEdge"], Ga = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectEdge\"");
	return Wa.includes(e.__typename);
}, Ka = ["ObjectConnection"], qa = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectConnection\"");
	return Ka.includes(e.__typename);
}, Ja = ["ObjectFieldsConnection"], Ya = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectFieldsConnection\"");
	return Ja.includes(e.__typename);
}, Xa = ["ObjectIndexMetadatasConnection"], Za = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectIndexMetadatasConnection\"");
	return Xa.includes(e.__typename);
}, Qa = ["ObjectRecordCount"], $a = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isObjectRecordCount\"");
	return Qa.includes(e.__typename);
}, eo = ["SearchField"], to = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSearchField\"");
	return eo.includes(e.__typename);
}, no = ["BillingEntitlement"], ro = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBillingEntitlement\"");
	return no.includes(e.__typename);
}, io = ["DomainRecord"], ao = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDomainRecord\"");
	return io.includes(e.__typename);
}, oo = ["DomainValidRecords"], so = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDomainValidRecords\"");
	return oo.includes(e.__typename);
}, Y = ["UpsertRowLevelPermissionPredicatesResult"], co = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUpsertRowLevelPermissionPredicatesResult\"");
	return Y.includes(e.__typename);
}, lo = ["LogicFunctionLogs"], uo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLogicFunctionLogs\"");
	return lo.includes(e.__typename);
}, fo = ["DeleteTwoFactorAuthenticationMethod"], po = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDeleteTwoFactorAuthenticationMethod\"");
	return fo.includes(e.__typename);
}, mo = ["InitiateTwoFactorAuthenticationProvisioning"], ho = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isInitiateTwoFactorAuthenticationProvisioning\"");
	return mo.includes(e.__typename);
}, go = ["VerifyTwoFactorAuthenticationMethod"], _o = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isVerifyTwoFactorAuthenticationMethod\"");
	return go.includes(e.__typename);
}, vo = ["AuthorizeApp"], yo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAuthorizeApp\"");
	return vo.includes(e.__typename);
}, bo = ["AuthTokenPair"], xo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAuthTokenPair\"");
	return bo.includes(e.__typename);
}, So = ["AvailableWorkspacesAndAccessTokens"], Co = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAvailableWorkspacesAndAccessTokens\"");
	return So.includes(e.__typename);
}, wo = ["EmailPasswordResetLink"], To = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEmailPasswordResetLink\"");
	return wo.includes(e.__typename);
}, Eo = ["GetAuthorizationUrlForSSO"], Do = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isGetAuthorizationUrlForSSO\"");
	return Eo.includes(e.__typename);
}, Oo = ["InvalidatePassword"], ko = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isInvalidatePassword\"");
	return Oo.includes(e.__typename);
}, Ao = ["WorkspaceUrlsAndId"], jo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceUrlsAndId\"");
	return Ao.includes(e.__typename);
}, Mo = ["SignUp"], No = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSignUp\"");
	return Mo.includes(e.__typename);
}, Po = ["TransientToken"], Fo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTransientToken\"");
	return Po.includes(e.__typename);
}, Io = ["ValidatePasswordResetToken"], Lo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isValidatePasswordResetToken\"");
	return Io.includes(e.__typename);
}, Ro = ["VerifyEmailAndGetLoginToken"], zo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isVerifyEmailAndGetLoginToken\"");
	return Ro.includes(e.__typename);
}, Bo = ["SubdomainAvailabilityDTO"], Vo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSubdomainAvailabilityDTO\"");
	return Bo.includes(e.__typename);
}, Ho = ["WorkspaceCreationDefaultsDTO"], Uo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceCreationDefaultsDTO\"");
	return Ho.includes(e.__typename);
}, Wo = ["ApiKeyToken"], Go = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApiKeyToken\"");
	return Wo.includes(e.__typename);
}, Ko = ["AuthTokens"], qo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAuthTokens\"");
	return Ko.includes(e.__typename);
}, Jo = ["LoginToken"], Yo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLoginToken\"");
	return Jo.includes(e.__typename);
}, Xo = ["CheckUserExist"], Zo = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCheckUserExist\"");
	return Xo.includes(e.__typename);
}, Qo = ["WorkspaceInviteHashValid"], $o = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceInviteHashValid\"");
	return Qo.includes(e.__typename);
}, es = ["Impersonate"], ts = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isImpersonate\"");
	return es.includes(e.__typename);
}, ns = ["StopImpersonation"], rs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isStopImpersonation\"");
	return ns.includes(e.__typename);
}, is = ["ApplicationAuthorization"], as = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationAuthorization\"");
	return is.includes(e.__typename);
}, os = ["File"], ss = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isFile\"");
	return os.includes(e.__typename);
}, cs = ["ApplicationFileCompletionError"], ls = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationFileCompletionError\"");
	return cs.includes(e.__typename);
}, us = ["CompleteApplicationFileUploadsResult"], ds = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCompleteApplicationFileUploadsResult\"");
	return us.includes(e.__typename);
}, fs = ["ApplicationFileUploadTarget"], ps = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationFileUploadTarget\"");
	return fs.includes(e.__typename);
}, ms = ["ApplicationFileUploadError"], hs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isApplicationFileUploadError\"");
	return ms.includes(e.__typename);
}, gs = ["CreateApplicationFileUploadsResult"], _s = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCreateApplicationFileUploadsResult\"");
	return gs.includes(e.__typename);
}, vs = ["DevelopmentApplication"], ys = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDevelopmentApplication\"");
	return vs.includes(e.__typename);
}, bs = ["WorkspaceMigration"], xs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceMigration\"");
	return bs.includes(e.__typename);
}, Ss = ["PublicDomain"], Cs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPublicDomain\"");
	return Ss.includes(e.__typename);
}, ws = ["VerificationRecord"], Ts = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isVerificationRecord\"");
	return ws.includes(e.__typename);
}, Es = ["EmailingDomain"], Ds = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEmailingDomain\"");
	return Es.includes(e.__typename);
}, Os = ["MessageChannel"], ks = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMessageChannel\"");
	return Os.includes(e.__typename);
}, As = ["CreateEmailGroupChannelOutput"], js = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCreateEmailGroupChannelOutput\"");
	return As.includes(e.__typename);
}, Ms = ["CampaignAudiencePreviewDTO"], Ns = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCampaignAudiencePreviewDTO\"");
	return Ms.includes(e.__typename);
}, Ps = ["CancelMessageCampaignOutputDTO"], Fs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCancelMessageCampaignOutputDTO\"");
	return Ps.includes(e.__typename);
}, Is = ["SendEmailViaDomainOutput"], Ls = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSendEmailViaDomainOutput\"");
	return Is.includes(e.__typename);
}, Rs = ["SendMessageCampaignOutputDTO"], zs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSendMessageCampaignOutputDTO\"");
	return Rs.includes(e.__typename);
}, Bs = ["MessageSuppression"], Vs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMessageSuppression\"");
	return Bs.includes(e.__typename);
}, Hs = ["MessageSuppressionList"], Us = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMessageSuppressionList\"");
	return Hs.includes(e.__typename);
}, Ws = ["UnsubscribeTopic"], Gs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isUnsubscribeTopic\"");
	return Ws.includes(e.__typename);
}, Ks = ["AutocompleteResult"], qs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAutocompleteResult\"");
	return Ks.includes(e.__typename);
}, Js = ["Location"], Ys = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLocation\"");
	return Js.includes(e.__typename);
}, Xs = ["PlaceDetailsResult"], Zs = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPlaceDetailsResult\"");
	return Xs.includes(e.__typename);
}, Qs = ["ImapSmtpCaldavPublicConnectionParams"], $s = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isImapSmtpCaldavPublicConnectionParams\"");
	return Qs.includes(e.__typename);
}, ec = ["ImapSmtpCaldavPublicConnectionParameters"], tc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isImapSmtpCaldavPublicConnectionParameters\"");
	return ec.includes(e.__typename);
}, nc = ["ConnectedImapSmtpCaldavAccount"], rc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isConnectedImapSmtpCaldavAccount\"");
	return nc.includes(e.__typename);
}, ic = ["ImapSmtpCaldavConnectionSuccess"], ac = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isImapSmtpCaldavConnectionSuccess\"");
	return ic.includes(e.__typename);
}, oc = ["Webhook"], sc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWebhook\"");
	return oc.includes(e.__typename);
}, cc = ["ToolIndexEntry"], lc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isToolIndexEntry\"");
	return cc.includes(e.__typename);
}, uc = ["AgentMessagePart"], dc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgentMessagePart\"");
	return uc.includes(e.__typename);
}, fc = ["RunAgentResult"], pc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isRunAgentResult\"");
	return fc.includes(e.__typename);
}, mc = ["ChannelSyncSuccess"], hc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isChannelSyncSuccess\"");
	return mc.includes(e.__typename);
}, gc = ["CreateCalendarEventOutput"], _c = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCreateCalendarEventOutput\"");
	return gc.includes(e.__typename);
}, vc = ["BarChartSeries"], yc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBarChartSeries\"");
	return vc.includes(e.__typename);
}, bc = ["BarChartData"], xc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isBarChartData\"");
	return bc.includes(e.__typename);
}, Sc = ["LineChartDataPoint"], Cc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLineChartDataPoint\"");
	return Sc.includes(e.__typename);
}, wc = ["LineChartSeries"], Tc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLineChartSeries\"");
	return wc.includes(e.__typename);
}, Ec = ["LineChartData"], Dc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isLineChartData\"");
	return Ec.includes(e.__typename);
}, Oc = ["PieChartDataItem"], kc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPieChartDataItem\"");
	return Oc.includes(e.__typename);
}, Ac = ["PieChartData"], jc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isPieChartData\"");
	return Ac.includes(e.__typename);
}, Mc = ["DuplicatedDashboard"], Nc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isDuplicatedDashboard\"");
	return Mc.includes(e.__typename);
}, Pc = ["SendEmailOutput"], Fc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSendEmailOutput\"");
	return Pc.includes(e.__typename);
}, Ic = ["Analytics"], Lc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAnalytics\"");
	return Ic.includes(e.__typename);
}, Rc = ["EventLogRecord"], zc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEventLogRecord\"");
	return Rc.includes(e.__typename);
}, Bc = ["EventLogPageInfo"], Vc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEventLogPageInfo\"");
	return Bc.includes(e.__typename);
}, Hc = ["EventLogQueryResult"], Uc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEventLogQueryResult\"");
	return Hc.includes(e.__typename);
}, Wc = ["Skill"], Gc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSkill\"");
	return Wc.includes(e.__typename);
}, Kc = ["AgentMessage"], qc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgentMessage\"");
	return Kc.includes(e.__typename);
}, Jc = ["AgentChatThread"], Yc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgentChatThread\"");
	return Jc.includes(e.__typename);
}, Xc = ["AiSystemPromptSection"], Zc = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAiSystemPromptSection\"");
	return Xc.includes(e.__typename);
}, Qc = ["AiSystemPromptPreview"], $c = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAiSystemPromptPreview\"");
	return Qc.includes(e.__typename);
}, el = ["ChatStreamError"], tl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isChatStreamError\"");
	return el.includes(e.__typename);
}, nl = ["ChatStreamCatchupChunks"], rl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isChatStreamCatchupChunks\"");
	return nl.includes(e.__typename);
}, il = ["SendChatMessageResult"], al = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSendChatMessageResult\"");
	return il.includes(e.__typename);
}, ol = ["AgentChatEvent"], sl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgentChatEvent\"");
	return ol.includes(e.__typename);
}, cl = ["StartWorkspaceSetupChatResult"], ll = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isStartWorkspaceSetupChatResult\"");
	return cl.includes(e.__typename);
}, ul = ["AgentTurnEvaluation"], dl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgentTurnEvaluation\"");
	return ul.includes(e.__typename);
}, fl = ["AgentTurn"], pl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAgentTurn\"");
	return fl.includes(e.__typename);
}, ml = ["WorkspaceAiStats"], hl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isWorkspaceAiStats\"");
	return ml.includes(e.__typename);
}, gl = ["EnqueueJobResult"], _l = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEnqueueJobResult\"");
	return gl.includes(e.__typename);
}, vl = ["EnqueueJobsResult"], yl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isEnqueueJobsResult\"");
	return vl.includes(e.__typename);
}, bl = ["AppKeyValue"], xl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isAppKeyValue\"");
	return bl.includes(e.__typename);
}, Sl = ["CalendarChannel"], Cl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCalendarChannel\"");
	return Sl.includes(e.__typename);
}, wl = ["MessageFolder"], Tl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMessageFolder\"");
	return wl.includes(e.__typename);
}, El = ["MetadataTranslation"], Dl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMetadataTranslation\"");
	return El.includes(e.__typename);
}, Ol = ["TimelineActivityTypeEmitThrough"], kl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTimelineActivityTypeEmitThrough\"");
	return Ol.includes(e.__typename);
}, Al = ["TimelineActivityTypeEmit"], jl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTimelineActivityTypeEmit\"");
	return Al.includes(e.__typename);
}, Ml = ["TimelineActivityType"], Nl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isTimelineActivityType\"");
	return Ml.includes(e.__typename);
}, Pl = ["CollectionHash"], Fl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isCollectionHash\"");
	return Pl.includes(e.__typename);
}, Il = ["MinimalObjectMetadata"], Ll = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMinimalObjectMetadata\"");
	return Il.includes(e.__typename);
}, Rl = ["MinimalView"], zl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMinimalView\"");
	return Rl.includes(e.__typename);
}, Bl = ["MinimalMetadata"], Vl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMinimalMetadata\"");
	return Bl.includes(e.__typename);
}, Hl = ["Query"], Ul = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isQuery\"");
	return Hl.includes(e.__typename);
}, Wl = ["Mutation"], Gl = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isMutation\"");
	return Wl.includes(e.__typename);
}, Kl = ["Subscription"], ql = (e) => {
	if (!e?.__typename) throw Error("__typename is missing in \"isSubscription\"");
	return Kl.includes(e.__typename);
}, Jl = {
	NPM: "NPM",
	TARBALL: "TARBALL",
	LOCAL: "LOCAL",
	OAUTH_ONLY: "OAUTH_ONLY"
}, Yl = {
	NAVIGATE_TO_NEXT_RECORD: "NAVIGATE_TO_NEXT_RECORD",
	NAVIGATE_TO_PREVIOUS_RECORD: "NAVIGATE_TO_PREVIOUS_RECORD",
	CREATE_NEW_RECORD: "CREATE_NEW_RECORD",
	DELETE_RECORDS: "DELETE_RECORDS",
	RESTORE_RECORDS: "RESTORE_RECORDS",
	DESTROY_RECORDS: "DESTROY_RECORDS",
	ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
	REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",
	EXPORT_NOTE_TO_PDF: "EXPORT_NOTE_TO_PDF",
	EXPORT_RECORDS: "EXPORT_RECORDS",
	UPDATE_MULTIPLE_RECORDS: "UPDATE_MULTIPLE_RECORDS",
	MERGE_MULTIPLE_RECORDS: "MERGE_MULTIPLE_RECORDS",
	IMPORT_RECORDS: "IMPORT_RECORDS",
	EXPORT_VIEW: "EXPORT_VIEW",
	SEE_DELETED_RECORDS: "SEE_DELETED_RECORDS",
	CREATE_NEW_VIEW: "CREATE_NEW_VIEW",
	HIDE_DELETED_RECORDS: "HIDE_DELETED_RECORDS",
	EDIT_RECORD_PAGE_LAYOUT: "EDIT_RECORD_PAGE_LAYOUT",
	EDIT_DASHBOARD_LAYOUT: "EDIT_DASHBOARD_LAYOUT",
	SAVE_DASHBOARD_LAYOUT: "SAVE_DASHBOARD_LAYOUT",
	CANCEL_DASHBOARD_LAYOUT: "CANCEL_DASHBOARD_LAYOUT",
	DUPLICATE_DASHBOARD: "DUPLICATE_DASHBOARD",
	ACTIVATE_WORKFLOW: "ACTIVATE_WORKFLOW",
	DEACTIVATE_WORKFLOW: "DEACTIVATE_WORKFLOW",
	DISCARD_DRAFT_WORKFLOW: "DISCARD_DRAFT_WORKFLOW",
	TEST_WORKFLOW: "TEST_WORKFLOW",
	SEE_ACTIVE_VERSION_WORKFLOW: "SEE_ACTIVE_VERSION_WORKFLOW",
	SEE_RUNS_WORKFLOW: "SEE_RUNS_WORKFLOW",
	SEE_VERSIONS_WORKFLOW: "SEE_VERSIONS_WORKFLOW",
	ADD_NODE_WORKFLOW: "ADD_NODE_WORKFLOW",
	TIDY_UP_WORKFLOW: "TIDY_UP_WORKFLOW",
	DUPLICATE_WORKFLOW: "DUPLICATE_WORKFLOW",
	SEE_VERSION_WORKFLOW_RUN: "SEE_VERSION_WORKFLOW_RUN",
	SEE_WORKFLOW_WORKFLOW_RUN: "SEE_WORKFLOW_WORKFLOW_RUN",
	STOP_WORKFLOW_RUN: "STOP_WORKFLOW_RUN",
	RETRY_WORKFLOW_RUN: "RETRY_WORKFLOW_RUN",
	SEE_RUNS_WORKFLOW_VERSION: "SEE_RUNS_WORKFLOW_VERSION",
	SEE_WORKFLOW_WORKFLOW_VERSION: "SEE_WORKFLOW_WORKFLOW_VERSION",
	USE_AS_DRAFT_WORKFLOW_VERSION: "USE_AS_DRAFT_WORKFLOW_VERSION",
	SEE_VERSIONS_WORKFLOW_VERSION: "SEE_VERSIONS_WORKFLOW_VERSION",
	SEARCH_RECORDS: "SEARCH_RECORDS",
	SEARCH_RECORDS_FALLBACK: "SEARCH_RECORDS_FALLBACK",
	ASK_AI: "ASK_AI",
	VIEW_PREVIOUS_AI_CHATS: "VIEW_PREVIOUS_AI_CHATS",
	NAVIGATION: "NAVIGATION",
	TRIGGER_WORKFLOW_VERSION: "TRIGGER_WORKFLOW_VERSION",
	FRONT_COMPONENT_RENDERER: "FRONT_COMPONENT_RENDERER",
	REPLY_TO_EMAIL_THREAD: "REPLY_TO_EMAIL_THREAD",
	COMPOSE_EMAIL: "COMPOSE_EMAIL",
	COMPOSE_CAMPAIGN: "COMPOSE_CAMPAIGN",
	SEND_MESSAGE_CAMPAIGN: "SEND_MESSAGE_CAMPAIGN",
	SEND_MESSAGE_CAMPAIGN_TEST: "SEND_MESSAGE_CAMPAIGN_TEST",
	EMAIL_BLOCK_SETTINGS: "EMAIL_BLOCK_SETTINGS",
	GO_TO_PEOPLE: "GO_TO_PEOPLE",
	GO_TO_COMPANIES: "GO_TO_COMPANIES",
	GO_TO_DASHBOARDS: "GO_TO_DASHBOARDS",
	GO_TO_OPPORTUNITIES: "GO_TO_OPPORTUNITIES",
	GO_TO_SETTINGS: "GO_TO_SETTINGS",
	GO_TO_TASKS: "GO_TO_TASKS",
	GO_TO_NOTES: "GO_TO_NOTES",
	GO_TO_WORKFLOWS: "GO_TO_WORKFLOWS",
	GO_TO_RUNS: "GO_TO_RUNS",
	DELETE_SINGLE_RECORD: "DELETE_SINGLE_RECORD",
	DELETE_MULTIPLE_RECORDS: "DELETE_MULTIPLE_RECORDS",
	RESTORE_SINGLE_RECORD: "RESTORE_SINGLE_RECORD",
	RESTORE_MULTIPLE_RECORDS: "RESTORE_MULTIPLE_RECORDS",
	DESTROY_SINGLE_RECORD: "DESTROY_SINGLE_RECORD",
	DESTROY_MULTIPLE_RECORDS: "DESTROY_MULTIPLE_RECORDS",
	EXPORT_FROM_RECORD_INDEX: "EXPORT_FROM_RECORD_INDEX",
	EXPORT_FROM_RECORD_SHOW: "EXPORT_FROM_RECORD_SHOW",
	EXPORT_MULTIPLE_RECORDS: "EXPORT_MULTIPLE_RECORDS"
}, Xl = {
	GLOBAL: "GLOBAL",
	GLOBAL_OBJECT_CONTEXT: "GLOBAL_OBJECT_CONTEXT",
	RECORD_SELECTION: "RECORD_SELECTION",
	FALLBACK: "FALLBACK"
}, Zl = {
	LIVE: "LIVE",
	PREBUILT: "PREBUILT"
}, Ql = {
	SIDE_PANEL: "SIDE_PANEL",
	RECORD_PAGE: "RECORD_PAGE",
	USER_CHOICE: "USER_CHOICE"
}, $l = {
	SIDE_PANEL: "SIDE_PANEL",
	RECORD_PAGE: "RECORD_PAGE"
}, eu = {
	SYSTEM: "SYSTEM",
	MONTH_FIRST: "MONTH_FIRST",
	DAY_FIRST: "DAY_FIRST",
	YEAR_FIRST: "YEAR_FIRST"
}, tu = {
	SYSTEM: "SYSTEM",
	HOUR_12: "HOUR_12",
	HOUR_24: "HOUR_24"
}, nu = {
	SYSTEM: "SYSTEM",
	COMMAS_AND_DOT: "COMMAS_AND_DOT",
	SPACES_AND_COMMA: "SPACES_AND_COMMA",
	DOTS_AND_COMMA: "DOTS_AND_COMMA",
	APOSTROPHE_AND_DOT: "APOSTROPHE_AND_DOT"
}, ru = {
	AND: "AND",
	OR: "OR"
}, iu = {
	IS: "IS",
	IS_NOT_NULL: "IS_NOT_NULL",
	IS_NOT: "IS_NOT",
	LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
	GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
	IS_BEFORE: "IS_BEFORE",
	IS_AFTER: "IS_AFTER",
	CONTAINS: "CONTAINS",
	DOES_NOT_CONTAIN: "DOES_NOT_CONTAIN",
	IS_EMPTY: "IS_EMPTY",
	IS_NOT_EMPTY: "IS_NOT_EMPTY",
	IS_RELATIVE: "IS_RELATIVE",
	IS_IN_PAST: "IS_IN_PAST",
	IS_IN_FUTURE: "IS_IN_FUTURE",
	IS_TODAY: "IS_TODAY",
	VECTOR_SEARCH: "VECTOR_SEARCH"
}, au = {
	INSTALLING: "INSTALLING",
	INSTALLED: "INSTALLED",
	UPGRADING: "UPGRADING",
	UNINSTALLING: "UNINSTALLING"
}, ou = {
	API_KEYS_AND_WEBHOOKS: "API_KEYS_AND_WEBHOOKS",
	WORKSPACE: "WORKSPACE",
	WORKSPACE_MEMBERS: "WORKSPACE_MEMBERS",
	ROLES: "ROLES",
	DATA_MODEL: "DATA_MODEL",
	SECURITY: "SECURITY",
	WORKFLOWS: "WORKFLOWS",
	IMPERSONATE: "IMPERSONATE",
	SSO_BYPASS: "SSO_BYPASS",
	APPLICATIONS: "APPLICATIONS",
	MARKETPLACE_APPS: "MARKETPLACE_APPS",
	LAYOUTS: "LAYOUTS",
	BILLING: "BILLING",
	AI_SETTINGS: "AI_SETTINGS",
	AI: "AI",
	VIEWS: "VIEWS",
	UPLOAD_FILE: "UPLOAD_FILE",
	DOWNLOAD_FILE: "DOWNLOAD_FILE",
	SEND_EMAIL_TOOL: "SEND_EMAIL_TOOL",
	CREATE_CALENDAR_EVENT_TOOL: "CREATE_CALENDAR_EVENT_TOOL",
	HTTP_REQUEST_TOOL: "HTTP_REQUEST_TOOL",
	CODE_INTERPRETER_TOOL: "CODE_INTERPRETER_TOOL",
	IMPORT_CSV: "IMPORT_CSV",
	EXPORT_CSV: "EXPORT_CSV",
	CONNECTED_ACCOUNTS: "CONNECTED_ACCOUNTS",
	PROFILE_INFORMATION: "PROFILE_INFORMATION"
}, su = {
	MIN: "MIN",
	MAX: "MAX",
	AVG: "AVG",
	SUM: "SUM",
	COUNT: "COUNT",
	COUNT_UNIQUE_VALUES: "COUNT_UNIQUE_VALUES",
	COUNT_EMPTY: "COUNT_EMPTY",
	COUNT_NOT_EMPTY: "COUNT_NOT_EMPTY",
	COUNT_TRUE: "COUNT_TRUE",
	COUNT_FALSE: "COUNT_FALSE",
	PERCENTAGE_EMPTY: "PERCENTAGE_EMPTY",
	PERCENTAGE_NOT_EMPTY: "PERCENTAGE_NOT_EMPTY"
}, cu = {
	AND: "AND",
	OR: "OR",
	NOT: "NOT"
}, lu = {
	IS: "IS",
	IS_NOT_NULL: "IS_NOT_NULL",
	IS_NOT: "IS_NOT",
	LESS_THAN_OR_EQUAL: "LESS_THAN_OR_EQUAL",
	GREATER_THAN_OR_EQUAL: "GREATER_THAN_OR_EQUAL",
	IS_BEFORE: "IS_BEFORE",
	IS_AFTER: "IS_AFTER",
	CONTAINS: "CONTAINS",
	DOES_NOT_CONTAIN: "DOES_NOT_CONTAIN",
	IS_EMPTY: "IS_EMPTY",
	IS_NOT_EMPTY: "IS_NOT_EMPTY",
	IS_RELATIVE: "IS_RELATIVE",
	IS_IN_PAST: "IS_IN_PAST",
	IS_IN_FUTURE: "IS_IN_FUTURE",
	IS_TODAY: "IS_TODAY",
	VECTOR_SEARCH: "VECTOR_SEARCH"
}, uu = {
	ASC: "ASC",
	DESC: "DESC"
}, du = {
	TABLE: "TABLE",
	KANBAN: "KANBAN",
	CALENDAR: "CALENDAR",
	LIST: "LIST",
	FIELDS_WIDGET: "FIELDS_WIDGET",
	TABLE_WIDGET: "TABLE_WIDGET",
	KANBAN_WIDGET: "KANBAN_WIDGET",
	LIST_WIDGET: "LIST_WIDGET",
	CALENDAR_WIDGET: "CALENDAR_WIDGET"
}, fu = { INDEX: "INDEX" }, pu = {
	SIDE_PANEL: "SIDE_PANEL",
	RECORD_PAGE: "RECORD_PAGE"
}, mu = {
	DAY: "DAY",
	WEEK: "WEEK",
	MONTH: "MONTH"
}, hu = {
	WORKSPACE: "WORKSPACE",
	UNLISTED: "UNLISTED"
}, gu = {
	PUBLIC: "PUBLIC",
	MEMBERS_AND_INVITEES: "MEMBERS_AND_INVITEES",
	HIDDEN: "HIDDEN"
}, _u = {
	ONGOING_CREATION: "ONGOING_CREATION",
	PENDING_CREATION: "PENDING_CREATION",
	CREATED: "CREATED",
	ACTIVE: "ACTIVE",
	INACTIVE: "INACTIVE",
	SUSPENDED: "SUSPENDED"
}, vu = {
	PLAN_REQUIRED: "PLAN_REQUIRED",
	WORKSPACE_ACTIVATION: "WORKSPACE_ACTIVATION",
	PROFILE_CREATION: "PROFILE_CREATION",
	SYNC_EMAIL: "SYNC_EMAIL",
	APPS_INSTALLATION: "APPS_INSTALLATION",
	INVITE_TEAM: "INVITE_TEAM",
	BOOK_CALL: "BOOK_CALL",
	COMPLETED: "COMPLETED"
}, yu = {
	AI: "AI",
	WORKFLOW: "WORKFLOW",
	APP: "APP",
	STORAGE: "STORAGE",
	API: "API",
	LOGIC_FUNCTION: "LOGIC_FUNCTION",
	EMAIL: "EMAIL"
}, bu = {
	AI_CHAT_TOKEN: "AI_CHAT_TOKEN",
	AI_WORKFLOW_TOKEN: "AI_WORKFLOW_TOKEN",
	WORKFLOW_EXECUTION: "WORKFLOW_EXECUTION",
	CODE_EXECUTION: "CODE_EXECUTION",
	WEB_SEARCH: "WEB_SEARCH",
	CALL_RECORDING: "CALL_RECORDING",
	EMAIL_SEND: "EMAIL_SEND",
	API_REQUEST: "API_REQUEST"
}, xu = {
	VIEW: "VIEW",
	IFRAME: "IFRAME",
	FIELD: "FIELD",
	FIELDS: "FIELDS",
	GRAPH: "GRAPH",
	STANDALONE_RICH_TEXT: "STANDALONE_RICH_TEXT",
	TIMELINE: "TIMELINE",
	TASKS: "TASKS",
	NOTES: "NOTES",
	FILES: "FILES",
	EMAILS: "EMAILS",
	CALENDAR: "CALENDAR",
	FIELD_RICH_TEXT: "FIELD_RICH_TEXT",
	WORKFLOW: "WORKFLOW",
	WORKFLOW_VERSION: "WORKFLOW_VERSION",
	WORKFLOW_RUN: "WORKFLOW_RUN",
	FRONT_COMPONENT: "FRONT_COMPONENT",
	RECORD_TABLE: "RECORD_TABLE",
	EMAIL_THREAD: "EMAIL_THREAD",
	CALL_RECORDING_SUMMARY: "CALL_RECORDING_SUMMARY",
	CALL_RECORDING_TRANSCRIPT: "CALL_RECORDING_TRANSCRIPT",
	MESSAGE_CAMPAIGN_BODY: "MESSAGE_CAMPAIGN_BODY",
	MESSAGE_CAMPAIGN_DETAILS: "MESSAGE_CAMPAIGN_DETAILS",
	FORM_FIELD: "FORM_FIELD"
}, Su = {
	GRID: "GRID",
	VERTICAL_LIST: "VERTICAL_LIST",
	CANVAS: "CANVAS"
}, Cu = {
	AGGREGATE_CHART: "AGGREGATE_CHART",
	PIE_CHART: "PIE_CHART",
	BAR_CHART: "BAR_CHART",
	LINE_CHART: "LINE_CHART",
	IFRAME: "IFRAME",
	STANDALONE_RICH_TEXT: "STANDALONE_RICH_TEXT",
	VIEW: "VIEW",
	FIELD: "FIELD",
	FIELDS: "FIELDS",
	TIMELINE: "TIMELINE",
	TASKS: "TASKS",
	NOTES: "NOTES",
	FILES: "FILES",
	EMAILS: "EMAILS",
	CALENDAR: "CALENDAR",
	FIELD_RICH_TEXT: "FIELD_RICH_TEXT",
	WORKFLOW: "WORKFLOW",
	WORKFLOW_VERSION: "WORKFLOW_VERSION",
	WORKFLOW_RUN: "WORKFLOW_RUN",
	FRONT_COMPONENT: "FRONT_COMPONENT",
	RECORD_TABLE: "RECORD_TABLE",
	EMAIL_THREAD: "EMAIL_THREAD",
	CALL_RECORDING_SUMMARY: "CALL_RECORDING_SUMMARY",
	CALL_RECORDING_TRANSCRIPT: "CALL_RECORDING_TRANSCRIPT",
	MESSAGE_CAMPAIGN_BODY: "MESSAGE_CAMPAIGN_BODY",
	MESSAGE_CAMPAIGN_DETAILS: "MESSAGE_CAMPAIGN_DETAILS",
	FORM_FIELD: "FORM_FIELD"
}, wu = {
	SHORT: "SHORT",
	FULL: "FULL"
}, Tu = {
	DAY: "DAY",
	MONTH: "MONTH",
	QUARTER: "QUARTER",
	YEAR: "YEAR",
	WEEK: "WEEK",
	DAY_OF_THE_WEEK: "DAY_OF_THE_WEEK",
	MONTH_OF_THE_YEAR: "MONTH_OF_THE_YEAR",
	QUARTER_OF_THE_YEAR: "QUARTER_OF_THE_YEAR",
	NONE: "NONE"
}, Eu = {
	FIELD_ASC: "FIELD_ASC",
	FIELD_DESC: "FIELD_DESC",
	FIELD_POSITION_ASC: "FIELD_POSITION_ASC",
	FIELD_POSITION_DESC: "FIELD_POSITION_DESC",
	VALUE_ASC: "VALUE_ASC",
	VALUE_DESC: "VALUE_DESC",
	MANUAL: "MANUAL"
}, Du = {
	NONE: "NONE",
	X: "X",
	Y: "Y",
	BOTH: "BOTH"
}, Ou = {
	STACKED: "STACKED",
	GROUPED: "GROUPED"
}, ku = {
	VERTICAL: "VERTICAL",
	HORIZONTAL: "HORIZONTAL"
}, Au = {
	CARD: "CARD",
	EDITOR: "EDITOR",
	FIELD: "FIELD",
	VIEW: "VIEW",
	TABLE: "TABLE"
}, ju = {
	RECORD_INDEX: "RECORD_INDEX",
	RECORD_PAGE: "RECORD_PAGE",
	DASHBOARD: "DASHBOARD",
	STANDALONE_PAGE: "STANDALONE_PAGE",
	RECORD_FORM: "RECORD_FORM"
}, Mu = {
	PRO: "PRO",
	ENTERPRISE: "ENTERPRISE"
}, Nu = {
	METERED: "METERED",
	LICENSED: "LICENSED"
}, Pu = {
	BASE_PRODUCT: "BASE_PRODUCT",
	RESOURCE_CREDIT: "RESOURCE_CREDIT"
}, Fu = {
	Month: "Month",
	Year: "Year"
}, Iu = {
	Active: "Active",
	Canceled: "Canceled",
	Incomplete: "Incomplete",
	IncompleteExpired: "IncompleteExpired",
	PastDue: "PastDue",
	Paused: "Paused",
	Trialing: "Trialing",
	Unpaid: "Unpaid"
}, Lu = {
	IDLE: "IDLE",
	SUCCESS: "SUCCESS",
	ERROR: "ERROR"
}, Ru = {
	VIEW: "VIEW",
	FOLDER: "FOLDER",
	LINK: "LINK",
	OBJECT: "OBJECT",
	RECORD: "RECORD",
	PAGE_LAYOUT: "PAGE_LAYOUT"
}, zu = {
	CREATED: "CREATED",
	UPDATED: "UPDATED",
	DELETED: "DELETED"
}, Bu = {
	CREATED: "CREATED",
	UPDATED: "UPDATED",
	DELETED: "DELETED",
	DESTROYED: "DESTROYED",
	RESTORED: "RESTORED",
	UPSERTED: "UPSERTED"
}, Vu = {
	NONE: "NONE",
	STARTTLS: "STARTTLS",
	SSL_TLS: "SSL_TLS"
}, Hu = {
	IS_APP_CLAIMING_ENABLED: "IS_APP_CLAIMING_ENABLED",
	IS_UNIQUE_INDEXES_ENABLED: "IS_UNIQUE_INDEXES_ENABLED",
	IS_JSON_FILTER_ENABLED: "IS_JSON_FILTER_ENABLED",
	IS_EMAIL_GROUP_ENABLED: "IS_EMAIL_GROUP_ENABLED",
	IS_JUNCTION_RELATIONS_ENABLED: "IS_JUNCTION_RELATIONS_ENABLED",
	IS_REST_METADATA_API_NEW_FORMAT_DIRECT: "IS_REST_METADATA_API_NEW_FORMAT_DIRECT",
	IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED: "IS_LOGIC_FUNCTION_PREBUILT_MODE_ENABLED",
	IS_WORKFLOW_VERSION_IN_CORE_ENABLED: "IS_WORKFLOW_VERSION_IN_CORE_ENABLED",
	IS_WORKFLOW_CORE_INDEX_PAGE_ENABLED: "IS_WORKFLOW_CORE_INDEX_PAGE_ENABLED",
	IS_WORKFLOW_DISPATCH_FROM_CORE_ENABLED: "IS_WORKFLOW_DISPATCH_FROM_CORE_ENABLED",
	IS_API_RATE_LIMIT_V2_ENABLED: "IS_API_RATE_LIMIT_V2_ENABLED",
	IS_MESSAGE_CALENDAR_TARGET_READ_ENABLED: "IS_MESSAGE_CALENDAR_TARGET_READ_ENABLED"
}, Uu = {
	OIDC: "OIDC",
	SAML: "SAML"
}, Wu = {
	Active: "Active",
	Inactive: "Inactive",
	Error: "Error"
}, Gu = {
	GPT: "GPT",
	CLAUDE: "CLAUDE",
	GEMINI: "GEMINI",
	MISTRAL: "MISTRAL",
	GROK: "GROK"
}, Ku = {
	NONE: "NONE",
	FRONT: "FRONT"
}, qu = {
	GOOGLE_RECAPTCHA: "GOOGLE_RECAPTCHA",
	TURNSTILE: "TURNSTILE"
}, Ju = {
	matched: "matched",
	unavailable: "unavailable",
	transientError: "transientError"
}, Yu = {
	matched: "matched",
	unavailable: "unavailable",
	transientError: "transientError"
}, Xu = {
	ACTOR: "ACTOR",
	ADDRESS: "ADDRESS",
	ARRAY: "ARRAY",
	BOOLEAN: "BOOLEAN",
	CURRENCY: "CURRENCY",
	DATE: "DATE",
	DATE_TIME: "DATE_TIME",
	EMAILS: "EMAILS",
	FILES: "FILES",
	FULL_NAME: "FULL_NAME",
	LINKS: "LINKS",
	MORPH_RELATION: "MORPH_RELATION",
	MULTI_SELECT: "MULTI_SELECT",
	NUMBER: "NUMBER",
	NUMERIC: "NUMERIC",
	PHONES: "PHONES",
	POSITION: "POSITION",
	RATING: "RATING",
	RAW_JSON: "RAW_JSON",
	RELATION: "RELATION",
	RICH_TEXT: "RICH_TEXT",
	SELECT: "SELECT",
	TEXT: "TEXT",
	TS_VECTOR: "TS_VECTOR",
	UUID: "UUID"
}, Zu = {
	ONE_TO_MANY: "ONE_TO_MANY",
	MANY_TO_ONE: "MANY_TO_ONE"
}, Qu = {
	BTREE: "BTREE",
	GIN: "GIN"
}, $u = {
	SSO: "SSO",
	CUSTOM_DOMAIN: "CUSTOM_DOMAIN",
	RLS: "RLS",
	AUDIT_LOGS: "AUDIT_LOGS"
}, ed = {
	CorePicture: "CorePicture",
	AgentChat: "AgentChat",
	BuiltLogicFunction: "BuiltLogicFunction",
	BuiltFrontComponent: "BuiltFrontComponent",
	PublicAsset: "PublicAsset",
	Source: "Source",
	FilesField: "FilesField",
	Dependencies: "Dependencies",
	Workflow: "Workflow",
	EmailAttachment: "EmailAttachment",
	EmailImage: "EmailImage",
	AppTarball: "AppTarball",
	GeneratedSdkClient: "GeneratedSdkClient",
	Dpa: "Dpa"
}, td = {
	PENDING: "PENDING",
	VERIFIED: "VERIFIED",
	FAILED: "FAILED",
	TEMPORARY_FAILURE: "TEMPORARY_FAILURE"
}, nd = {
	ACTIVE: "ACTIVE",
	PAUSED: "PAUSED",
	SANDBOX: "SANDBOX"
}, rd = {
	PENDING: "PENDING",
	ACTIVE: "ACTIVE",
	FAILED: "FAILED"
}, id = {
	METADATA: "METADATA",
	SUBJECT: "SUBJECT",
	SHARE_EVERYTHING: "SHARE_EVERYTHING"
}, ad = {
	EMAIL: "EMAIL",
	SMS: "SMS",
	EMAIL_GROUP: "EMAIL_GROUP"
}, od = {
	SENT_AND_RECEIVED: "SENT_AND_RECEIVED",
	SENT: "SENT",
	NONE: "NONE"
}, sd = {
	ALL_FOLDERS: "ALL_FOLDERS",
	SELECTED_FOLDERS: "SELECTED_FOLDERS"
}, cd = {
	GROUP_EMAILS_DELETION: "GROUP_EMAILS_DELETION",
	GROUP_EMAILS_IMPORT: "GROUP_EMAILS_IMPORT",
	NONE: "NONE"
}, ld = {
	NOT_SYNCED: "NOT_SYNCED",
	ONGOING: "ONGOING",
	ACTIVE: "ACTIVE",
	FAILED_INSUFFICIENT_PERMISSIONS: "FAILED_INSUFFICIENT_PERMISSIONS",
	FAILED_UNKNOWN: "FAILED_UNKNOWN"
}, ud = {
	PENDING_CONFIGURATION: "PENDING_CONFIGURATION",
	MESSAGE_LIST_FETCH_PENDING: "MESSAGE_LIST_FETCH_PENDING",
	MESSAGE_LIST_FETCH_SCHEDULED: "MESSAGE_LIST_FETCH_SCHEDULED",
	MESSAGE_LIST_FETCH_ONGOING: "MESSAGE_LIST_FETCH_ONGOING",
	MESSAGES_IMPORT_PENDING: "MESSAGES_IMPORT_PENDING",
	MESSAGES_IMPORT_SCHEDULED: "MESSAGES_IMPORT_SCHEDULED",
	MESSAGES_IMPORT_ONGOING: "MESSAGES_IMPORT_ONGOING",
	FAILED: "FAILED"
}, dd = {
	BOUNCE: "BOUNCE",
	COMPLAINT: "COMPLAINT",
	UNSUBSCRIBE: "UNSUBSCRIBE"
}, fd = {
	WEBHOOK: "WEBHOOK",
	SYSTEM: "SYSTEM"
}, pd = {
	PUBLIC: "PUBLIC",
	PRIVATE: "PRIVATE"
}, md = {
	STARTED: "STARTED",
	ALREADY_STARTED: "ALREADY_STARTED",
	UNAVAILABLE: "UNAVAILABLE"
}, hd = {
	WORKSPACE: "WORKSPACE",
	SERVER: "SERVER"
}, gd = {
	NOT_SYNCED: "NOT_SYNCED",
	ONGOING: "ONGOING",
	ACTIVE: "ACTIVE",
	FAILED_INSUFFICIENT_PERMISSIONS: "FAILED_INSUFFICIENT_PERMISSIONS",
	FAILED_UNKNOWN: "FAILED_UNKNOWN"
}, _d = {
	PENDING_CONFIGURATION: "PENDING_CONFIGURATION",
	CALENDAR_EVENT_LIST_FETCH_PENDING: "CALENDAR_EVENT_LIST_FETCH_PENDING",
	CALENDAR_EVENT_LIST_FETCH_SCHEDULED: "CALENDAR_EVENT_LIST_FETCH_SCHEDULED",
	CALENDAR_EVENT_LIST_FETCH_ONGOING: "CALENDAR_EVENT_LIST_FETCH_ONGOING",
	CALENDAR_EVENTS_IMPORT_PENDING: "CALENDAR_EVENTS_IMPORT_PENDING",
	CALENDAR_EVENTS_IMPORT_SCHEDULED: "CALENDAR_EVENTS_IMPORT_SCHEDULED",
	CALENDAR_EVENTS_IMPORT_ONGOING: "CALENDAR_EVENTS_IMPORT_ONGOING",
	FAILED: "FAILED"
}, vd = {
	METADATA: "METADATA",
	SHARE_EVERYTHING: "SHARE_EVERYTHING"
}, yd = {
	AS_PARTICIPANT_AND_ORGANIZER: "AS_PARTICIPANT_AND_ORGANIZER",
	AS_PARTICIPANT: "AS_PARTICIPANT",
	AS_ORGANIZER: "AS_ORGANIZER",
	NONE: "NONE"
}, bd = {
	FOLDER_DELETION: "FOLDER_DELETION",
	FOLDER_IMPORT: "FOLDER_IMPORT",
	NONE: "NONE"
}, xd = {
	WORKSPACE: "WORKSPACE",
	SHIPPED: "SHIPPED",
	INHERITED: "INHERITED"
}, Sd = {
	fieldMetadata: "fieldMetadata",
	objectMetadata: "objectMetadata",
	view: "view",
	viewField: "viewField",
	viewFieldGroup: "viewFieldGroup",
	viewGroup: "viewGroup",
	viewSort: "viewSort",
	rowLevelPermissionPredicate: "rowLevelPermissionPredicate",
	rowLevelPermissionPredicateGroup: "rowLevelPermissionPredicateGroup",
	viewFilterGroup: "viewFilterGroup",
	index: "index",
	logicFunction: "logicFunction",
	viewFilter: "viewFilter",
	role: "role",
	roleTarget: "roleTarget",
	agent: "agent",
	skill: "skill",
	pageLayout: "pageLayout",
	pageLayoutWidget: "pageLayoutWidget",
	pageLayoutTab: "pageLayoutTab",
	commandMenuItem: "commandMenuItem",
	navigationMenuItem: "navigationMenuItem",
	rolePermissionFlag: "rolePermissionFlag",
	permissionFlag: "permissionFlag",
	objectPermission: "objectPermission",
	fieldPermission: "fieldPermission",
	frontComponent: "frontComponent",
	webhook: "webhook",
	applicationVariable: "applicationVariable",
	connectionProvider: "connectionProvider",
	searchFieldMetadata: "searchFieldMetadata",
	timelineActivityType: "timelineActivityType"
}, Cd = {
	WORKSPACE_EVENT: "WORKSPACE_EVENT",
	PAGEVIEW: "PAGEVIEW",
	OBJECT_EVENT: "OBJECT_EVENT",
	USAGE_EVENT: "USAGE_EVENT",
	APPLICATION_LOG: "APPLICATION_LOG"
}, wd = {
	user: "user",
	assistant: "assistant"
}, Td = {
	PAGEVIEW: "PAGEVIEW",
	TRACK: "TRACK"
}, X = te(re), Ed = function(e) {
	return ee({
		url: void 0,
		...e,
		queryRoot: X.Query,
		mutationRoot: X.Mutation,
		subscriptionRoot: X.Subscription
	});
}, Z = "TWENTY_APP_ACCESS_TOKEN", Dd = "TWENTY_APP_APPLICATION_ACCESS_TOKEN", Od = "TWENTY_API_KEY", Q = () => globalThis.process?.env ?? {}, $ = (e) => {
	if (typeof e != "string") return null;
	let t = e.trim();
	return t.length === 0 || t === "Bearer" ? null : t.startsWith("Bearer ") ? t.slice(7).trim() : t;
}, kd = (e) => {
	if (!e) return null;
	if (e instanceof Headers) return $(e.get("Authorization") ?? void 0);
	if (Array.isArray(e)) return $(e.find(([e]) => e.toLowerCase() === "authorization")?.[1]);
	let t = e;
	return $(t.Authorization ?? t.authorization);
}, Ad = (e) => e?.errors ? e.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED" || e.message?.toLowerCase() === "unauthorized") : !1, jd = {
	url: `${process.env.TWENTY_API_URL}/metadata`,
	headers: { "Content-Type": "application/json" }
}, Md = class {
	constructor(e) {
		this.refreshAccessTokenPromise = null;
		let t = {
			...jd,
			...e
		}, { url: n, headers: r, fetch: i, fetcher: a, batch: o, runAs: s, ...c } = t;
		this.url = n ?? "", this.requestOptions = c, this.headers = r ?? {}, this.fetchImplementation = i ?? globalThis.fetch ?? null;
		let l = Q(), u = kd(typeof r == "function" ? void 0 : r);
		this.authorizationToken = u ?? l[s === "application" ? Dd : Z] ?? l[Od] ?? null, this.client = Ed({
			...t,
			headers: void 0,
			fetcher: async (e) => this.executeGraphqlRequestWithOptionalRefresh({ operation: e })
		});
	}
	query(e) {
		return this.client.query(e);
	}
	mutation(e) {
		return this.client.mutation(e);
	}
	async uploadFile(e, t, r = "application/octet-stream", i) {
		let a = new FormData();
		a.append("operations", JSON.stringify({
			query: "mutation UploadFilesFieldFileByUniversalIdentifier($file: Upload!, $fieldMetadataUniversalIdentifier: String!) {\n        uploadFilesFieldFileByUniversalIdentifier(file: $file, fieldMetadataUniversalIdentifier: $fieldMetadataUniversalIdentifier) { id path size createdAt url }\n      }",
			variables: {
				file: null,
				fieldMetadataUniversalIdentifier: i
			}
		})), a.append("map", JSON.stringify({ 0: ["variables.file"] })), a.append("0", new Blob([e], { type: r }), t);
		let o = await this.executeGraphqlRequestWithOptionalRefresh({
			operation: a,
			headers: {},
			requestInit: { method: "POST" }
		});
		if (o.errors) throw new n(o.errors, o.data);
		return o.data.uploadFilesFieldFileByUniversalIdentifier;
	}
	async executeGraphqlRequestWithOptionalRefresh({ operation: e, headers: t, requestInit: n }) {
		let r = await this.executeGraphqlRequest({
			operation: e,
			headers: t,
			requestInit: n,
			token: this.authorizationToken
		});
		if (this.shouldRefreshToken(r)) {
			let r = await this.requestRefreshedAccessToken();
			if (r) {
				let i = await this.executeGraphqlRequest({
					operation: e,
					headers: t,
					requestInit: n,
					token: r
				});
				return this.assertResponseIsSuccessful(i);
			}
		}
		return this.assertResponseIsSuccessful(r);
	}
	async executeGraphqlRequest({ operation: e, headers: t, requestInit: n, token: r }) {
		if (!this.fetchImplementation) throw Error("Global `fetch` function is not available, pass a fetch implementation to the Twenty client");
		let i = await this.resolveHeaders(), a = new Headers(i);
		t && new Headers(t).forEach((e, t) => a.set(t, e)), e instanceof FormData ? a.delete("Content-Type") : a.set("Content-Type", "application/json"), r ? a.set("Authorization", `Bearer ${r}`) : a.delete("Authorization");
		let o = await this.fetchImplementation.call(globalThis, this.url, {
			...this.requestOptions,
			...n,
			method: n?.method ?? "POST",
			headers: a,
			body: e instanceof FormData ? e : JSON.stringify(e)
		}), s = await o.text(), c = null;
		if (s.trim().length > 0) try {
			c = JSON.parse(s);
		} catch {
			c = null;
		}
		return {
			status: o.status,
			statusText: o.statusText,
			payload: c,
			rawBody: s
		};
	}
	async resolveHeaders() {
		return typeof this.headers == "function" ? await this.headers() ?? {} : this.headers ?? {};
	}
	shouldRefreshToken(e) {
		return e.status === 401 ? !0 : Ad(e.payload);
	}
	assertResponseIsSuccessful(e) {
		if (e.status < 200 || e.status >= 300) throw Error(`${e.statusText}: ${e.rawBody}`);
		if (e.payload === null) throw Error("Invalid JSON response");
		return e.payload;
	}
	async requestRefreshedAccessToken() {
		let e = globalThis.frontComponentHostCommunicationApi?.requestAccessTokenRefresh;
		return typeof e == "function" ? (this.refreshAccessTokenPromise ||= e().then((e) => typeof e != "string" || e.length === 0 ? null : (this.setAuthorizationToken(e), e)).catch((e) => (console.error("Twenty client: token refresh failed", e), null)).finally(() => {
			this.refreshAccessTokenPromise = null;
		}), this.refreshAccessTokenPromise) : null;
	}
	setAuthorizationToken(e) {
		this.authorizationToken = e;
		let t = Q();
		t[Z] = e;
	}
};
//#endregion
export { Md as MetadataApiClient, ie as MetadataSchema };
