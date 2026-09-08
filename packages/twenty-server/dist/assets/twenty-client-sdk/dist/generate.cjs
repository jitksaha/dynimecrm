Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:`Module`}});const e=require("./chunk-DWNI8pZO.js"),t=require("./application-B8_Undo1.js");let n=require("node:fs/promises"),r=require("node:path"),i=require("esbuild"),a=require("graphql"),o=require("lodash/camelCase.js");o=e.n(o);let s=require("node:fs"),c=require("node:os"),l=require("prettier/standalone");l=e.n(l);let u=require("prettier/plugins/graphql");u=e.n(u);let d=require("prettier/plugins/typescript");d=e.n(d);let f=require("prettier/plugins/estree");f=e.n(f);let p=require("lodash/uniq.js");p=e.n(p);let ee=require("node:url");var te=`// __STRIPPED_DURING_INJECTION_START__`,ne=`// __STRIPPED_DURING_INJECTION_END__`,m=`// __UPLOAD_FILE_START__`,h=`// __UPLOAD_FILE_END__`,g=e=>e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),_=(e,t)=>{let n=e;return n=n.replace(RegExp(`${g(te)}[\\s\\S]*?${g(ne)}\\n?`),``),n=n.replace(`'__TWENTY_DEFAULT_URL__'`,t.defaultUrl),n=n.replace(/TwentyGeneratedClient/g,t.apiClientName),t.includeUploadFile?(n=n.replace(RegExp(`\\s*${g(m)}\\n`),`
`),n=n.replace(RegExp(`\\s*${g(h)}\\n`),`
`)):n=n.replace(RegExp(`\\s*${g(m)}[\\s\\S]*?${g(h)}\\n?`),`
`),`\n// ${t.apiClientName} (auto-injected by twenty-client-sdk)\n${n}`},v=e=>(0,n.mkdir)(e,{recursive:!0}),y=async e=>{let t;try{t=await(0,n.readdir)(e)}catch(t){if(t instanceof Error&&`code`in t&&t.code===`ENOENT`){await(0,n.mkdir)(e,{recursive:!0});return}throw t}await Promise.all(t.map(t=>(0,n.rm)((0,r.join)(e,t),{recursive:!0,force:!0})))},b=async(e,t)=>{try{await(0,n.rename)(e,t)}catch(r){if(r instanceof Error&&`code`in r&&r.code===`EXDEV`)await(0,n.cp)(e,t,{recursive:!0}),await(0,n.rm)(e,{recursive:!0,force:!0});else throw r}},x=e=>(0,n.rm)(e,{recursive:!0,force:!0}),re=e=>{let{root:t}=(0,r.parse)(e),n=e.slice(t.length).split(/[\\/]/).filter(Boolean).length,i=(0,r.resolve)((0,c.homedir)()),a=e===i||i.startsWith(`${e}/`);if(e===t||n<2||a)throw Error(`Refusing to recursively clear unsafe path: ${e}`)},S=async(e,t=!1)=>{let n=(0,r.resolve)(...e);t&&(re(n),await s.promises.rm(n,{recursive:!0,force:!0})),await s.promises.mkdir(n,{recursive:!0})},C=async(e,t)=>{let n=(0,r.resolve)(...e,`..`);await s.promises.mkdir(n,{recursive:!0}),await s.promises.writeFile((0,r.resolve)(...e),t)},w=`./runtime`,T=e=>e?`${e.name}GenqlSelection`:``,ie=e=>{let t=e.config?.endpoint?`"${e.config.endpoint}"`:`undefined`,n=e.config?.fetchImport;return`
function(options${t?`?`:``}: ClientOptions): Client {
  return createClientOriginal({
      url: ${t},
      ${n?`fetch,`:``}
      ...options,
      queryRoot: typeMap.Query!,
      mutationRoot: typeMap.Mutation!,
      subscriptionRoot: typeMap.Subscription!,
  }) as any
}`},E=(e,t)=>{let n=e.getQueryType(),r=e.getMutationType(),i=e.getSubscriptionType(),a=t.config?.fetchImport||``;t.addCodeBlock(`
${a}
${ae({mutationType:r,queryType:n,subscriptionType:i})}
  import { 
      linkTypeMap, 
      createClient as createClientOriginal, 
      generateGraphqlOperation,
      type FieldsSelection, type GraphqlOperation, type ClientOptions, GenqlError
  } from '${w}'
  export type { FieldsSelection } from '${w}'
  export { GenqlError }

  import types from './types'
  export * from './schema'
  const typeMap = linkTypeMap(types as any)

  ${oe({mutationType:r,queryType:n,subscriptionType:i})}

  export const createClient = ${ie(t)}

  export const everything = {
    __scalar: true
  }
  `),n&&t.addCodeBlock(`
        export type QueryResult<fields extends ${T(n)}> = FieldsSelection<${n.name}, fields>
        export const generateQueryOp: (fields: ${T(n)} & { __name?: string }) => GraphqlOperation = function(fields) {
        return generateGraphqlOperation('query', typeMap.Query!, fields as any)
      }
    `),r&&t.addCodeBlock(`
        export type MutationResult<fields extends ${T(r)}> = FieldsSelection<${r.name}, fields>
        export const generateMutationOp: (fields: ${T(r)} & { __name?: string }) => GraphqlOperation = function(fields) {
        return generateGraphqlOperation('mutation', typeMap.Mutation!, fields as any)
      }
    `),i&&t.addCodeBlock(`
        export type SubscriptionResult<fields extends ${T(i)}> = FieldsSelection<${i.name}, fields>
        export const generateSubscriptionOp: (fields: ${T(i)} & { __name?: string }) => GraphqlOperation = function(fields) {
        return generateGraphqlOperation('subscription', typeMap.Subscription!, fields as any)
      }
    `)};function ae({queryType:e,mutationType:t,subscriptionType:n}){let r=[];return e&&r.push(T(e),e.name),t&&r.push(T(t),t.name),n&&r.push(T(n),n.name),r.length>0?`import type {${r.join(`,`)}} from './schema'`:``}function oe({queryType:e,mutationType:t,subscriptionType:n}){let r=``;return e&&(r+=`
      query<R extends ${T(e)}>(
          request: R & { __name?: string },
      ): Promise<FieldsSelection<${e.name}, R>>
      `),t&&(r+=`
      mutation<R extends ${T(t)}>(
          request: R & { __name?: string },
      ): Promise<FieldsSelection<${t.name}, R>>
      `),`
  export interface Client {
      ${r}
  }
  `}var D=[`__Schema`,`__Type`,`__TypeKind`,`__Field`,`__InputValue`,`__EnumValue`,`__Directive`,`__DirectiveLocation`],se=async(e,t)=>{try{return await l.default.format(e,{parser:t,plugins:[u,d,f],semi:!1,singleQuote:!0,trailingComma:`all`,printWidth:80})}catch{return e}},ce=(e,t)=>{let n=(0,r.relative)(e,t);return n[0]===`.`?n:`./${n}`},O=class{constructor(e,t){this.schema=e,this.config=t,this.codeBlocks=[],this.imports={},this.importAliasCounter=0}addCodeBlock(e){e&&this.codeBlocks.push(e)}addImport(e,t,n,r,i){this.config&&this.config.output&&(e=r?e:ce(this.config.output,e)),this.imports[e]||(this.imports[e]=[]);let a=this.imports[e],o=a.find(e=>t&&e.isDefault||!t&&e.module===n);if(o)return o.alias;this.importAliasCounter++;let s=i?void 0:`a${this.importAliasCounter}`;return a.push({isDefault:t,module:n,alias:s}),s}getImportBlock(){let e=[];if(Object.keys(this.imports).forEach(t=>{let n=this.imports[t].find(e=>e.isDefault),r=this.imports[t].filter(e=>!e.isDefault),i=[];n&&i.push(n.alias||``),r.length>0&&i.push(`{${r.map(e=>e.alias?`${e.module} as ${e.alias}`:e.module).join(`,`)}}`),e.push(`import ${i.join(`,`)} from '${t}'`)}),e.length>0)return e.join(`
`)}async toCode(e,t=!1){let n=[...this.codeBlocks];if(e&&(e===`typescript`||e===`babel`)){let e=this.getImportBlock();e&&n.unshift(e)}return e&&t?se(n.join(`

`),e):e?n.join(`

`):n.join(``)}},k=e=>{let t=[];return e.deprecated&&t.push(`@deprecated ${e.deprecated.replace(/\s/g,` `)}`),e.text&&t.push(...e.text.split(`
`)),t.length>0?t.length===1?`\n/** ${t[0]} */\n`:`\n/**\n${t.map(e=>` * ${e}`).join(`
`)}\n */\n`:``},A=e=>k({text:e.description}),j=e=>k({deprecated:e.deprecationReason,text:e.description}),M=e=>k({text:e.description}),N=(e,t,n,r,i,o=e=>e)=>{if(n)if(i){if((0,a.isNonNullType)(e))return`: ${N(e.ofType,!0,!1,r,i,o)}`;{let t=N(e,!0,!1,r,i,o);return r?`?: ${t}`:`?: (${t} | null)`}}else return`: ${N(e,!1,!1,r,i,o)}`;if((0,a.isNamedType)(e)){let n=e.name;(0,a.isScalarType)(e)&&(n=`Scalars['${n}']`);let i=o(n);return r?t?i:`(${i} | undefined)`:t?i:`(${i} | null)`}if((0,a.isListType)(e)){let n=`${N(e.ofType,!1,!1,r,i,o)}[]`;return r?t?n:`(${n} | undefined)`:t?n:`(${n} | null)`}return N(e.ofType,!0,!1,r,i,o)},P=(e,t,n,r=!0,i=void 0)=>N(e,!1,r,t,n,i);function F(e){e||={};let t={};return Object.keys(e).sort().forEach(function(n){t[n]=e[n]}),t}var I=(e,t)=>{let n=e.getFields();t.config?.sortProperties&&(n=F(n));let r=Object.keys(n).map(e=>{let t=n[e];return`${M(t)}${t.name}${P(t.type,!1,!0)}`});t.addCodeBlock(`${A(e)}export interface ${e.name} {${r.join(`,`)}}`)},L=`    `,R=(e,t)=>{let n=e.getFields();t.config?.sortProperties&&(n=F(n));let r=Object.keys(n).map(e=>{let t=n[e],r=[],i=(0,a.getNamedType)(t.type),o=!((0,a.isEnumType)(i)||(0,a.isScalarType)(i)),s=t.args.length>0,c=z(t),l=!c.match(/[^?]:/);return s&&(o?r.push(`(${T(i)} & { __args${l?`?`:``}: ${c} })`):r.push(`{ __args: ${c} }`)),l&&!o&&r.push(`boolean | number`),!s&&o&&r.push(T(i)),`${j(t)}${t.name}?: ${r.join(` | `)}`});if((0,a.isInterfaceType)(e)&&t.schema){let n=t.schema.getPossibleTypes(e).map(e=>`on_${e.name}?: ${T(e)}`);t.config?.sortProperties&&(n=n.sort()),r=r.concat(n)}r.push(`__typename?: boolean | number`),r.push(`__scalar?: boolean | number`),r=r.map(e=>e.split(`
`).filter(Boolean).map(e=>L+e).join(`
`)),t.addCodeBlock(`${A(e)}export interface ${T(e)}{\n${r.join(`
`)}\n}`)},z=e=>`{${e.args.map(e=>`${M(e)}${e.name}${P(e.type,!1,!0)}`).join(`, `)}}`,B=(e,t)=>{let n=[...e.getTypes()];t.config?.sortProperties&&(n=n.sort());let r=n.map(e=>`on_${e.name}?:${T(e)}`),i=(0,p.default)(n.map(e=>e.getInterfaces()).flat());r.push(...i.map(e=>`on_${e.name}?: ${T(e)}`)),r.push(`__typename?: boolean | number`),t.addCodeBlock(`${A(e)}export interface ${T(e)}{\n${r.map(e=>`    `+e).join(`,
`)}\n}`)},V=(e,t)=>{let n=e.getTypeMap();t.config?.sortProperties&&(n=F(n));for(let e in n){if(D.includes(e))continue;let r=n[e];((0,a.isObjectType)(r)||(0,a.isInterfaceType)(r))&&R(r,t),(0,a.isInputObjectType)(r)&&I(r,t),(0,a.isUnionType)(r)&&B(r,t)}let r=[{type:e.getQueryType(),name:`QueryGenqlSelection`},{type:e.getMutationType(),name:`MutationGenqlSelection`},{type:e.getSubscriptionType(),name:`SubscriptionGenqlSelection`}].map(H).filter(Boolean).join(`
`);t.addCodeBlock(r)};function H({type:e,name:t}){return e&&T(e)!==t?`export type ${t} = ${T(e)}`:``}var U=(e,t)=>{let n=e.getValues().map(e=>`'${e.name}'`);t.addCodeBlock(`${A(e)}export type ${e.name} = ${n.join(` | `)}`)},W=`    `,G=(e,t)=>{let n=e.getFields();t.config?.sortProperties&&(n=F(n));let r=Object.keys(n).map(e=>n[e]);if(!t.schema)throw Error(`no schema provided`);let i=(0,a.isObjectType)(e)?[e.name]:t.schema.getPossibleTypes(e).map(e=>e.name),o=r.map(e=>`${j(e)}${e.name}${P(e.type,!0,!0)}`).concat([`__typename: ${i.length>0?i.map(e=>`'${e}'`).join(`|`):`string`}`]);o=o.map(e=>e.split(`
`).filter(Boolean).map(e=>W+e).join(`
`)),t.addCodeBlock(`${A(e)}export interface ${e.name} {\n${o.join(`
`)}\n}`)},le={Int:`number`,Float:`number`,String:`string`,Boolean:`boolean`,ID:`string`},ue=(e,t)=>({...le,...t?.config?.scalarTypes||{}})[e.name]||`any`;function de(e,t){let n=``;return t.forEach(t=>{n+=`    ${t.name}: ${ue(t,e)},\n`}),`export type Scalars = {\n${n}}`}var fe=(e,t)=>{let n=e.getTypes().map(e=>e.name);t.config?.sortProperties&&(n=n.sort()),t.addCodeBlock(`${A(e)}export type ${e.name} = (${n.join(` | `)}) & { __isUnion?: true }`)},pe=(e,t)=>{if(!t.schema)throw Error(`schema is required to render unionType`);let n=t.schema.getPossibleTypes(e).map(e=>e.name);n.length?t.addCodeBlock(`${A(e)}export type ${e.name} = (${n.join(` | `)}) & { __isUnion?: true }`):G(e,t)},me=(e,t)=>{let n=e.getTypeMap();t.config?.sortProperties&&(n=F(n)),t.addCodeBlock(de(t,Object.values(n).filter(e=>(0,a.isScalarType)(e))));for(let e in n){if(D.includes(e))continue;let r=n[e];(0,a.isEnumType)(r)&&U(r,t),(0,a.isUnionType)(r)&&fe(r,t),(0,a.isObjectType)(r)&&G(r,t),(0,a.isInterfaceType)(r)&&pe(r,t)}let r=[{type:e.getQueryType(),name:`Query`},{type:e.getMutationType(),name:`Mutation`},{type:e.getSubscriptionType(),name:`Subscription`}].map(he).filter(Boolean).join(`
`);t.addCodeBlock(r)};function he({type:e,name:t}){return e&&e.name!==t?`export type ${t} = ${e.name}`:``}var ge=(e,t)=>{t.addCodeBlock((0,a.printSchema)(e))},K=(e,t)=>`
    const ${e}_possibleTypes: string[] = [${t.map(e=>`'${e}'`).join(`,`)}]
    export const is${e} = (obj?: { __typename?: any } | null): obj is ${e} => {
      if (!obj?.__typename) throw new Error('__typename is missing in "is${e}"')
      return ${e}_possibleTypes.includes(obj.__typename)
    }
    `,q=(e,t)=>{let n=e.getTypeMap();for(let r in n){if(D.includes(r))continue;let i=n[r];if((0,a.isUnionType)(i)){let e=i.getTypes().map(e=>e.name);t.addCodeBlock(K(i.name,e))}else if((0,a.isInterfaceType)(i)){let n=e.getPossibleTypes(i).map(e=>e.name);t.addCodeBlock(K(i.name,n))}else (0,a.isObjectType)(i)&&t.addCodeBlock(K(i.name,[i.name]))}};function J(e){return e?Object.keys(e).length===0:!0}var Y=(e,t)=>{let n=Object.keys(e.getFields()).reduce((t,n)=>{let r=e.getFields()[n],i={type:(0,a.getNamedType)(r.type).name};t[n]=i;let o=r.args||[];return o.length>0&&(i.args=o.reduce((e,t)=>{let n=t.type.toString(),r=(0,a.getNamedType)(t.type).name;return e[t.name]=[r],r!==n&&e[t.name]?.push(n),e},{})),t},{});return(0,a.isInterfaceType)(e)&&t.schema&&t.schema.getPossibleTypes(e).map(e=>{J(n)||(n[`on_${e.name}`]={type:e.name})}),J(n)||(n.__typename={type:`String`}),n},_e=(e,t)=>{let n=e.getTypes(),r=n.reduce((e,t)=>(e[`on_${t.name}`]={type:t.name},e),{});return(0,p.default)(n.map(e=>e.getInterfaces()).flat()).forEach(e=>{r[`on_${e.name}`]={type:e.name}}),r.__typename={type:`String`},r},ve=(e,t)=>{let n={scalars:[],types:{}};Object.keys(e.getTypeMap()).filter(e=>!D.includes(e)).map(t=>e.getTypeMap()[t]).map(e=>{(0,a.isObjectType)(e)||(0,a.isInterfaceType)(e)||(0,a.isInputObjectType)(e)?n.types[e.name]=Y(e,t):(0,a.isUnionType)(e)?n.types[e.name]=_e(e,t):((0,a.isScalarType)(e)||(0,a.isEnumType)(e))&&(n.scalars.push(e.name),n.types[e.name]={})});let r=e.getQueryType();r?.name&&r?.name!==`Query`&&(delete n.types[r.name],n.types.Query=Y(r,t));let i=e.getMutationType();i?.name&&i.name!==`Mutation`&&(delete n.types[i.name],n.types.Mutation=Y(i,t));let o=e.getSubscriptionType();o?.name&&o.name!==`Subscription`&&(delete n.types[o.name],n.types.Subscription=Y(o,t)),t.addCodeBlock(JSON.stringify(ye(n),null,4))};function ye(e){let t=Object.assign({},...Object.keys(e.types).map((e,t)=>({[e]:t})));return{scalars:e.scalars.map(e=>t[e]),types:Object.assign({},...Object.keys(e.types||{}).map(n=>{let r=e.types[n]||{},i=Object.assign({},...Object.keys(r).map(e=>{let n=r[e];if(!n)throw Error(`no content in field `+e);let[i,a]=[n.type,n.args],o=[i?t[i]:-1];return a&&(o[1]=Object.assign({},...Object.keys(a||{}).map(e=>{let n=a?.[e];if(!n)throw Error(`replaceTypeNamesWithIndexes: no arg for `+e);return{[e]:[t[n[0]],...n.slice(1)]}}))),{[e]:o}}));return{[n]:{...i}}}))}}var be=`import type { GraphqlOperation } from './generateGraphqlOperation'
import { GenqlError } from './error'

type Variables = Record<string, any>

type QueryError = Error & {
    message: string

    locations?: Array<{
        line: number
        column: number
    }>
    path?: any
    rid: string
    details?: Record<string, any>
}
type Result = {
    data: Record<string, any>
    errors: Array<QueryError>
}
type Fetcher = (
    batchedQuery: GraphqlOperation | Array<GraphqlOperation>,
) => Promise<Array<Result>>
type Options = {
    batchInterval?: number
    shouldBatch?: boolean
    maxBatchSize?: number
}
type Queue = Array<{
    request: GraphqlOperation
    resolve: (...args: Array<any>) => any
    reject: (...args: Array<any>) => any
}>

/**
 * takes a list of requests (queue) and batches them into a single server request.
 * It will then resolve each individual requests promise with the appropriate data.
 * @private
 * @param {QueryBatcher}   client - the client to use
 * @param {Queue} queue  - the list of requests to batch
 */
function dispatchQueueBatch(client: QueryBatcher, queue: Queue): void {
    let batchedQuery: any = queue.map((item) => item.request)

    if (batchedQuery.length === 1) {
        batchedQuery = batchedQuery[0]
    }

    client.fetcher(batchedQuery).then((responses: any) => {
        if (queue.length === 1 && !Array.isArray(responses)) {
            if (responses.errors && responses.errors.length) {
                queue[0].reject(
                    new GenqlError(responses.errors, responses.data),
                )
                return
            }

            queue[0].resolve(responses)
            return
        } else if (responses.length !== queue.length) {
            throw new Error('response length did not match query length')
        }

        for (let i = 0; i < queue.length; i++) {
            if (responses[i].errors && responses[i].errors.length) {
                queue[i].reject(
                    new GenqlError(responses[i].errors, responses[i].data),
                )
            } else {
                queue[i].resolve(responses[i])
            }
        }
    }).catch((error: any) => {
        // Reject every queued request if the batched fetch fails (e.g. network
        // error), otherwise callers hang forever and the rejection is unhandled.
        for (const item of queue) {
            item.reject(error)
        }
    })
}

/**
 * creates a list of requests to batch according to max batch size.
 * @private
 * @param {QueryBatcher} client - the client to create list of requests from from
 * @param {Options} options - the options for the batch
 */
function dispatchQueue(client: QueryBatcher, options: Options): void {
    const queue = client._queue
    const maxBatchSize = options.maxBatchSize || 0
    client._queue = []

    if (maxBatchSize > 0 && maxBatchSize < queue.length) {
        for (let i = 0; i < queue.length / maxBatchSize; i++) {
            dispatchQueueBatch(
                client,
                queue.slice(i * maxBatchSize, (i + 1) * maxBatchSize),
            )
        }
    } else {
        dispatchQueueBatch(client, queue)
    }
}
/**
 * Create a batcher client.
 * @param {Fetcher} fetcher                 - A function that can handle the network requests to graphql endpoint
 * @param {Options} options                 - the options to be used by client
 * @param {boolean} options.shouldBatch     - should the client batch requests. (default true)
 * @param {integer} options.batchInterval   - duration (in MS) of each batch window. (default 6)
 * @param {integer} options.maxBatchSize    - max number of requests in a batch. (default 0)
 * @param {boolean} options.defaultHeaders  - default headers to include with every request
 *
 * @example
 * const fetcher = batchedQuery => fetch('path/to/graphql', {
 *    method: 'post',
 *    headers: {
 *      Accept: 'application/json',
 *      'Content-Type': 'application/json',
 *    },
 *    body: JSON.stringify(batchedQuery),
 *    credentials: 'include',
 * })
 * .then(response => response.json())
 *
 * const client = new QueryBatcher(fetcher, { maxBatchSize: 10 })
 */

export class QueryBatcher {
    fetcher: Fetcher
    _options: Options
    _queue: Queue

    constructor(
        fetcher: Fetcher,
        {
            batchInterval = 6,
            shouldBatch = true,
            maxBatchSize = 0,
        }: Options = {},
    ) {
        this.fetcher = fetcher
        this._options = {
            batchInterval,
            shouldBatch,
            maxBatchSize,
        }
        this._queue = []
    }

    /**
     * Fetch will send a graphql request and return the parsed json.
     * @param {string}      query          - the graphql query.
     * @param {Variables}   variables      - any variables you wish to inject as key/value pairs.
     * @param {[string]}    operationName  - the graphql operationName.
     * @param {Options}     overrides      - the client options overrides.
     *
     * @return {promise} resolves to parsed json of server response
     *
     * @example
     * client.fetch(\`
     *    query getHuman($id: ID!) {
     *      human(id: $id) {
     *        name
     *        height
     *      }
     *    }
     * \`, { id: "1001" }, 'getHuman')
     *    .then(human => {
     *      // do something with human
     *      console.log(human);
     *    });
     */
    fetch(
        query: string,
        variables?: Variables,
        operationName?: string,
        overrides: Options = {},
    ): Promise<Result> {
        const request: GraphqlOperation = {
            query,
        }
        const options = Object.assign({}, this._options, overrides)

        if (variables) {
            request.variables = variables
        }

        if (operationName) {
            request.operationName = operationName
        }

        const promise = new Promise<Result>((resolve, reject) => {
            this._queue.push({
                request,
                resolve,
                reject,
            })

            if (this._queue.length === 1) {
                if (options.shouldBatch) {
                    setTimeout(
                        () => dispatchQueue(this, options),
                        options.batchInterval,
                    )
                } else {
                    dispatchQueue(this, options)
                }
            }
        })
        return promise
    }

    /**
     * Fetch will send a graphql request and return the parsed json.
     * @param {string}      query          - the graphql query.
     * @param {Variables}   variables      - any variables you wish to inject as key/value pairs.
     * @param {[string]}    operationName  - the graphql operationName.
     * @param {Options}     overrides      - the client options overrides.
     *
     * @return {Promise<Array<Result>>} resolves to parsed json of server response
     *
     * @example
     * client.forceFetch(\`
     *    query getHuman($id: ID!) {
     *      human(id: $id) {
     *        name
     *        height
     *      }
     *    }
     * \`, { id: "1001" }, 'getHuman')
     *    .then(human => {
     *      // do something with human
     *      console.log(human);
     *    });
     */
    forceFetch(
        query: string,
        variables?: Variables,
        operationName?: string,
        overrides: Options = {},
    ): Promise<Result> {
        const request: GraphqlOperation = {
            query,
        }
        const options = Object.assign({}, this._options, overrides, {
            shouldBatch: false,
        })

        if (variables) {
            request.variables = variables
        }

        if (operationName) {
            request.operationName = operationName
        }

        const promise = new Promise<Result>((resolve, reject) => {
            const client = new QueryBatcher(this.fetcher, this._options)
            client._queue = [
                {
                    request,
                    resolve,
                    reject,
                },
            ]
            dispatchQueue(client, options)
        })
        return promise
    }
}
`,xe=`
import  { type BatchOptions, createFetcher } from './fetcher'
import type { ExecutionResult, LinkedType } from './types'
import {
    generateGraphqlOperation,
    type GraphqlOperation,
} from './generateGraphqlOperation'

export type Headers =
    | HeadersInit
    | (() => HeadersInit)
    | (() => Promise<HeadersInit>)

export type BaseFetcher = (
    operation: GraphqlOperation | GraphqlOperation[],
) => Promise<ExecutionResult | ExecutionResult[]>

export type ClientOptions = Omit<RequestInit, 'body' | 'headers'> & {
    url?: string
    batch?: BatchOptions | boolean
    fetcher?: BaseFetcher
    fetch?: Function
    headers?: Headers
}

export const createClient = ({
    queryRoot,
    mutationRoot,
    subscriptionRoot,
    ...options
}: ClientOptions & {
    queryRoot?: LinkedType
    mutationRoot?: LinkedType
    subscriptionRoot?: LinkedType
}) => {
    const fetcher = createFetcher(options)
    const client: {
        query?: Function
        mutation?: Function
    } = {}

    if (queryRoot) {
        client.query = (request: any) => {
            if (!queryRoot) throw new Error('queryRoot argument is missing')

            const resultPromise = fetcher(
                generateGraphqlOperation('query', queryRoot, request),
            )

            return resultPromise
        }
    }
    if (mutationRoot) {
        client.mutation = (request: any) => {
            if (!mutationRoot)
                throw new Error('mutationRoot argument is missing')

            const resultPromise = fetcher(
                generateGraphqlOperation('mutation', mutationRoot, request),
            )

            return resultPromise
        }
    }

    return client as any
}
`,Se=`export class GenqlError extends Error {
    errors: Array<GraphqlError> = []
    /**
     * Partial data returned by the server
     */
    data?: any
    constructor(errors: any[], data: any) {
        let message = Array.isArray(errors)
            ? errors.map((x) => x?.message || '').join('\\n')
            : ''
        if (!message) {
            message = 'GraphQL error'
        }
        super(message)
        this.errors = errors
        this.data = data
    }
}

interface GraphqlError {
    message: string
    locations?: Array<{
        line: number
        column: number
    }>
    path?: string[]
    extensions?: Record<string, any>
}
`,Ce=`import { QueryBatcher } from './batcher'

import type { ClientOptions } from './createClient'
import type { GraphqlOperation } from './generateGraphqlOperation'
import { GenqlError } from './error'

export interface Fetcher {
    (gql: GraphqlOperation): Promise<any>
}

export type BatchOptions = {
    batchInterval?: number // ms
    maxBatchSize?: number
}

const DEFAULT_BATCH_OPTIONS = {
    maxBatchSize: 10,
    batchInterval: 40,
}

export const createFetcher = ({
    url,
    headers = {},
    fetcher,
    fetch: _fetch,
    batch = false,
    ...rest
}: ClientOptions): Fetcher => {
    if (!url && !fetcher) {
        throw new Error('url or fetcher is required')
    }
    if (!fetcher) {
        fetcher = async (body) => {
            let headersObject =
                typeof headers == 'function' ? await headers() : headers
            headersObject = headersObject || {}
            if (typeof fetch === 'undefined' && !_fetch) {
                throw new Error(
                    'Global \`fetch\` function is not available, pass a fetch polyfill to Genql \`createClient\`',
                )
            }
            let fetchImpl = _fetch || fetch
            const res = await fetchImpl(url!, {
                headers: {
                    'Content-Type': 'application/json',
                    ...headersObject,
                },
                method: 'POST',
                body: JSON.stringify(body),
                ...rest,
            })
            if (!res.ok) {
                throw new Error(\`\${res.statusText}: \${await res.text()}\`)
            }
            const json = await res.json()
            return json
        }
    }

    if (!batch) {
        return async (body) => {
            const json = await fetcher!(body)
            if (Array.isArray(json)) {
                return json.map((json) => {
                    if (json?.errors?.length) {
                        throw new GenqlError(json.errors || [], json.data)
                    }
                    return json.data
                })
            } else {
                if (json?.errors?.length) {
                    throw new GenqlError(json.errors || [], json.data)
                }
                return json.data
            }
        }
    }

    const batcher = new QueryBatcher(
        async (batchedQuery) => {
            // console.log(batchedQuery) // [{ query: 'query{user{age}}', variables: {} }, ...]
            const json = await fetcher!(batchedQuery)
            return json as any
        },
        batch === true ? DEFAULT_BATCH_OPTIONS : batch,
    )

    return async ({ query, variables }) => {
        const json = await batcher.fetch(query, variables)
        if (json?.data) {
            return json.data
        }
        throw new Error(
            'Genql batch fetcher returned unexpected result ' + JSON.stringify(json),
        )
    }
}
`,we=`import type { LinkedField, LinkedType } from './types'

export interface Args {
    [arg: string]: any | undefined
}

export interface Fields {
    [field: string]: Request
}

export type Request = boolean | number | Fields

export interface Variables {
    [name: string]: {
        value: any
        typing: [LinkedType, string]
    }
}

export interface Context {
    root: LinkedType
    varCounter: number
    variables: Variables
    fragmentCounter: number
    fragments: string[]
}

export interface GraphqlOperation {
    query: string
    variables?: { [name: string]: any }
    operationName?: string
}

const parseRequest = (
    request: Request | undefined,
    ctx: Context,
    path: string[],
): string => {
    if (typeof request === 'object' && '__args' in request) {
        const args: any = request.__args
        let fields: Request | undefined = { ...request }
        delete fields.__args
        const argNames = Object.keys(args)

        if (argNames.length === 0) {
            return parseRequest(fields, ctx, path)
        }

        const field = getFieldFromPath(ctx.root, path)

        const argStrings = argNames.map((argName) => {
            ctx.varCounter++
            const varName = \`v\${ctx.varCounter}\`

            const typing = field.args && field.args[argName] // typeMap used here, .args

            if (!typing) {
                throw new Error(
                    \`no typing defined for argument \\\`\${argName}\\\` in path \\\`\${path.join(
                        '.',
                    )}\\\`\`,
                )
            }

            ctx.variables[varName] = {
                value: args[argName],
                typing,
            }

            return \`\${argName}:$\${varName}\`
        })
        return \`(\${argStrings})\${parseRequest(fields, ctx, path)}\`
    } else if (typeof request === 'object' && Object.keys(request).length > 0) {
        const fields = request
        const fieldNames = Object.keys(fields).filter((k) => Boolean(fields[k]))

        if (fieldNames.length === 0) {
            throw new Error(
                \`field selection should not be empty: \${path.join('.')}\`,
            )
        }

        const type =
            path.length > 0 ? getFieldFromPath(ctx.root, path).type : ctx.root
        const scalarFields = type.scalar

        let scalarFieldsFragment: string | undefined

        if (fieldNames.includes('__scalar')) {
            const falsyFieldNames = new Set(
                Object.keys(fields).filter((k) => !Boolean(fields[k])),
            )
            if (scalarFields?.length) {
                ctx.fragmentCounter++
                scalarFieldsFragment = \`f\${ctx.fragmentCounter}\`

                ctx.fragments.push(
                    \`fragment \${scalarFieldsFragment} on \${
                        type.name
                    }{\${scalarFields
                        .filter((f) => !falsyFieldNames.has(f))
                        .join(',')}}\`,
                )
            }
        }

        const fieldsSelection = fieldNames
            .filter((f) => !['__scalar', '__name'].includes(f))
            .map((f) => {
                const parsed = parseRequest(fields[f], ctx, [...path, f])

                if (f.startsWith('on_')) {
                    ctx.fragmentCounter++
                    const implementationFragment = \`f\${ctx.fragmentCounter}\`

                    const typeMatch = f.match(/^on_(.+)/)

                    if (!typeMatch || !typeMatch[1])
                        throw new Error('match failed')

                    ctx.fragments.push(
                        \`fragment \${implementationFragment} on \${typeMatch[1]}\${parsed}\`,
                    )

                    return \`...\${implementationFragment}\`
                } else {
                    return \`\${f}\${parsed}\`
                }
            })
            .concat(scalarFieldsFragment ? [\`...\${scalarFieldsFragment}\`] : [])
            .join(',')

        return \`{\${fieldsSelection}}\`
    } else {
        return ''
    }
}

export const generateGraphqlOperation = (
    operation: 'query' | 'mutation' | 'subscription',
    root: LinkedType,
    fields?: Fields,
): GraphqlOperation => {
    const ctx: Context = {
        root: root,
        varCounter: 0,
        variables: {},
        fragmentCounter: 0,
        fragments: [],
    }
    const result = parseRequest(fields, ctx, [])

    const varNames = Object.keys(ctx.variables)

    const varsString =
        varNames.length > 0
            ? \`(\${varNames.map((v) => {
                  const variableType = ctx.variables[v].typing[1]
                  return \`$\${v}:\${variableType}\`
              })})\`
            : ''

    const operationName = fields?.__name || ''

    return {
        query: [
            \`\${operation} \${operationName}\${varsString}\${result}\`,
            ...ctx.fragments,
        ].join(','),
        variables: Object.keys(ctx.variables).reduce<{ [name: string]: any }>(
            (r, v) => {
                r[v] = ctx.variables[v].value
                return r
            },
            {},
        ),
        ...(operationName ? { operationName: operationName.toString() } : {}),
    }
}

export const getFieldFromPath = (
    root: LinkedType | undefined,
    path: string[],
) => {
    let current: LinkedField | undefined

    if (!root) throw new Error('root type is not provided')

    if (path.length === 0) throw new Error(\`path is empty\`)

    path.forEach((f) => {
        const type = current ? current.type : root

        if (!type.fields)
            throw new Error(\`type \\\`\${type.name}\\\` does not have fields\`)

        const possibleTypes = Object.keys(type.fields)
            .filter((i) => i.startsWith('on_'))
            .reduce(
                (types, fieldName) => {
                    const field = type.fields && type.fields[fieldName]
                    if (field) types.push(field.type)
                    return types
                },
                [type],
            )

        let field: LinkedField | null = null

        possibleTypes.forEach((type) => {
            const found = type.fields && type.fields[f]
            if (found) field = found
        })

        if (!field)
            throw new Error(
                \`type \\\`\${type.name}\\\` does not have a field \\\`\${f}\\\`\`,
            )

        current = field
    })

    return current as LinkedField
}
`,Te=`export { createClient } from './createClient'
export type { ClientOptions } from './createClient'
export type { FieldsSelection } from './typeSelection'
export { generateGraphqlOperation } from './generateGraphqlOperation'
export type { GraphqlOperation } from './generateGraphqlOperation'
export { linkTypeMap } from './linkTypeMap'
// export { Observable } from 'zen-observable-ts'
export { createFetcher } from './fetcher'
export { GenqlError } from './error'
export const everything = {
    __scalar: true,
}
`,Ee=`import type {
    CompressedType,
    CompressedTypeMap,
    LinkedArgMap,
    LinkedField,
    LinkedType,
    LinkedTypeMap,
} from './types'

export interface PartialLinkedFieldMap {
    [field: string]: {
        type: string
        args?: LinkedArgMap
    }
}

export const linkTypeMap = (
    typeMap: CompressedTypeMap<number>,
): LinkedTypeMap => {
    const indexToName: Record<number, string> = Object.assign(
        {},
        ...Object.keys(typeMap.types).map((k, i) => ({ [i]: k })),
    )

    let intermediaryTypeMap = Object.assign(
        {},
        ...Object.keys(typeMap.types || {}).map(
            (k): Record<string, LinkedType> => {
                const type: CompressedType = typeMap.types[k]!
                const fields = type || {}
                return {
                    [k]: {
                        name: k,
                        // type scalar properties
                        scalar: Object.keys(fields).filter((f) => {
                            const [type] = fields[f] || []
                            return type && typeMap.scalars.includes(type)
                        }),
                        // fields with corresponding \`type\` and \`args\`
                        fields: Object.assign(
                            {},
                            ...Object.keys(fields).map(
                                (f): PartialLinkedFieldMap => {
                                    const [typeIndex, args] = fields[f] || []
                                    if (typeIndex == null) {
                                        return {}
                                    }
                                    return {
                                        [f]: {
                                            // replace index with type name
                                            type: indexToName[typeIndex],
                                            args: Object.assign(
                                                {},
                                                ...Object.keys(args || {}).map(
                                                    (k) => {
                                                        // if argTypeString == argTypeName, argTypeString is missing, need to readd it
                                                        if (!args || !args[k]) {
                                                            return
                                                        }
                                                        const [
                                                            argTypeName,
                                                            argTypeString,
                                                        ] = args[k] as any
                                                        return {
                                                            [k]: [
                                                                indexToName[
                                                                    argTypeName
                                                                ],
                                                                argTypeString ||
                                                                    indexToName[
                                                                        argTypeName
                                                                    ],
                                                            ],
                                                        }
                                                    },
                                                ),
                                            ),
                                        },
                                    }
                                },
                            ),
                        ),
                    },
                }
            },
        ),
    )
    const res = resolveConcreteTypes(intermediaryTypeMap)
    return res
}

// replace typename with concrete type
export const resolveConcreteTypes = (linkedTypeMap: LinkedTypeMap) => {
    Object.keys(linkedTypeMap).forEach((typeNameFromKey) => {
        const type: LinkedType = linkedTypeMap[typeNameFromKey]!
        // type.name = typeNameFromKey
        if (!type.fields) {
            return
        }

        const fields = type.fields

        Object.keys(fields).forEach((f) => {
            const field: LinkedField = fields[f]!

            if (field.args) {
                const args = field.args
                Object.keys(args).forEach((key) => {
                    const arg = args[key]

                    if (arg) {
                        const [typeName] = arg

                        if (typeof typeName === 'string') {
                            if (!linkedTypeMap[typeName]) {
                                linkedTypeMap[typeName] = { name: typeName }
                            }

                            arg[0] = linkedTypeMap[typeName]!
                        }
                    }
                })
            }

            const typeName = field.type as LinkedType | string

            if (typeof typeName === 'string') {
                if (!linkedTypeMap[typeName]) {
                    linkedTypeMap[typeName] = { name: typeName }
                }

                field.type = linkedTypeMap[typeName]!
            }
        })
    })

    return linkedTypeMap
}
`,De=`//////////////////////////////////////////////////

// SOME THINGS TO KNOW BEFORE DIVING IN
/*
0. DST is the request type, SRC is the response type

1. FieldsSelection uses an object because currently is impossible to make recursive types

2. FieldsSelection is a recursive type that makes a type based on request type and fields

3. HandleObject handles object types

4. Handle__scalar adds all scalar properties excluding non scalar props
*/

export type FieldsSelection<SRC extends Anify<DST> | undefined, DST> = {
    scalar: SRC
    union: Handle__isUnion<SRC, DST>
    object: HandleObject<SRC, DST>
    array: SRC extends Nil
        ? never
        : SRC extends (infer T)[]
        ? Array<FieldsSelection<T, DST>>
        : never
    __scalar: Handle__scalar<SRC, DST>
    never: never
}[DST extends Nil
    ? 'never'
    : SRC extends Nil
    ? 'never'
    : DST extends false | 0
    ? 'never'
    : SRC extends Scalar
    ? 'scalar'
    : SRC extends any[]
    ? 'array'
    : SRC extends { __isUnion?: any }
    ? 'union'
    : DST extends { __scalar?: any }
    ? '__scalar'
    : DST extends {}
    ? 'object'
    : 'never']

type HandleObject<SRC extends Anify<DST>, DST> = SRC extends Nil
    ? never
    : Pick<
          {
              // using keyof SRC to maintain ?: relations of SRC type
              [Key in keyof SRC]: Key extends keyof DST
                  ? FieldsSelection<
                        NonNullable<SRC[Key]>,
                        NonNullable<DST[Key]>
                    >
                  : SRC[Key]
          },
          Exclude<keyof DST, FieldsToRemove>
          //   {
          //       // remove falsy values
          //       [Key in keyof DST]: DST[Key] extends false | 0 ? never : Key
          //   }[keyof DST]
      >

type Handle__scalar<SRC extends Anify<DST>, DST> = SRC extends Nil
    ? never
    : Pick<
          // continue processing fields that are in DST, directly pass SRC type if not in DST
          {
              [Key in keyof SRC]: Key extends keyof DST
                  ? FieldsSelection<SRC[Key], DST[Key]>
                  : SRC[Key]
          },
          // remove fields that are not scalars or are not in DST
          {
              [Key in keyof SRC]: SRC[Key] extends Nil
                  ? never
                  : Key extends FieldsToRemove
                  ? never
                  : SRC[Key] extends Scalar
                  ? Key
                  : Key extends keyof DST
                  ? Key
                  : never
          }[keyof SRC]
      >

type Handle__isUnion<SRC extends Anify<DST>, DST> = SRC extends Nil
    ? never
    : Omit<SRC, FieldsToRemove> // just return the union type

type Scalar = string | number | Date | boolean | null | undefined

type Anify<T> = { [P in keyof T]?: any }

type FieldsToRemove = '__isUnion' | '__scalar' | '__name' | '__args'

type Nil = undefined | null
`,Oe=`
export interface ExecutionResult<TData = { [key: string]: any }> {
    errors?: Array<Error>
    data?: TData | null
}

export interface ArgMap<keyType = number> {
    [arg: string]: [keyType, string] | [keyType] | undefined
}

export type CompressedField<keyType = number> = [
    type: keyType,
    args?: ArgMap<keyType>,
]

export interface CompressedFieldMap<keyType = number> {
    [field: string]: CompressedField<keyType> | undefined
}

export type CompressedType<keyType = number> = CompressedFieldMap<keyType>

export interface CompressedTypeMap<keyType = number> {
    scalars: Array<keyType>
    types: {
        [type: string]: CompressedType<keyType> | undefined
    }
}

// normal types
export type Field<keyType = number> = {
    type: keyType
    args?: ArgMap<keyType>
}

export interface FieldMap<keyType = number> {
    [field: string]: Field<keyType> | undefined
}

export type Type<keyType = number> = FieldMap<keyType>

export interface TypeMap<keyType = number> {
    scalars: Array<keyType>
    types: {
        [type: string]: Type<keyType> | undefined
    }
}

export interface LinkedArgMap {
    [arg: string]: [LinkedType, string] | undefined
}
export interface LinkedField {
    type: LinkedType
    args?: LinkedArgMap
}

export interface LinkedFieldMap {
    [field: string]: LinkedField | undefined
}

export interface LinkedType {
    name: string
    fields?: LinkedFieldMap
    scalar?: string[]
}

export interface LinkedTypeMap {
    [type: string]: LinkedType | undefined
}
`,X=(e,t)=>e===void 0?(0,s.readFileSync)((0,r.join)((0,r.join)((0,r.dirname)((0,ee.fileURLToPath)({}.url)),`genql`,`runtime`),t),`utf-8`):e,ke=[{name:`batcher.ts`,content:X(be,`batcher.ts`)},{name:`createClient.ts`,content:X(xe,`createClient.ts`)},{name:`error.ts`,content:X(Se,`error.ts`)},{name:`fetcher.ts`,content:X(Ce,`fetcher.ts`)},{name:`generateGraphqlOperation.ts`,content:X(we,`generateGraphqlOperation.ts`)},{name:`index.ts`,content:X(Te,`index.ts`)},{name:`linkTypeMap.ts`,content:X(Ee,`linkTypeMap.ts`)},{name:`typeSelection.ts`,content:X(De,`typeSelection.ts`)},{name:`types.ts`,content:X(Oe,`types.ts`)}],Ae=`schema.ts`,je=`schema.graphql`,Me=`types.ts`,Ne=`index.ts`,Pe=async(e,t)=>{if(!e.output)throw Error("`output` must be defined in the config");let n=e.output;await S([n],!0);let r=new O(t,e);ge(t,r),await C([n,je],await r.toCode(`graphql`)),await S([n,`runtime`]);for(let{name:e,content:t}of ke)await C([n,`runtime`,e],`// @ts-nocheck
`+t);let i=new O(t,e);me(t,i),V(t,i),q(t,i),Fe(t,i),await C([n,Ae],`// @ts-nocheck
`+await i.toCode(`typescript`));let a=new O(t,e);ve(t,a),await C([n,Me],`export default ${await a.toCode()}`);let o=new O(t,e);E(t,o),await C([n,Ne],`// @ts-nocheck
`+await o.toCode(`typescript`,!0))};function Fe(e,t){let n=e.getTypeMap(),r=[];for(let e in n){if(D.includes(e))continue;let t=n[e];(0,a.isEnumType)(t)&&r.push(t)}r.length!==0&&t.addCodeBlock(r.map(e=>`export const ${(0,o.default)(`enum`+e.name)} = {\n`+e.getValues().map(e=>e?.name?`   ${e.name}: '${e.name}' as const`:``).join(`,
`)+`
}
`).join(`
`))}var Ie=async e=>{if(!e.schema)throw Error("`schema` must be defined in the config");let t=(0,a.buildSchema)(e.schema,{assumeValidSDL:!0}),n=e.sortProperties?(0,a.lexicographicSortSchema)(t):t;return n.getQueryType()&&(0,a.assertValidSchema)(n),n},Z=async e=>{if(!e.output)throw Error("`output` must be defined in the config");await Pe(e,await Ie(e))},Le={DateTime:`string`,JSON:`Record<string, unknown>`,UUID:`string`},Q=`core/generated`,$=async({schema:e,outputPath:i,clientWrapperTemplateSource:a})=>{let o=a??`import type { TwentyClientRunAs } from '../shared/twenty-client-run-as.type';

// Ambient type stubs for the genql-generated code this template gets
// injected into. They enable full typecheck/lint on this file.
// __STRIPPED_DURING_INJECTION_START__
type QueryGenqlSelection = Record<string, unknown>;
type MutationGenqlSelection = Record<string, unknown>;
type GraphqlOperation = Record<string, unknown>;

type ClientOptions = Omit<RequestInit, 'body' | 'headers'> & {
  url?: string;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  fetcher?: (
    operation: GraphqlOperation | GraphqlOperation[],
  ) => Promise<unknown>;
  fetch?: typeof globalThis.fetch;
  batch?: unknown;
};

type Client = {
  query: (
    request: QueryGenqlSelection & { __name?: string },
  ) => Promise<unknown>;
  mutation: (
    request: MutationGenqlSelection & { __name?: string },
  ) => Promise<unknown>;
};

declare function createClient(options: ClientOptions): Client;

declare class GenqlError extends Error {
  constructor(errors: unknown, data: unknown);
}
// __STRIPPED_DURING_INJECTION_END__

const APP_ACCESS_TOKEN_ENV_KEY = 'TWENTY_APP_ACCESS_TOKEN';
const APP_APPLICATION_ACCESS_TOKEN_ENV_KEY =
  'TWENTY_APP_APPLICATION_ACCESS_TOKEN';
const API_KEY_ENV_KEY = 'TWENTY_API_KEY';

export type TwentyGeneratedClientOptions = ClientOptions & {
  runAs?: TwentyClientRunAs;
};

type ProcessEnvironment = Record<string, string | undefined>;

type GraphqlErrorPayloadEntry = {
  message?: string;
  extensions?: { code?: string };
};

type GraphqlResponsePayload = {
  data?: Record<string, unknown>;
  errors?: GraphqlErrorPayloadEntry[];
};

type GraphqlResponse = {
  status: number;
  statusText: string;
  payload: GraphqlResponsePayload | null;
  rawBody: string;
};

const getProcessEnvironment = (): ProcessEnvironment => {
  const processObject = (
    globalThis as { process?: { env?: ProcessEnvironment } }
  ).process;

  return processObject?.env ?? {};
};

const getTokenFromAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string | null => {
  if (typeof authorizationHeader !== 'string') {
    return null;
  }

  const trimmedAuthorizationHeader = authorizationHeader.trim();

  if (trimmedAuthorizationHeader.length === 0) {
    return null;
  }

  if (trimmedAuthorizationHeader === 'Bearer') {
    return null;
  }

  if (trimmedAuthorizationHeader.startsWith('Bearer ')) {
    return trimmedAuthorizationHeader.slice('Bearer '.length).trim();
  }

  return trimmedAuthorizationHeader;
};

const getTokenFromHeaders = (
  headers: HeadersInit | undefined,
): string | null => {
  if (!headers) {
    return null;
  }

  if (headers instanceof Headers) {
    return getTokenFromAuthorizationHeader(
      headers.get('Authorization') ?? undefined,
    );
  }

  if (Array.isArray(headers)) {
    const matchedAuthorizationHeader = headers.find(
      ([headerName]) => headerName.toLowerCase() === 'authorization',
    );

    return getTokenFromAuthorizationHeader(matchedAuthorizationHeader?.[1]);
  }

  const headersRecord = headers as Record<string, string | undefined>;

  return getTokenFromAuthorizationHeader(
    headersRecord.Authorization ?? headersRecord.authorization,
  );
};

const hasAuthenticationErrorInGraphqlPayload = (
  payload: GraphqlResponsePayload | null,
): boolean => {
  if (!payload?.errors) {
    return false;
  }

  return payload.errors.some((graphqlError) => {
    return (
      graphqlError.extensions?.code === 'UNAUTHENTICATED' ||
      graphqlError.message?.toLowerCase() === 'unauthorized'
    );
  });
};

const defaultOptions: TwentyGeneratedClientOptions = {
  url: '__TWENTY_DEFAULT_URL__',
  headers: {
    'Content-Type': 'application/json',
  },
};

export class TwentyGeneratedClient {
  private client: Client;
  private url: string;
  private requestOptions: RequestInit;
  private headers: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  private fetchImplementation: typeof globalThis.fetch | null;
  private authorizationToken: string | null;
  private refreshAccessTokenPromise: Promise<string | null> | null = null;

  constructor(options?: TwentyGeneratedClientOptions) {
    const merged: TwentyGeneratedClientOptions = {
      ...defaultOptions,
      ...options,
    };

    const {
      url,
      headers,
      fetch: customFetchImplementation,
      fetcher: _fetcher,
      batch: _batch,
      runAs,
      ...requestOptions
    } = merged;

    this.url = url ?? '';
    this.requestOptions = requestOptions;
    this.headers = headers ?? {};
    this.fetchImplementation =
      customFetchImplementation ?? globalThis.fetch ?? null;

    const processEnvironment = getProcessEnvironment();
    const tokenFromHeaders = getTokenFromHeaders(
      typeof headers === 'function' ? undefined : headers,
    );

    // Priority: explicit header > the token for the requested access > api key
    // (legacy).
    this.authorizationToken =
      tokenFromHeaders ??
      processEnvironment[
        runAs === 'application'
          ? APP_APPLICATION_ACCESS_TOKEN_ENV_KEY
          : APP_ACCESS_TOKEN_ENV_KEY
      ] ??
      processEnvironment[API_KEY_ENV_KEY] ??
      null;

    this.client = createClient({
      ...merged,
      headers: undefined,
      fetcher: async (operation) =>
        this.executeGraphqlRequestWithOptionalRefresh({
          operation,
        }),
    });
  }

  query<R extends QueryGenqlSelection>(request: R & { __name?: string }) {
    return this.client.query(request);
  }

  mutation<R extends MutationGenqlSelection>(request: R & { __name?: string }) {
    return this.client.mutation(request);
  }

  // __UPLOAD_FILE_START__
  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    contentType: string = 'application/octet-stream',
    fieldMetadataUniversalIdentifier: string,
  ): Promise<{
    id: string;
    path: string;
    size: number;
    createdAt: string;
    url: string;
  }> {
    const form = new FormData();

    form.append(
      'operations',
      JSON.stringify({
        query: \`mutation UploadFilesFieldFileByUniversalIdentifier($file: Upload!, $fieldMetadataUniversalIdentifier: String!) {
        uploadFilesFieldFileByUniversalIdentifier(file: $file, fieldMetadataUniversalIdentifier: $fieldMetadataUniversalIdentifier) { id path size createdAt url }
      }\`,
        variables: {
          file: null,
          fieldMetadataUniversalIdentifier,
        },
      }),
    );
    form.append('map', JSON.stringify({ '0': ['variables.file'] }));
    form.append(
      '0',
      new Blob([fileBuffer as BlobPart], { type: contentType }),
      filename,
    );

    const result = await this.executeGraphqlRequestWithOptionalRefresh({
      operation: form,
      headers: {},
      requestInit: {
        method: 'POST',
      },
    });

    if (result.errors) {
      throw new GenqlError(result.errors, result.data);
    }

    const data = result.data as Record<string, unknown>;

    return data.uploadFilesFieldFileByUniversalIdentifier as {
      id: string;
      path: string;
      size: number;
      createdAt: string;
      url: string;
    };
  }
  // __UPLOAD_FILE_END__

  private async executeGraphqlRequestWithOptionalRefresh({
    operation,
    headers,
    requestInit,
  }: {
    operation: GraphqlOperation | GraphqlOperation[] | FormData;
    headers?: HeadersInit;
    requestInit?: RequestInit;
  }) {
    const firstResponse = await this.executeGraphqlRequest({
      operation,
      headers,
      requestInit,
      token: this.authorizationToken,
    });

    if (this.shouldRefreshToken(firstResponse)) {
      const refreshedAccessToken = await this.requestRefreshedAccessToken();

      if (refreshedAccessToken) {
        const retryResponse = await this.executeGraphqlRequest({
          operation,
          headers,
          requestInit,
          token: refreshedAccessToken,
        });

        return this.assertResponseIsSuccessful(retryResponse);
      }
    }

    return this.assertResponseIsSuccessful(firstResponse);
  }

  private async executeGraphqlRequest({
    operation,
    headers,
    requestInit,
    token,
  }: {
    operation: GraphqlOperation | GraphqlOperation[] | FormData;
    headers?: HeadersInit;
    requestInit?: RequestInit;
    token: string | null;
  }): Promise<GraphqlResponse> {
    if (!this.fetchImplementation) {
      throw new Error(
        'Global \`fetch\` function is not available, ' +
          'pass a fetch implementation to the Twenty client',
      );
    }

    const resolvedHeaders = await this.resolveHeaders();
    const requestHeaders = new Headers(resolvedHeaders);

    if (headers) {
      new Headers(headers).forEach((value, key) =>
        requestHeaders.set(key, value),
      );
    }

    if (operation instanceof FormData) {
      requestHeaders.delete('Content-Type');
    } else {
      requestHeaders.set('Content-Type', 'application/json');
    }

    if (token) {
      requestHeaders.set('Authorization', \`Bearer \${token}\`);
    } else {
      requestHeaders.delete('Authorization');
    }

    const response = await this.fetchImplementation.call(globalThis, this.url, {
      ...this.requestOptions,
      ...requestInit,
      method: requestInit?.method ?? 'POST',
      headers: requestHeaders,
      body:
        operation instanceof FormData ? operation : JSON.stringify(operation),
    });

    const rawBody = await response.text();
    let payload: GraphqlResponsePayload | null = null;

    if (rawBody.trim().length > 0) {
      try {
        payload = JSON.parse(rawBody) as GraphqlResponsePayload;
      } catch {
        payload = null;
      }
    }

    return {
      status: response.status,
      statusText: response.statusText,
      payload,
      rawBody,
    };
  }

  private async resolveHeaders(): Promise<HeadersInit> {
    if (typeof this.headers === 'function') {
      return (await this.headers()) ?? {};
    }

    return this.headers ?? {};
  }

  private shouldRefreshToken(response: GraphqlResponse): boolean {
    if (response.status === 401) {
      return true;
    }

    return hasAuthenticationErrorInGraphqlPayload(response.payload);
  }

  private assertResponseIsSuccessful(response: GraphqlResponse) {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(\`\${response.statusText}: \${response.rawBody}\`);
    }

    if (response.payload === null) {
      throw new Error('Invalid JSON response');
    }

    return response.payload;
  }

  private async requestRefreshedAccessToken(): Promise<string | null> {
    const refreshAccessTokenFunction = (
      globalThis as {
        frontComponentHostCommunicationApi?: {
          requestAccessTokenRefresh?: () => Promise<string>;
        };
      }
    ).frontComponentHostCommunicationApi?.requestAccessTokenRefresh;

    if (typeof refreshAccessTokenFunction !== 'function') {
      return null;
    }

    if (!this.refreshAccessTokenPromise) {
      this.refreshAccessTokenPromise = refreshAccessTokenFunction()
        .then((refreshedAccessToken) => {
          if (
            typeof refreshedAccessToken !== 'string' ||
            refreshedAccessToken.length === 0
          ) {
            return null;
          }

          this.setAuthorizationToken(refreshedAccessToken);

          return refreshedAccessToken;
        })
        .catch((refreshError: unknown) => {
          console.error('Twenty client: token refresh failed', refreshError);

          return null;
        })
        .finally(() => {
          this.refreshAccessTokenPromise = null;
        });
    }

    return this.refreshAccessTokenPromise;
  }

  private setAuthorizationToken(token: string) {
    this.authorizationToken = token;

    const processEnvironment = getProcessEnvironment();

    processEnvironment[APP_ACCESS_TOKEN_ENV_KEY] = token;
  }
}
`,s=`${i}.tmp`;await v(s),await y(s);try{await Z({schema:e,output:s,scalarTypes:Le});let a=_(o,{apiClientName:`CoreApiClient`,defaultUrl:`\`\${process.env.${t.a}}/graphql\``,includeUploadFile:!0});await(0,n.appendFile)((0,r.join)(s,`index.ts`),a),await x(i),await b(s,i),await ze(i)}catch(e){throw await x(s),e}},Re=async({packageRoot:e,schema:t})=>{let i=(0,r.join)(e,`dist`,Q);await $({schema:t,outputPath:i}),await(0,n.copyFile)((0,r.join)(i,`index.mjs`),(0,r.join)(e,`dist`,`core.mjs`)),await(0,n.copyFile)((0,r.join)(i,`index.cjs`),(0,r.join)(e,`dist`,`core.cjs`))},ze=async e=>{let t=(0,r.join)(e,`index.ts`),a=(0,r.join)(e,`index.mjs`);await(0,i.build)({entryPoints:[t],outfile:a,bundle:!0,format:`esm`,platform:`node`,target:`node18`,sourcemap:!1,minify:!1}),await(0,i.build)({entryPoints:[t],outfile:(0,r.join)(e,`index.cjs`),bundle:!0,format:`cjs`,platform:`node`,target:`node18`,sourcemap:!1,minify:!1}),await(0,n.writeFile)((0,r.join)(e,`package.json`),JSON.stringify({type:`module`,main:`index.mjs`,module:`index.mjs`},null,2))},Be={DateTime:`string`,JSON:`Record<string, unknown>`,UUID:`string`},Ve=async({schema:e,outputPath:i,clientWrapperTemplateSource:a})=>{let o=a??`import type { TwentyClientRunAs } from '../shared/twenty-client-run-as.type';

// Ambient type stubs for the genql-generated code this template gets
// injected into. They enable full typecheck/lint on this file.
// __STRIPPED_DURING_INJECTION_START__
type QueryGenqlSelection = Record<string, unknown>;
type MutationGenqlSelection = Record<string, unknown>;
type GraphqlOperation = Record<string, unknown>;

type ClientOptions = Omit<RequestInit, 'body' | 'headers'> & {
  url?: string;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  fetcher?: (
    operation: GraphqlOperation | GraphqlOperation[],
  ) => Promise<unknown>;
  fetch?: typeof globalThis.fetch;
  batch?: unknown;
};

type Client = {
  query: (
    request: QueryGenqlSelection & { __name?: string },
  ) => Promise<unknown>;
  mutation: (
    request: MutationGenqlSelection & { __name?: string },
  ) => Promise<unknown>;
};

declare function createClient(options: ClientOptions): Client;

declare class GenqlError extends Error {
  constructor(errors: unknown, data: unknown);
}
// __STRIPPED_DURING_INJECTION_END__

const APP_ACCESS_TOKEN_ENV_KEY = 'TWENTY_APP_ACCESS_TOKEN';
const APP_APPLICATION_ACCESS_TOKEN_ENV_KEY =
  'TWENTY_APP_APPLICATION_ACCESS_TOKEN';
const API_KEY_ENV_KEY = 'TWENTY_API_KEY';

export type TwentyGeneratedClientOptions = ClientOptions & {
  runAs?: TwentyClientRunAs;
};

type ProcessEnvironment = Record<string, string | undefined>;

type GraphqlErrorPayloadEntry = {
  message?: string;
  extensions?: { code?: string };
};

type GraphqlResponsePayload = {
  data?: Record<string, unknown>;
  errors?: GraphqlErrorPayloadEntry[];
};

type GraphqlResponse = {
  status: number;
  statusText: string;
  payload: GraphqlResponsePayload | null;
  rawBody: string;
};

const getProcessEnvironment = (): ProcessEnvironment => {
  const processObject = (
    globalThis as { process?: { env?: ProcessEnvironment } }
  ).process;

  return processObject?.env ?? {};
};

const getTokenFromAuthorizationHeader = (
  authorizationHeader: string | undefined,
): string | null => {
  if (typeof authorizationHeader !== 'string') {
    return null;
  }

  const trimmedAuthorizationHeader = authorizationHeader.trim();

  if (trimmedAuthorizationHeader.length === 0) {
    return null;
  }

  if (trimmedAuthorizationHeader === 'Bearer') {
    return null;
  }

  if (trimmedAuthorizationHeader.startsWith('Bearer ')) {
    return trimmedAuthorizationHeader.slice('Bearer '.length).trim();
  }

  return trimmedAuthorizationHeader;
};

const getTokenFromHeaders = (
  headers: HeadersInit | undefined,
): string | null => {
  if (!headers) {
    return null;
  }

  if (headers instanceof Headers) {
    return getTokenFromAuthorizationHeader(
      headers.get('Authorization') ?? undefined,
    );
  }

  if (Array.isArray(headers)) {
    const matchedAuthorizationHeader = headers.find(
      ([headerName]) => headerName.toLowerCase() === 'authorization',
    );

    return getTokenFromAuthorizationHeader(matchedAuthorizationHeader?.[1]);
  }

  const headersRecord = headers as Record<string, string | undefined>;

  return getTokenFromAuthorizationHeader(
    headersRecord.Authorization ?? headersRecord.authorization,
  );
};

const hasAuthenticationErrorInGraphqlPayload = (
  payload: GraphqlResponsePayload | null,
): boolean => {
  if (!payload?.errors) {
    return false;
  }

  return payload.errors.some((graphqlError) => {
    return (
      graphqlError.extensions?.code === 'UNAUTHENTICATED' ||
      graphqlError.message?.toLowerCase() === 'unauthorized'
    );
  });
};

const defaultOptions: TwentyGeneratedClientOptions = {
  url: '__TWENTY_DEFAULT_URL__',
  headers: {
    'Content-Type': 'application/json',
  },
};

export class TwentyGeneratedClient {
  private client: Client;
  private url: string;
  private requestOptions: RequestInit;
  private headers: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  private fetchImplementation: typeof globalThis.fetch | null;
  private authorizationToken: string | null;
  private refreshAccessTokenPromise: Promise<string | null> | null = null;

  constructor(options?: TwentyGeneratedClientOptions) {
    const merged: TwentyGeneratedClientOptions = {
      ...defaultOptions,
      ...options,
    };

    const {
      url,
      headers,
      fetch: customFetchImplementation,
      fetcher: _fetcher,
      batch: _batch,
      runAs,
      ...requestOptions
    } = merged;

    this.url = url ?? '';
    this.requestOptions = requestOptions;
    this.headers = headers ?? {};
    this.fetchImplementation =
      customFetchImplementation ?? globalThis.fetch ?? null;

    const processEnvironment = getProcessEnvironment();
    const tokenFromHeaders = getTokenFromHeaders(
      typeof headers === 'function' ? undefined : headers,
    );

    // Priority: explicit header > the token for the requested access > api key
    // (legacy).
    this.authorizationToken =
      tokenFromHeaders ??
      processEnvironment[
        runAs === 'application'
          ? APP_APPLICATION_ACCESS_TOKEN_ENV_KEY
          : APP_ACCESS_TOKEN_ENV_KEY
      ] ??
      processEnvironment[API_KEY_ENV_KEY] ??
      null;

    this.client = createClient({
      ...merged,
      headers: undefined,
      fetcher: async (operation) =>
        this.executeGraphqlRequestWithOptionalRefresh({
          operation,
        }),
    });
  }

  query<R extends QueryGenqlSelection>(request: R & { __name?: string }) {
    return this.client.query(request);
  }

  mutation<R extends MutationGenqlSelection>(request: R & { __name?: string }) {
    return this.client.mutation(request);
  }

  // __UPLOAD_FILE_START__
  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    contentType: string = 'application/octet-stream',
    fieldMetadataUniversalIdentifier: string,
  ): Promise<{
    id: string;
    path: string;
    size: number;
    createdAt: string;
    url: string;
  }> {
    const form = new FormData();

    form.append(
      'operations',
      JSON.stringify({
        query: \`mutation UploadFilesFieldFileByUniversalIdentifier($file: Upload!, $fieldMetadataUniversalIdentifier: String!) {
        uploadFilesFieldFileByUniversalIdentifier(file: $file, fieldMetadataUniversalIdentifier: $fieldMetadataUniversalIdentifier) { id path size createdAt url }
      }\`,
        variables: {
          file: null,
          fieldMetadataUniversalIdentifier,
        },
      }),
    );
    form.append('map', JSON.stringify({ '0': ['variables.file'] }));
    form.append(
      '0',
      new Blob([fileBuffer as BlobPart], { type: contentType }),
      filename,
    );

    const result = await this.executeGraphqlRequestWithOptionalRefresh({
      operation: form,
      headers: {},
      requestInit: {
        method: 'POST',
      },
    });

    if (result.errors) {
      throw new GenqlError(result.errors, result.data);
    }

    const data = result.data as Record<string, unknown>;

    return data.uploadFilesFieldFileByUniversalIdentifier as {
      id: string;
      path: string;
      size: number;
      createdAt: string;
      url: string;
    };
  }
  // __UPLOAD_FILE_END__

  private async executeGraphqlRequestWithOptionalRefresh({
    operation,
    headers,
    requestInit,
  }: {
    operation: GraphqlOperation | GraphqlOperation[] | FormData;
    headers?: HeadersInit;
    requestInit?: RequestInit;
  }) {
    const firstResponse = await this.executeGraphqlRequest({
      operation,
      headers,
      requestInit,
      token: this.authorizationToken,
    });

    if (this.shouldRefreshToken(firstResponse)) {
      const refreshedAccessToken = await this.requestRefreshedAccessToken();

      if (refreshedAccessToken) {
        const retryResponse = await this.executeGraphqlRequest({
          operation,
          headers,
          requestInit,
          token: refreshedAccessToken,
        });

        return this.assertResponseIsSuccessful(retryResponse);
      }
    }

    return this.assertResponseIsSuccessful(firstResponse);
  }

  private async executeGraphqlRequest({
    operation,
    headers,
    requestInit,
    token,
  }: {
    operation: GraphqlOperation | GraphqlOperation[] | FormData;
    headers?: HeadersInit;
    requestInit?: RequestInit;
    token: string | null;
  }): Promise<GraphqlResponse> {
    if (!this.fetchImplementation) {
      throw new Error(
        'Global \`fetch\` function is not available, ' +
          'pass a fetch implementation to the Twenty client',
      );
    }

    const resolvedHeaders = await this.resolveHeaders();
    const requestHeaders = new Headers(resolvedHeaders);

    if (headers) {
      new Headers(headers).forEach((value, key) =>
        requestHeaders.set(key, value),
      );
    }

    if (operation instanceof FormData) {
      requestHeaders.delete('Content-Type');
    } else {
      requestHeaders.set('Content-Type', 'application/json');
    }

    if (token) {
      requestHeaders.set('Authorization', \`Bearer \${token}\`);
    } else {
      requestHeaders.delete('Authorization');
    }

    const response = await this.fetchImplementation.call(globalThis, this.url, {
      ...this.requestOptions,
      ...requestInit,
      method: requestInit?.method ?? 'POST',
      headers: requestHeaders,
      body:
        operation instanceof FormData ? operation : JSON.stringify(operation),
    });

    const rawBody = await response.text();
    let payload: GraphqlResponsePayload | null = null;

    if (rawBody.trim().length > 0) {
      try {
        payload = JSON.parse(rawBody) as GraphqlResponsePayload;
      } catch {
        payload = null;
      }
    }

    return {
      status: response.status,
      statusText: response.statusText,
      payload,
      rawBody,
    };
  }

  private async resolveHeaders(): Promise<HeadersInit> {
    if (typeof this.headers === 'function') {
      return (await this.headers()) ?? {};
    }

    return this.headers ?? {};
  }

  private shouldRefreshToken(response: GraphqlResponse): boolean {
    if (response.status === 401) {
      return true;
    }

    return hasAuthenticationErrorInGraphqlPayload(response.payload);
  }

  private assertResponseIsSuccessful(response: GraphqlResponse) {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(\`\${response.statusText}: \${response.rawBody}\`);
    }

    if (response.payload === null) {
      throw new Error('Invalid JSON response');
    }

    return response.payload;
  }

  private async requestRefreshedAccessToken(): Promise<string | null> {
    const refreshAccessTokenFunction = (
      globalThis as {
        frontComponentHostCommunicationApi?: {
          requestAccessTokenRefresh?: () => Promise<string>;
        };
      }
    ).frontComponentHostCommunicationApi?.requestAccessTokenRefresh;

    if (typeof refreshAccessTokenFunction !== 'function') {
      return null;
    }

    if (!this.refreshAccessTokenPromise) {
      this.refreshAccessTokenPromise = refreshAccessTokenFunction()
        .then((refreshedAccessToken) => {
          if (
            typeof refreshedAccessToken !== 'string' ||
            refreshedAccessToken.length === 0
          ) {
            return null;
          }

          this.setAuthorizationToken(refreshedAccessToken);

          return refreshedAccessToken;
        })
        .catch((refreshError: unknown) => {
          console.error('Twenty client: token refresh failed', refreshError);

          return null;
        })
        .finally(() => {
          this.refreshAccessTokenPromise = null;
        });
    }

    return this.refreshAccessTokenPromise;
  }

  private setAuthorizationToken(token: string) {
    this.authorizationToken = token;

    const processEnvironment = getProcessEnvironment();

    processEnvironment[APP_ACCESS_TOKEN_ENV_KEY] = token;
  }
}
`;await v(i),await y(i),await Z({schema:e,output:i,scalarTypes:{...Be,Upload:`File`}});let s=_(o,{apiClientName:`MetadataApiClient`,defaultUrl:`\`\${process.env.${t.a}}/metadata\``,includeUploadFile:!0});await(0,n.appendFile)((0,r.join)(i,`index.ts`),s)};exports.GENERATED_CORE_DIR=Q,exports.generateCoreClientFromSchema=$,exports.generateMetadataClient=Ve,exports.replaceCoreClient=Re;