import{o as b}from"./chunk-ChpBd9eV.js";import{t as P}from"./jsx-runtime-BmDUFisN.js";import{t as B}from"./react-M6yZRsSc.js";import{s as i}from"./types-BVPyJxl2-BGV2ej5I.js";import{$ as y}from"./utils-wA24uq8M-QF6HonJV.js";import{t as I}from"./useNavigateSettings-EGfXMFNd.js";import{r as W}from"./dist-C0k9q2wC.js";import{t as $}from"./useSnackBar-BbgS33FW.js";import{t as S}from"./typography-DK5JiCH--B1G2Qv9H.js";import{d as m}from"./layout-B73JJnBU-DCDyPwRC.js";import{n as k}from"./lib-C3IpGLsk.js";import{t as q}from"./useQuery-CqCz0Srw.js";import{t as H}from"./useMutation-Ds2Pb-th.js";import{t as c}from"./SettingsTextInput-o5Crlgkn.js";import{t as M}from"./useApolloCoreClient-cYHBUwoT.js";import{t as Q}from"./downloadFile-Sco-AQ-M.js";import{Xc as R,al as U,nl as F,tl as V}from"./index-BiDxWqTz.js";import{i as X,n as z,r as Y,t as Z}from"./getDpaPreview-BZ8f28cG.js";var t=P(),r=b(B(),1),J=k`
  mutation GenerateSignedDpa($input: GenerateSignedDpaInput!) {
    generateSignedDpa(input: $input) {
      downloadUrl
      agreement {
        id
        type
        templateVersion
        region
        processorEntity
        customerLegalEntityName
        signatoryName
        signatoryTitle
        acceptedByEmail
        acceptedAt
        createdAt
      }
    }
  }
`,ye=()=>{const{i18n:e,_:K}=W(),d=I(),{enqueueSuccessSnackBar:h,enqueueErrorSnackBar:E}=$(),p=M(),[n,v]=(0,r.useState)(""),[s,N]=(0,r.useState)(""),[o,x]=(0,r.useState)(""),[u,g]=(0,r.useState)(!1),{data:j,loading:D}=q(Z,{client:p}),[w]=H(J,{client:p,refetchQueries:[{query:z}],awaitRefetchQueries:!0}),a=j?.dpaPreview,_=n.trim()!==""&&s.trim()!==""&&o.trim()!==""&&!a?.notice&&!u,L=async()=>{if(!_)return;g(!0);const f=n.trim(),A=s.trim(),T=o.trim();try{const{data:C}=await w({variables:{input:{customerLegalEntityName:f,signatoryName:A,signatoryTitle:T}}}),l=C?.generateSignedDpa;if(!l)throw new Error("No result returned");const G=f.replace(/[/\\:*?"<>|]+/g,"-");await Q(l.downloadUrl,`Twenty-DPA-${l.agreement.templateVersion}-${G}.pdf`),h({message:e._({id:"Z2Wg9g"})}),d(i.LegalDpa)}catch{E({message:e._({id:"NonvA5"})})}finally{g(!1)}};return D?(0,t.jsx)(U,{}):(0,t.jsx)(F,{title:e._({id:"H3rta9"}),links:[{children:e._({id:"pmUArF"}),href:y(i.General)},{children:e._({id:"vifyyw"}),href:y(i.LegalDpa)},{children:e._({id:"ziAjHi"})}],actionButton:(0,t.jsx)(R,{isSaveDisabled:!_,isLoading:u,onCancel:()=>d(i.LegalDpa),onSave:L}),children:(0,t.jsxs)(V,{children:[a?.notice&&(0,t.jsx)(m,{children:(0,t.jsx)(Y,{text:a.notice})}),(0,t.jsxs)(m,{children:[(0,t.jsx)(S,{title:e._({id:"mmGBWT"}),description:e._({id:"Ya1wb4"})}),(0,t.jsx)(c,{instanceId:"dpa-legal-entity-name",label:e._({id:"nc/jNe"}),placeholder:e._({id:"BXMLsb"}),value:n,onChange:v,fullWidth:!0}),(0,t.jsx)(c,{instanceId:"dpa-signatory-name",label:e._({id:"3yzHpm"}),placeholder:e._({id:"A1CyH/"}),value:s,onChange:N,fullWidth:!0}),(0,t.jsx)(c,{instanceId:"dpa-signatory-title",label:e._({id:"a6TaW9"}),placeholder:e._({id:"Gpb1xF"}),value:o,onChange:x,fullWidth:!0})]}),a&&(0,t.jsxs)(m,{children:[(0,t.jsx)(S,{title:e._({id:"rdUucN"}),description:e._({id:"21Xjwu"})}),(0,t.jsx)(X,{document:a})]})]})})};export{ye as SettingsLegalDpaNew};
