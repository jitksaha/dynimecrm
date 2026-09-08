import{o as m}from"./chunk-ChpBd9eV.js";import{t as u}from"./react-M6yZRsSc.js";import{m as d}from"./types-BVPyJxl2-BGV2ej5I.js";import{l}from"./PageCardLayout-BN0wUsoE.js";import{t as f}from"./useRedirect-DMLV2ydH.js";import{jn as C}from"./graphql-Bmj7vfTz.js";import{t as A}from"./useApolloClient-zMx7IuLG.js";import{t as T}from"./lib-C3IpGLsk.js";import{t as c}from"./useQuery-CqCz0Srw.js";import{t as P}from"./useMutation-Ds2Pb-th.js";import{t as _}from"./config-B1E7I59J.js";var h=T`
  query ApplicationConnectionProviders($applicationId: UUID!) {
    applicationConnectionProviders(applicationId: $applicationId) {
      id
      applicationId
      type
      name
      displayName
      oauth {
        scopes
        isClientCredentialsConfigured
      }
    }
  }
`,M=t=>{const{data:e,loading:r,refetch:o}=c(h,{skip:!t,variables:{applicationId:t??""},fetchPolicy:"cache-first"});return{connectionProviders:e?.applicationConnectionProviders??[],loading:r,refetch:o}},$=()=>{const{data:t,loading:e,refetch:r}=c(l,{client:A(),fetchPolicy:"cache-and-network"});return{accounts:(t?.myConnectedAccounts??[]).filter(o=>o.provider===d.APP),loading:e,refetch:r}},v=m(u(),1),q=()=>{const[t]=P(C),{redirect:e}=f();return{triggerAppOAuth:(0,v.useCallback)(async({applicationId:r,providerName:o,visibility:p,reconnectingConnectedAccountId:a,redirectLocation:i})=>{const s=(await t()).data?.generateTransientToken.transientToken.token;if(!s)return;const n=new URLSearchParams({applicationId:r,providerName:o,transientToken:s,visibility:p});a&&n.set("reconnectingConnectedAccountId",a),i&&n.set("redirectLocation",i),e(`${_}/auth/apps/authorize?${n.toString()}`)},[t,e])}};export{$ as n,M as r,q as t};
