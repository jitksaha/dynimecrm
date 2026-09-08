import { a as e, i as t, n, t as r } from "./application-yzkKx8Nd.mjs";
//#region src/rest/index.ts
var i = (e) => e != null, a = class extends Error {
	constructor(e, t) {
		super(e), this.name = "RestApiClientError", this.status = t?.status, this.statusText = t?.statusText, this.url = t?.url, this.body = t?.body;
	}
}, o = () => globalThis.process?.env ?? {}, s = (e) => /^\/?s\//.test(e), c = (e) => e.replace(/^(\/?)s\//, "$1"), l = (e, t, n) => {
	let r = /^https?:\/\//i.test(t) ? t : `${e}${t.startsWith("/") ? "" : "/"}${t}`;
	if (!i(n)) return r;
	let a = new URLSearchParams();
	for (let [e, t] of Object.entries(n)) i(t) && a.append(e, String(t));
	let o = a.toString();
	return o.length === 0 ? r : r.includes("?") ? `${r}&${o}` : `${r}?${o}`;
}, u = class {
	constructor(e) {
		this.refreshAccessTokenPromise = null, this.baseUrl = e?.baseUrl, this.token = e?.token, this.defaultHeaders = e?.defaultHeaders, this.fetchImplementation = e?.fetch ?? globalThis.fetch ?? null, this.authorizationToken = e?.token ?? null, this.runAs = e?.runAs;
	}
	request(e, t, n) {
		return this.execute(e, t, n?.body, n);
	}
	get(e, t) {
		return this.execute("GET", e, void 0, t);
	}
	resolveUrl(e, t) {
		let n = this.resolveTarget(e);
		return l(n.baseUrl, n.path, t?.query);
	}
	post(e, t, n) {
		return this.execute("POST", e, t, n);
	}
	put(e, t, n) {
		return this.execute("PUT", e, t, n);
	}
	patch(e, t, n) {
		return this.execute("PATCH", e, t, n);
	}
	delete(e, t) {
		return this.execute("DELETE", e, void 0, t);
	}
	resolveBaseUrl() {
		let t = this.baseUrl ?? o().TWENTY_API_URL;
		if (!i(t) || t.trim().length === 0) throw new a(`Missing API url. Set the \`${e}\` environment variable or pass \`baseUrl\` to \`RestApiClient\`.`);
		return t.replace(/\/+$/, "");
	}
	resolveFunctionsBaseUrl() {
		let e = o()[r];
		if (!(!i(e) || e.trim().length === 0)) return e.trim().replace(/\/+$/, "");
	}
	resolveTarget(e) {
		return i(this.baseUrl) || !s(e) ? {
			baseUrl: this.resolveBaseUrl(),
			path: e
		} : {
			baseUrl: this.resolveFunctionsBaseUrl() ?? `${this.resolveBaseUrl()}/s`,
			path: c(e)
		};
	}
	resolveToken() {
		let e = this.runAs === "application" ? t : n;
		if (!i(this.authorizationToken)) {
			let t = o();
			this.authorizationToken = this.token ?? t[e] ?? t.TWENTY_API_KEY ?? null;
		}
		if (!i(this.authorizationToken) || this.authorizationToken.length === 0) throw new a(`Missing application access token. Set the \`${e}\` environment variable or pass \`token\` to \`RestApiClient\`.`);
		return this.authorizationToken;
	}
	async requestRefreshedAccessToken() {
		let e = globalThis.frontComponentHostCommunicationApi?.requestAccessTokenRefresh;
		return typeof e == "function" ? (this.refreshAccessTokenPromise ||= e().then((e) => typeof e != "string" || e.length === 0 ? null : (this.authorizationToken = e, o()[n] = e, e)).catch((e) => (console.error("Twenty REST client: token refresh failed", e), null)).finally(() => {
			this.refreshAccessTokenPromise = null;
		}), this.refreshAccessTokenPromise) : null;
	}
	sendRequest(e, t, n, r, o) {
		if (!i(this.fetchImplementation)) throw new a("Global `fetch` function is not available, pass a fetch implementation to `RestApiClient`.");
		let s = new Headers(this.defaultHeaders);
		i(o?.headers) && new Headers(o.headers).forEach((e, t) => s.set(t, e));
		let c = typeof FormData < "u" && n instanceof FormData, l = i(n) && !c && typeof n != "string";
		c ? s.delete("Content-Type") : l && s.set("Content-Type", "application/json"), s.set("Authorization", `Bearer ${r}`);
		let u = i(n) ? c || typeof n == "string" ? n : JSON.stringify(n) : void 0;
		return this.fetchImplementation.call(globalThis, e, {
			method: t,
			headers: s,
			body: u,
			signal: o?.signal
		});
	}
	async parseResponse(e, t) {
		let n = await e.text(), r;
		if (n.trim().length > 0) try {
			r = JSON.parse(n);
		} catch {
			r = n;
		}
		if (!e.ok) throw new a(`Request to ${t} failed with status ${e.status} ${e.statusText}`, {
			status: e.status,
			statusText: e.statusText,
			url: t,
			body: r
		});
		return r;
	}
	async execute(e, t, n, r) {
		let a = this.resolveTarget(t), o = l(a.baseUrl, a.path, r?.query), s = this.resolveToken(), c = await this.sendRequest(o, e, n, s, r);
		if (c.status === 401) {
			let t = await this.requestRefreshedAccessToken();
			i(t) && (c = await this.sendRequest(o, e, n, t, r));
		}
		return this.parseResponse(c, o);
	}
};
//#endregion
export { u as RestApiClient, a as RestApiClientError };
