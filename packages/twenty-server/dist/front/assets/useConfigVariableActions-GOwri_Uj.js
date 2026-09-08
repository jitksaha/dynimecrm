import{t as y}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{t as C}from"./lib-C3IpGLsk.js";import{t as i}from"./useMutation-Ds2Pb-th.js";import{Ar as g,ci as p,ef as u,jr as D}from"./index-BiDxWqTz.js";import{t as A}from"./useApolloAdminClient-CKVGOUpb.js";var r=C`
  query GetDatabaseConfigVariable($key: String!) {
    getDatabaseConfigVariable(key: $key) {
      name
      description
      value
      isSensitive
      isEnvOnly
      type
      options
      source
    }
  }
`,w=a=>{const t=A(),{refetch:n}=u(),[o]=i(p,{client:t}),[l]=i(g,{client:t}),[f]=i(D,{client:t}),c=async(e,b)=>{if(e===null||typeof e=="string"&&e===""||Array.isArray(e)&&e.length===0){await s();return}b?await o({variables:{key:a,value:e},refetchQueries:[{query:r,variables:{key:a}}]}):await l({variables:{key:a,value:e},refetchQueries:[{query:r,variables:{key:a}}]}),await n()},s=async e=>{y(e)&&e.preventDefault(),await f({variables:{key:a},refetchQueries:[{query:r,variables:{key:a}}]}),await n()};return{handleUpdateVariable:c,handleDeleteVariable:s}};export{r as n,w as t};
