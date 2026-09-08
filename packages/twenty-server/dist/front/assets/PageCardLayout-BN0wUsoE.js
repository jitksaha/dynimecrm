import{o as z}from"./chunk-ChpBd9eV.js";import{t as un}from"./jsx-runtime-BmDUFisN.js";import{t as pn}from"./react-M6yZRsSc.js";import{t as In}from"./react-dom-CZ8aPE8M.js";import{m as x,s as C}from"./types-BVPyJxl2-BGV2ej5I.js";import{t as m}from"./dist-x6yBUqMs.js";import{s as Cn}from"./theme-constants-C0dRLi4g-CgtKu309.js";import{t as Sn}from"./useNavigationDrawerExpanded-Do9RddDg.js";import{t as o}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{$ as O,fr as fn,lt as An,zr as $}from"./utils-wA24uq8M-QF6HonJV.js";import{t as Q}from"./createAtomState-DAd3f6cd.js";import{t as y}from"./useAtomStateValue-CwQXVWpa.js";import{t as vn}from"./useIsMobile-CoFytD0g.js";import{t as K}from"./useWorkspaceSurface-CK-kB64s.js";import{t as l}from"./dist-Cg5OofxW.js";import{t as L}from"./IconX-DS8MLpvA.js";import{t as _n}from"./IconExternalLink-ulJUGaAH.js";import{t as Y}from"./IconRefresh-C-yTaP7q.js";import{a as yn,o as U,t as Z}from"./useNavigateSettings-EGfXMFNd.js";import{r as X}from"./dist-C0k9q2wC.js";import{t as En}from"./NavigationDrawerCollapseButton-BBQFHqbP.js";import{D as gn,I as J,q as Nn}from"./feedback-CMVzB4J0-DukTodeP.js";import{a as Tn,s as hn}from"./useAvailableComponentInstanceIdOrThrow-71L1CDtP.js";import{t as Pn}from"./useSnackBarOnQueryError-q9FVXrTB.js";import{t as nn}from"./useRedirect-DMLV2ydH.js";import{t as xn}from"./useAtomComponentStateValue-CO6TMomU.js";import{Mr as E,oi as h,y as en}from"./graphql-Bmj7vfTz.js";import{c as Mn,i as On,n as Dn,o as Bn,r as bn,s as Rn,t as jn,u as g}from"./useCreditUpgradeAction-D0XWD5dq.js";import{t as b}from"./useApolloClient-zMx7IuLG.js";import{t as N}from"./lib-C3IpGLsk.js";import{t as T}from"./useQuery-CqCz0Srw.js";import{t as tn}from"./useMutation-Ds2Pb-th.js";import{t as kn}from"./currentUserState-hqMuY63z.js";import{t as an}from"./useModal-hvKInX6K.js";import{t as Ln}from"./ConfirmationModal-DDK1x-A5.js";import{t as Un}from"./currentWorkspaceState-BnKnraKc.js";import{t as F}from"./BillingCheckoutSessionDefaultValue-COcWdAed.js";import{t as Fn}from"./useHandleCheckoutSession-Ct2HVp_R.js";import{t as sn}from"./useApolloCoreClient-cYHBUwoT.js";import{t as wn}from"./useDateTimeFormat-o3rJgEj5.js";import{t as rn}from"./useSetAtomComponentState-Dy2OWY7U.js";import{t as Gn}from"./useTriggerApiOAuth-DcYRoAzx.js";var e=un(),S=z(pn(),1),Wn=(0,S.createContext)({title:null,actions:null}),Hn=()=>(0,S.useContext)(Wn),w=z(In(),1),Vn=()=>({centerTitle:n})=>n?"minmax(0, 1fr) minmax(0, auto) minmax(0, 1fr)":"minmax(0, auto) minmax(min-content, 1fr)",qn=m("div")({name:"StyledHeader",class:"skbu4f7",propsAsIs:!1,vars:{"skbu4f7-0":[Vn()]}}),zn=m("div")({name:"StyledLeft",class:"s5vs2pt",propsAsIs:!1}),$n=()=>({titleColor:n})=>n??Cn.font.color.primary,R=m("div")({name:"StyledTitle",class:"s9pz9l0",propsAsIs:!1,vars:{"s9pz9l0-0":[$n()]}}),Qn=()=>R,Kn=m(Qn())({name:"StyledCenteredTitle",class:"s1a1o676",propsAsIs:!0}),Yn=()=>({centerTitle:n})=>n?3:2,Zn=m("div")({name:"StyledRight",class:"sixn1z5",propsAsIs:!1,vars:{"sixn1z5-0":[Yn()]}}),Xn=()=>R,Jn=m(Xn())({name:"StyledSurfaceTitle",class:"spkh7og",propsAsIs:!0}),ne=m("div")({name:"StyledSurfaceActions",class:"s1oe5pi1",propsAsIs:!1}),Tt=({links:n,breadcrumb:t,icon:a,title:s,tag:r,actionButton:i,centerTitle:c=!1,titleColor:d})=>{const u=vn(),f=Sn(),A=K(),p=Hn(),v=o(a)||o(s)||o(r),_=c&&v,D=(0,e.jsxs)(e.Fragment,{children:[a,o(s)&&s,r]}),k=o(t)?t:v?D:o(n)?(0,e.jsx)(U,{links:n}):null;return A.type==="side-panel"?(0,e.jsxs)(e.Fragment,{children:[o(p.title)&&o(k)&&(0,w.createPortal)((0,e.jsx)(Jn,{titleColor:d,children:k}),p.title),o(p.actions)&&o(i)&&(0,w.createPortal)((0,e.jsx)(ne,{"data-click-outside-id":"page-action-container",children:i}),p.actions)]}):(0,e.jsxs)(qn,{centerTitle:_,children:[(0,e.jsxs)(zn,{children:[!u&&!f&&(0,e.jsx)(En,{direction:"right"}),o(t)?t:o(n)&&(0,e.jsx)(U,{links:n}),!_&&v&&(0,e.jsx)(R,{titleColor:d,children:D})]}),_&&(0,e.jsx)(Kn,{titleColor:d,children:D}),(0,e.jsx)(Zn,{centerTitle:_,"data-click-outside-id":yn,children:i})]})},M=(function(n){return n.ONGOING_CREATION="ONGOING_CREATION",n.PENDING_CREATION="PENDING_CREATION",n.CREATED="CREATED",n.ACTIVE="ACTIVE",n.INACTIVE="INACTIVE",n.SUSPENDED="SUSPENDED",n})({}),ee=[M.CREATED,M.ACTIVE,M.SUSPENDED],ht=n=>o(n)&&ee.includes(n.activationStatus),on=hn(),j=Tn({key:"informationBannerIsOpenComponentState",defaultValue:!0,componentInstanceContext:on}),te=m("div")({name:"StyledText",class:"s128d8pp",propsAsIs:!1}),ae=()=>J,se=m(ae())({name:"StyledInvertedIconButton",class:"so4xzke",propsAsIs:!0}),re=()=>({hasCloseButton:n})=>n?"24px":"0",oe=m("div")({name:"StyledContent",class:"s1t9d1p2",propsAsIs:!1,vars:{"s1t9d1p2-0":[re()]}}),I=({message:n,color:t="blue",variant:a="primary",buttonTitle:s,buttonIcon:r,buttonOnClick:i,isButtonDisabled:c=!1,onClose:d,componentInstanceId:u})=>{const f=xn(j,u),A=a==="primary",p=t==="danger"?"danger":"blue";return(0,e.jsx)(on.Provider,{value:{instanceId:u},children:f&&(0,e.jsxs)(gn,{color:t,variant:a,children:[(0,e.jsxs)(oe,{hasCloseButton:!!d,children:[(0,e.jsx)(te,{children:n}),s&&i&&(0,e.jsx)(Nn,{variant:"secondary",accent:p,title:s,Icon:r,size:"small",inverted:A,onClick:i,disabled:c})]}),d&&(A?(0,e.jsx)(se,{Icon:L,size:"small",variant:"tertiary",onClick:d,ariaLabel:l._({id:"uYADQM"})}):(0,e.jsx)(J,{Icon:L,size:"small",variant:"tertiary",accent:p,onClick:d,ariaLabel:l._({id:"uYADQM"})}))]})})},ie=()=>{const{redirect:n}=nn(),{data:t,loading:a,error:s}=T(en,{variables:{returnUrlPath:O(C.Billing)}});Pn(s);const{[E.WORKSPACE]:r}=g(),i=()=>{o(t)&&o(t.billingPortalSession.url)&&n(t.billingPortalSession.url)};return(0,e.jsx)(I,{componentInstanceId:"information-banner-billing-subscription-paused",color:"danger",variant:"secondary",message:r?l._({id:"y985qL"}):l._({id:"wN0jHF"}),buttonTitle:r?l._({id:"EkH9pt"}):void 0,buttonOnClick:()=>i(),isButtonDisabled:a||!o(t)})},B="information-banner-end-trial-period-modal",ce=()=>{const{endTrialPeriod:n,isLoading:t}=On(),{i18n:a,_:s}=X(),{openModal:r}=an(),{[E.BILLING]:i}=g(),c=y(Bn);return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(I,{componentInstanceId:"information-banner-end-trial-period",color:"danger",variant:"secondary",message:i?a._({id:"QEUZoG"}):a._({id:"cByGGA"}),buttonTitle:i?c===!1?a._({id:"NKMrde"}):a._({id:"k1i50B"}):void 0,buttonOnClick:()=>r(B),isButtonDisabled:t}),i&&(c===!1?(0,e.jsx)(Mn,{modalInstanceId:B,onPaymentMethodAdded:async()=>{await n({skipPaymentMethodRedirect:!0})}}):(0,e.jsx)(Rn,{modalInstanceId:B,hasPaymentMethod:c,onConfirmClick:async()=>{await n()},loading:t}))]})},de=()=>{const{redirect:n}=nn(),{data:t,loading:a}=T(en,{variables:{returnUrlPath:O(C.Billing)}}),{[E.WORKSPACE]:s}=g(),r=()=>{o(t)&&o(t.billingPortalSession.url)&&n(t.billingPortalSession.url)};return(0,e.jsx)(I,{componentInstanceId:"information-banner-fail-payment-info",color:"danger",variant:"secondary",message:s?l._({id:"3u/3zO"}):l._({id:"s0kiVA"}),buttonTitle:s?l._({id:"XeFxgX"}):void 0,buttonOnClick:()=>r(),isButtonDisabled:a||!o(t)})},le=()=>{const{handleCheckoutSession:n,isSubmitting:t}=Fn({recurringInterval:F.interval,plan:F.plan,requirePaymentMethod:!0,successUrlPath:O(C.Billing)}),{[E.WORKSPACE]:a}=g();return(0,e.jsx)(I,{componentInstanceId:"information-banner-no-billing-subscription",color:"danger",variant:"secondary",message:a?l._({id:"oC6WBs"}):l._({id:"QBTEtW"}),buttonTitle:a?l._({id:"EDl9kS"}):void 0,buttonOnClick:()=>n(),isButtonDisabled:t})},me=Q({key:"enterpriseInstanceTypeState",defaultValue:$.PRODUCTION}),ue=()=>{const n=y(me);return!o(n)||n===$.PRODUCTION?null:(0,e.jsx)(I,{componentInstanceId:"information-banner-non-production-instance",variant:"secondary",message:l._({id:"MGWsz+"})})},pe=Q({key:"maintenanceModeState",defaultValue:null}),Ie=N`
  mutation DismissMaintenanceModeBanner {
    dismissMaintenanceModeBanner
  }
`,Ce=N`
  query IsMaintenanceModeBannerDismissed {
    isMaintenanceModeBannerDismissed
  }
`,Se=({enabled:n,maintenanceStartAt:t})=>{const a=sn(),[s,r]=(0,S.useState)(!1),{data:i,loading:c,refetch:d}=T(Ce,{client:a,skip:!n,fetchPolicy:"network-only"}),[u]=tn(Ie,{client:a});return(0,S.useEffect)(()=>{if(!n){r(!1);return}},[n]),(0,S.useEffect)(()=>{n&&(r(!1),d())},[n,t,d]),{dismissBanner:async()=>{await u(),r(!0)},isDismissed:s||i?.isMaintenanceModeBannerDismissed===!0,isLoading:n?c:!1}},G=(n,t)=>fn.Instant.from(n).toZonedDateTimeISO(t).toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"numeric",timeZoneName:"short"}),fe=()=>{const n=y(pe),{timeZone:t}=wn(),{dismissBanner:a,isDismissed:s,isLoading:r}=Se({enabled:o(n),maintenanceStartAt:n?.startAt});if(!o(n)||r||s)return null;const i=G(n.startAt,t),c=G(n.endAt,t),d=l._({id:"f5yMQc",values:{startFormatted:i,endFormatted:c}}),u=An(n.link?.trim());return(0,e.jsx)(I,{componentInstanceId:"information-banner-maintenance",variant:"secondary",message:d,buttonTitle:o(u)?l._({id:"zwWKhA"}):void 0,buttonIcon:o(u)?_n:void 0,buttonOnClick:o(u)?()=>window.open(u,"_blank","noopener,noreferrer"):void 0,onClose:a})},Ae=N`
  query MyConnectedAccounts {
    myConnectedAccounts {
      id
      handle
      provider
      authFailedAt
      archivedAt
      scopes
      handleAliases
      lastSignedInAt
      userWorkspaceId
      connectionProviderId
      name
      visibility
      lastCredentialsRefreshedAt
      connectionParameters {
        IMAP {
          host
          port
          connectionSecurity
          username
        }
        SMTP {
          host
          port
          connectionSecurity
          username
        }
        CALDAV {
          host
          username
        }
      }
      createdAt
      updatedAt
    }
  }
`,ve=N`
  query MyCalendarChannels($connectedAccountId: UUID) {
    myCalendarChannels(connectedAccountId: $connectedAccountId) {
      id
      handle
      visibility
      syncStatus
      syncStage
      syncStageStartedAt
      isContactAutoCreationEnabled
      contactAutoCreationPolicy
      isSyncEnabled
      connectedAccountId
      createdAt
      updatedAt
    }
  }
`,_e=()=>{const{data:n,loading:t}=T(ve,{client:b()});return{channels:n?.myCalendarChannels??[],loading:t}},ye=N`
  query MyMessageChannels($connectedAccountId: UUID) {
    myMessageChannels(connectedAccountId: $connectedAccountId) {
      id
      handle
      displayName
      visibility
      type
      isContactAutoCreationEnabled
      contactAutoCreationPolicy
      messageFolderImportPolicy
      excludeNonProfessionalEmails
      excludeGroupEmails
      isSyncEnabled
      syncStatus
      syncStage
      syncStageStartedAt
      connectedAccountId
      connectedAccount {
        id
        handle
      }
      createdAt
      updatedAt
    }
  }
`,Ee=()=>{const{data:n,loading:t}=T(ye,{client:b()});return{channels:n?.myMessageChannels??[],loading:t}},ge=new Set([x.GOOGLE,x.MICROSOFT,x.IMAP_SMTP_CALDAV]),Ne=()=>{const{data:n,loading:t}=T(Ae,{client:b()}),{channels:a,loading:s}=Ee(),{channels:r,loading:i}=_e();return{accounts:(0,S.useMemo)(()=>n?.myConnectedAccounts?n.myConnectedAccounts.filter(c=>ge.has(c.provider)).map(c=>({...c,messageChannels:a.filter(d=>d.connectedAccountId===c.id),calendarChannels:r.filter(d=>d.connectedAccountId===c.id)})):[],[n,a,r]),loading:t||s||i}},cn=n=>{const t=y(kn)?.userVars?.[n]?.[0],{accounts:a}=Ne();return{accountToReconnect:a.find(s=>s.id===t)}},Te=N`
  mutation DismissReconnectAccountBanner($connectedAccountId: UUID!) {
    dismissReconnectAccountBanner(connectedAccountId: $connectedAccountId)
  }
`,dn=n=>{const[t]=tn(Te,{client:sn()}),a=rn(j,n);return{dismissReconnectAccountBanner:async r=>{await t({variables:{connectedAccountId:r}}),a(!1)}}},ln=(function(n){return n.ACCOUNTS_TO_RECONNECT_INSUFFICIENT_PERMISSIONS="ACCOUNTS_TO_RECONNECT_INSUFFICIENT_PERMISSIONS",n.ACCOUNTS_TO_RECONNECT_EMAIL_ALIASES="ACCOUNTS_TO_RECONNECT_EMAIL_ALIASES",n})({}),mn=()=>{const{triggerApisOAuth:n}=Gn(),t=Z();return{triggerProviderReconnect:(0,S.useCallback)(async(a,s,r)=>{if(a===x.IMAP_SMTP_CALDAV){if(!s){t(C.NewImapSmtpCaldavConnection);return}t(C.EditImapSmtpCaldavConnection,{connectedAccountId:s});return}await n(a,{...r,redirectLocation:O(C.Accounts)})},[n,t])}},W="information-banner-reconnect-account-email-aliases",he=()=>{const{accountToReconnect:n}=cn(ln.ACCOUNTS_TO_RECONNECT_EMAIL_ALIASES),{triggerProviderReconnect:t}=mn(),{dismissReconnectAccountBanner:a}=dn(W);if(!n)return null;const s=async()=>{await a(n.id)},r=n.handle;return(0,e.jsx)(I,{componentInstanceId:W,variant:"secondary",message:l._({id:"qg68zg",values:{mailboxHandle:r}}),buttonTitle:l._({id:"gcoiFh"}),buttonIcon:Y,buttonOnClick:()=>t(n.provider,n.id),onClose:s})},H="information-banner-reconnect-account-insufficient-permissions",Pe=()=>{const{accountToReconnect:n}=cn(ln.ACCOUNTS_TO_RECONNECT_INSUFFICIENT_PERMISSIONS),{triggerProviderReconnect:t}=mn(),{dismissReconnectAccountBanner:a}=dn(H);if(!n)return null;const s=async()=>{await a(n.id)},r=n.handle;return(0,e.jsx)(I,{componentInstanceId:H,variant:"secondary",message:l._({id:"ZS+BPb",values:{mailboxHandle:r}}),buttonTitle:l._({id:"gcoiFh"}),buttonIcon:Y,buttonOnClick:()=>t(n.provider,n.id),onClose:s})},xe=n=>y(Un)?.activationStatus===n,V="information-banner-no-more-credits",q="information-banner-upgrade-credit-plan-modal",Me=()=>{const{i18n:n,_:t}=X(),{[E.BILLING]:a}=g(),s=Z(),{openModal:r}=an(),i=rn(j,V),{nextPrice:c,nextResourceCreditsAmount:d,nextResourceCreditPrice:u,nextTierInterval:f,upgradeCreditPlan:A,isUpgrading:p}=jn(),v=a&&o(c),_=a?v?()=>r(q):()=>s(C.Billing):void 0;return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(I,{componentInstanceId:V,color:"danger",variant:"secondary",message:a?n._({id:"2rAG3K"}):n._({id:"iSuLEw"}),buttonTitle:a?n._({id:"tIoZo5"}):void 0,buttonOnClick:_,isButtonDisabled:p,onClose:()=>i(!1)}),v&&(0,e.jsx)(Ln,{modalInstanceId:q,title:n._({id:"Et23WT"}),subtitle:n._({id:"nCRRVY",values:{0:d??"",1:u??"",2:f??""}}),onConfirmClick:A,confirmButtonText:n._({id:"kwkhPe"}),confirmButtonAccent:"blue",loading:p})]})},Oe=m("div")({name:"StyledInformationBannerWrapper",class:"s1qhyhf",propsAsIs:!1}),De=()=>{const n=bn(),t=g()[E.CONNECTED_ACCOUNTS],a=xe(M.SUSPENDED),s=y(Dn),r=a&&n===h.Paused,i=a&&!o(n),c=n===h.PastDue||n===h.Unpaid,d=s&&n===h.Trialing;return(0,e.jsxs)(Oe,{children:[(0,e.jsx)(ue,{}),(0,e.jsx)(fe,{}),t&&(0,e.jsx)(Pe,{}),t&&(0,e.jsx)(he,{}),r&&(0,e.jsx)(ie,{}),i&&(0,e.jsx)(le,{}),c&&(0,e.jsx)(de,{}),d&&(0,e.jsx)(ce,{}),!a&&!c&&!d&&s&&(0,e.jsx)(Me,{})]})},Be=m("div")({name:"StyledRoot",class:"s1fsgade",propsAsIs:!1}),be=m("div")({name:"StyledMainCardWrapper",class:"s18h5wyx",propsAsIs:!1}),Re=m("div")({name:"StyledCard",class:"s9iz60d",propsAsIs:!1}),je=m("div")({name:"StyledBodyContent",class:"s1tjxzq8",propsAsIs:!1}),ke=m("div")({name:"StyledSidePanelSurface",class:"s72opd7",propsAsIs:!1}),P=m("div")({name:"StyledPrintHidden",class:"s11skfdf",propsAsIs:!1}),Pt=({header:n,secondaryBar:t,children:a,showInformationBanner:s=!0})=>{const r=K(),i=(0,e.jsxs)(je,{children:[s&&r.type==="main"&&(0,e.jsx)(P,{children:(0,e.jsx)(De,{})}),a]});return r.type==="side-panel"?(0,e.jsxs)(ke,{"data-page-surface":"side-panel",children:[n,(0,e.jsx)(P,{children:t}),i]}):(0,e.jsx)(Be,{"data-page-surface":"main",children:(0,e.jsx)(be,{children:(0,e.jsxs)(Re,{children:[(0,e.jsx)(P,{children:n}),(0,e.jsx)(P,{children:t}),i]})})})};export{Ee as a,ve as c,me as d,I as f,Wn as g,Tt as h,Ne as i,Ae as l,M as m,xe as n,ye as o,ht as p,mn as r,_e as s,Pt as t,pe as u};
