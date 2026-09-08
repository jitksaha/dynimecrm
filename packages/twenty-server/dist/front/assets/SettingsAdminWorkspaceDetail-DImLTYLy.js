import{o as Ee}from"./chunk-ChpBd9eV.js";import{t as Te}from"./jsx-runtime-BmDUFisN.js";import{t as Re}from"./react-M6yZRsSc.js";import{U as De}from"./utilities-Dwo-CMN9-B4xlzUrU.js";import{U as Ne,s as Y}from"./types-BVPyJxl2-BGV2ej5I.js";import{t as R}from"./dist-x6yBUqMs.js";import{t as Oe}from"./build-CngeiE9P.js";import{s as q}from"./theme-constants-C0dRLi4g-CgtKu309.js";import{t as c}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{$ as Z}from"./utils-wA24uq8M-QF6HonJV.js";import{t as K}from"./useAtomStateValue-CwQXVWpa.js";import{t as n}from"./dist-Cg5OofxW.js";import{t as X}from"./IconCalendarRepeat-Blp2taHS.js";import{t as we}from"./IconChartBar-B6Jn00D8.js";import{t as V}from"./IconCoins-B0r0Kos5.js";import{t as Pe}from"./IconDotsVertical-B8pBwOxf.js";import{t as Ue}from"./IconExternalLink-ulJUGaAH.js";import{t as Le}from"./IconEyeShare-CSqIRONr.js";import{t as Ge}from"./IconFlag-D1FPjsFn.js";import{t as Fe}from"./IconSettings2-K0Y6HyU2.js";import{t as $e}from"./IconTrash-h0izILIX.js";import{r as oe}from"./dist-C0k9q2wC.js";import{t as Me}from"./useAtomState-C-mB9YQq.js";import{E as F,a as ce}from"./data-display-Cf60y8W8-BG_djBwj.js";import{i as Ce}from"./OverflowingTextWithTooltip-CCyo14kz-3vxUwP_9.js";import{i as Be}from"./surfaces-D3IxB2EF-C1lYE0R9.js";import{h as We,q as se,x as qe}from"./feedback-CMVzB4J0-DukTodeP.js";import{l as xe}from"./errors-CNNrflUJ.js";import{t as ie}from"./useSnackBar-BbgS33FW.js";import{a as Ke,o as Ve,t as L}from"./typography-DK5JiCH--B1G2Qv9H.js";import{c as He,d as w,n as Qe}from"./layout-B73JJnBU-DCDyPwRC.js";import{S as ze}from"./navigation-Cg4YWhIf-CewvtI5h.js";import{t as Ye}from"./useAtomComponentStateValue-CO6TMomU.js";import{v as B}from"./graphql-Bmj7vfTz.js";import{t as $}from"./lib-C3IpGLsk.js";import{t as H}from"./useQuery-CqCz0Srw.js";import{t as ne}from"./useMutation-Ds2Pb-th.js";import{t as Ze}from"./currentUserState-hqMuY63z.js";import{t as Xe}from"./billingState-B1wSO4o7.js";import{t as Je}from"./ModalStatefulWrapper-Ds2HhQ6I.js";import{t as le}from"./useModal-hvKInX6K.js";import{t as pe}from"./SettingsTextInput-o5Crlgkn.js";import{t as et}from"./ConfirmationModal-DDK1x-A5.js";import{t as ve}from"./currentWorkspaceState-BnKnraKc.js";import{t as he}from"./useNumberFormat-OEVFlw5P.js";import{t as tt}from"./activeTabIdComponentState-CIWDiGUj.js";import{t as rt}from"./useCloseDropdown-CBIS2X0I.js";import{t as at}from"./Dropdown-G74rsaBM.js";import{t as me}from"./getAbsoluteImageUrl-DIxC4es9.js";import{t as J}from"./Table-B46Zylx7.js";import{t as T}from"./TableCell-_89URpb9.js";import{t as O}from"./TableHeader-ysuVPEkr.js";import{t as U}from"./TableRow-BS74ZP6w.js";import{n as st,t as ot}from"./DropdownMenuItemsContainer-BvDBH9sa.js";import{n as W}from"./date-utils-b24l7XYe.js";import{t as it}from"./Select-DN0Qew_8.js";import{Af as je,Bm as ke,Dr as x,Jr as nt,Kf as lt,Kp as dt,Qn as ct,Zf as pt,al as mt,fm as ut,gf as ft,ii as u,jd as It,nl as gt,oh as At,qm as ee,rh as _t,ri as ue,tl as St,ui as Ct}from"./index-BiDxWqTz.js";import{t as te}from"./SettingsTableCard-BcEN_FcR.js";import{t as Q}from"./useApolloAdminClient-CKVGOUpb.js";import{t as fe}from"./TableBody-DIvn_7WK.js";import{t as ye}from"./SettingsSectionSkeletonLoader-BeeBZrrL.js";import{t as xt}from"./AiAdminPath-Dq40p-6W.js";import{n as vt,t as ht}from"./useHandleImpersonate-DVwIclBD.js";import{t as jt}from"./SettingsTableListSection-BpJnSxLL.js";var e=Te(),G=Ee(Re(),1),kt=Oe(),be={[x.COMPENSATION]:{id:"amPBVF"},[x.SALES]:{id:"mUv9U4"},[x.ONBOARDING_REWARD]:{id:"wxvgdv"},[x.ROLLOVER]:{id:"Q6o/eX"}},yt=[x.COMPENSATION,x.SALES],bt=$`
  mutation GrantWorkspaceCredits(
    $workspaceId: UUID!
    $amount: Float!
    $type: BillingCreditGrantType!
    $reason: String
    $clientOperationId: UUID!
  ) {
    grantWorkspaceCredits(
      workspaceId: $workspaceId
      amount: $amount
      type: $type
      reason: $reason
      clientOperationId: $clientOperationId
    ) {
      id
      amount
      type
      effectiveAt
      expiresAt
      revokedAt
      reason
      isActive
      createdAt
    }
  }
`,de=$`
  query WorkspaceBillingAdminPanel($workspaceId: UUID!) {
    workspaceBillingAdminPanel(workspaceId: $workspaceId) {
      stripeCustomerId
      creditBalance
      creditGrants {
        id
        amount
        type
        effectiveAt
        expiresAt
        revokedAt
        reason
        isActive
        createdAt
      }
      usage {
        periodStart
        periodEnd
        usedCredits
        grantedCredits
        rolloverCredits
        totalGrantedCredits
        remainingCredits
      }
      subscription {
        stripeSubscriptionId
        status
        interval
        currency
        planKey
        currentPeriodStart
        currentPeriodEnd
        trialStart
        trialEnd
        cancelAt
        canceledAt
        cancelAtPeriodEnd
        items {
          productName
          productKey
          stripePriceId
          quantity
          unitAmount
          includedCredits
        }
      }
    }
  }
`,Et=R("div")({name:"StyledCenteredTitle",class:"s1mndy8p",propsAsIs:!1}),Tt=R("div")({name:"StyledSectionContainer",class:"skq093g",propsAsIs:!1}),Rt=R("div")({name:"StyledFields",class:"s1wy8nlj",propsAsIs:!1}),Dt=R("div")({name:"StyledModalActions",class:"si2xe4k",propsAsIs:!1}),Nt=({modalInstanceId:t,workspaceId:r})=>{const{i18n:d,_:i}=oe(),{closeModal:k}=le(),{enqueueErrorSnackBar:h,enqueueSuccessSnackBar:v}=ie(),D=Q(),[j,y]=(0,G.useState)(""),[A,a]=(0,G.useState)(x.COMPENSATION),[m,_]=(0,G.useState)(""),[p,f]=(0,G.useState)(null),[b,{loading:N}]=ne(bt,{client:D,refetchQueries:[de]}),o=Number(j),g=Number.isFinite(o)&&o>0,P=()=>{y(""),a(x.COMPENSATION),_(""),f(null),k(t)},M=async()=>{if(!g)return;const l=m.trim(),S=JSON.stringify([o,A,l]),s=p?.payload===S?p.clientOperationId:Ne();f({payload:S,clientOperationId:s});try{await b({variables:{workspaceId:r,amount:o,type:A,reason:l||null,clientOperationId:s}}),v({message:d._({id:"Tbxf45",values:{parsedAmount:o}})}),P()}catch(I){h({apolloError:xe.is(I)?I:void 0})}};return(0,e.jsxs)(Je,{modalInstanceId:t,onClose:P,isClosable:!0,size:"medium",padding:"large",overlay:"dark",width:"360px",dataGloballyPreventClickOutside:!0,renderInDocumentBody:!0,smallBorderRadius:!0,autoHeight:!0,children:[(0,e.jsx)(Et,{children:(0,e.jsx)(Ve,{title:d._({id:"5O8DG6"}),fontColor:Ke.Primary})}),(0,e.jsx)(Tt,{children:(0,e.jsx)(w,{alignment:Qe.Center,fontColor:He.Primary,children:d._({id:"AaNZqp"})})}),(0,e.jsxs)(Rt,{children:[(0,e.jsx)(pe,{instanceId:`${t}-amount`,label:d._({id:"hehnjM"}),placeholder:"200",type:"number",min:0,leftAdornment:"$",value:j,onChange:y,autoFocusOnMount:!0,fullWidth:!0}),(0,e.jsx)(it,{dropdownId:`${t}-type`,label:d._({id:"+zy2Nq"}),value:A,options:yt.map(l=>({value:l,label:d._(be[l])})),onChange:a,isDropdownInModal:!0,fullWidth:!0}),(0,e.jsx)(pe,{instanceId:`${t}-reason`,label:d._({id:"VJScHU"}),placeholder:d._({id:"+g90tY"}),value:m,onChange:_,maxLength:500,fullWidth:!0})]}),(0,e.jsxs)(Dt,{children:[(0,e.jsx)(se,{onClick:P,variant:"secondary",title:d._({id:"dEgA5A"}),fullWidth:!0,justify:"center"}),(0,e.jsx)(se,{onClick:M,variant:"primary",accent:"blue",title:d._({id:"nE5VAt"}),disabled:!g||N,fullWidth:!0,justify:"center"})]})]})},Ot=({creditGrantId:t,onRevoke:r})=>{const d=`settings-admin-credit-grant-row-${t}`,{closeDropdown:i}=rt();return(0,e.jsx)(at,{dropdownId:d,dropdownPlacement:"right-start",clickableComponent:(0,e.jsx)(qe,{Icon:Pe,accent:"tertiary"}),dropdownComponents:(0,e.jsx)(st,{children:(0,e.jsx)(ot,{children:(0,e.jsx)(ze,{accent:"danger",LeftIcon:$e,text:n._({id:"GXsAby"}),onClick:()=>{r(),i(d)}})})})})},wt={[x.COMPENSATION]:"orange",[x.SALES]:"purple",[x.ONBOARDING_REWARD]:"blue",[x.ROLLOVER]:"green"},Pt=$`
  mutation RevokeWorkspaceCreditGrant(
    $workspaceId: UUID!
    $creditGrantId: UUID!
  ) {
    revokeWorkspaceCreditGrant(
      workspaceId: $workspaceId
      creditGrantId: $creditGrantId
    ) {
      id
      amount
      type
      effectiveAt
      expiresAt
      revokedAt
      reason
      isActive
      createdAt
    }
  }
`,Ut="88px 152px 96px 112px 1fr 36px",Ie="revoke-credit-grant-modal",Lt="—",Gt=t=>c(t.revokedAt)?{label:{id:"xGiT1z"},color:"red"}:t.isActive?{label:{id:"F6pfE9"},color:"green"}:{label:{id:"M1RnFv"},color:"gray"},Ft=({workspaceId:t,creditGrants:r,onGrantCreditsClick:d})=>{const{i18n:i,_:k}=oe(),{formatNumber:h}=he(),{enqueueErrorSnackBar:v,enqueueSuccessSnackBar:D}=ie(),j=Q(),{openModal:y}=le(),[A,a]=(0,G.useState)(null),[m,_]=(0,G.useState)(!1),[p]=ne(Pt,{client:j,refetchQueries:[de]}),f=o=>h(o,{decimals:2}),b=o=>{a(o),y(Ie)},N=async o=>{_(!0);try{await p({variables:{workspaceId:t,creditGrantId:o}}),D({message:i._({id:"zH6NZT"})})}catch(g){v({apolloError:xe.is(g)?g:void 0})}finally{_(!1),a(null)}};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(jt,{title:i._({id:"fqtGOd"}),description:i._({id:"MnLFOj"}),items:r,columns:[{label:i._({id:"hehnjM"}),Cell:({item:o})=>(0,e.jsx)(e.Fragment,{children:f(o.amount)})},{label:i._({id:"+zy2Nq"}),Cell:({item:o})=>(0,e.jsx)(F,{color:wt[o.type],text:i._(be[o.type])})},{label:i._({id:"uAQUqI"}),Cell:({item:o})=>{const g=Gt(o);return(0,e.jsx)(F,{color:g.color,text:i._(g.label)})}},{label:i._({id:"KnN1Tu"}),Cell:({item:o})=>(0,e.jsx)(e.Fragment,{children:W(o.expiresAt)})},{label:i._({id:"VJScHU"}),overflow:"hidden",Cell:({item:o})=>(0,e.jsx)(Ce,{text:o.reason??Lt})},{label:"",align:"right",Cell:({item:o})=>o.isActive?(0,e.jsx)(Ot,{creditGrantId:o.id,onRevoke:()=>b(o)}):null}],gridAutoColumns:Ut,footerButtonLabel:i._({id:"5O8DG6"}),onFooterButtonClick:d}),(0,e.jsx)(et,{modalInstanceId:Ie,title:i._({id:"CCR+qC"}),subtitle:c(A)?i._({id:"ddMLFL",values:{0:f(A.amount)}}):"",confirmButtonText:i._({id:"GXsAby"}),loading:m,onConfirmClick:()=>{c(A)&&N(A.id)},onClose:()=>a(null)})]})},$t=R("div")({name:"StyledTagsWrapper",class:"sx9h5mh",propsAsIs:!1}),Mt=({plan:t,isTrialPeriod:r=!1})=>{const d=t===B.PRO?{color:"sky",label:n._({id:"3fPjUY"})}:{color:"purple",label:n._({id:"ucgZ0o"})};return(0,e.jsxs)($t,{children:[(0,e.jsx)(F,{color:d.color,text:d.label}),r&&(0,e.jsx)(F,{color:"blue",text:n._({id:"lhkaAC"}),preventShrink:!0})]})},Bt="https://dashboard.stripe.com",Wt="BASE_PRODUCT",qt="RESOURCE_CREDIT",re="—",ge="settings-admin-grant-workspace-credits",ae=R("div")({name:"StyledContainer",class:"s1hgnhrg",propsAsIs:!1}),Kt=R("a")({name:"StyledExternalLink",class:"s19t4op2",propsAsIs:!1}),Vt=R("span")({name:"StyledMono",class:"spfurqs",propsAsIs:!1}),Ht=R("div")({name:"StyledItemValue",class:"spsfm74",propsAsIs:!1}),Qt={[u.Active]:"green",[u.Trialing]:"blue",[u.PastDue]:"orange",[u.Canceled]:"red",[u.Unpaid]:"red",[u.Paused]:"gray",[u.Incomplete]:"gray",[u.IncompleteExpired]:"gray"},zt={[u.Active]:"Active",[u.Trialing]:"Trialing",[u.PastDue]:"Past Due",[u.Canceled]:"Canceled",[u.Unpaid]:"Unpaid",[u.Paused]:"Paused",[u.Incomplete]:"Incomplete",[u.IncompleteExpired]:"Incomplete Expired"},Yt=(t,r)=>{const d=r.toUpperCase();try{return new Intl.NumberFormat("en-US",{style:"currency",currency:d}).format(t/100)}catch{return`${(t/100).toFixed(2)} ${d}`}},Zt=t=>t===B.PRO?B.PRO:t===B.ENTERPRISE?B.ENTERPRISE:null,Ae=({path:t,id:r})=>(0,e.jsxs)(Kt,{href:`${Bt}/${t}/${r}`,target:"_blank",rel:"noopener noreferrer",children:[(0,e.jsx)(Vt,{children:r}),(0,e.jsx)(Ue,{size:12})]}),Xt=({workspaceId:t})=>{const{i18n:r,_:d}=oe(),{formatNumber:i}=he(),{openModal:k}=le(),{data:h,loading:v}=H(de,{client:Q(),variables:{workspaceId:t},skip:!t});if(v)return(0,e.jsx)(ae,{children:(0,e.jsx)(ye,{rowCount:6})});const D=h?.workspaceBillingAdminPanel??null;if(!D)return(0,e.jsx)(ae,{children:(0,e.jsx)(w,{children:(0,e.jsx)(L,{title:r._({id:"R+w/Va"}),description:r._({id:"8whThc"})})})});const{stripeCustomerId:j,creditBalance:y,creditGrants:A,subscription:a,usage:m}=D,_=l=>i(l,{abbreviate:!0,decimals:2}),p=[{Icon:ut,label:r._({id:"zHJ27S"}),value:c(j)?(0,e.jsx)(Ae,{path:"customers",id:j}):re},{Icon:V,label:r._({id:"3hkXRB"}),value:c(y)?`${i(y,{abbreviate:!0,decimals:2})} ${r._({id:"UQ4Hjl"})}`:re}],f=a?.interval===ue.Month?r._({id:"+8Nek/"}):a?.interval===ue.Year?r._({id:"zkWmBh"}):null,b=(l,S)=>`${W(l)} → ${W(S)}`,N=c(a?.planKey)?Zt(a.planKey):null,o=a?.status===u.Trialing,g=c(m)?[{Icon:we,label:r._({id:"yLljbQ"}),value:`${_(m.usedCredits)} / ${_(m.totalGrantedCredits)}`},...o?[]:[{Icon:V,label:r._({id:"b2ghLW"}),value:_(m.grantedCredits)}],...m.rolloverCredits>0?[{Icon:V,label:r._({id:"fqtGOd"}),value:_(m.rolloverCredits)}]:[],{Icon:X,label:r._({id:"6SbZqO"}),value:b(m.periodStart,m.periodEnd)}]:[],P=l=>{const S=[];return c(l.quantity)&&S.push(`${i(l.quantity)} ${r._({id:"MpFIca"})}`),c(l.includedCredits)&&S.push(`${i(l.includedCredits,{abbreviate:!0,decimals:2})} ${r._({id:"5oMPMN"})}`),c(l.unitAmount)&&c(a)&&S.push(Yt(l.unitAmount,a.currency)),S.length>0?S.join(" · "):re},M=a?[{Icon:ke,label:r._({id:"Yiplcx"}),value:(0,e.jsx)(Ae,{path:"subscriptions",id:a.stripeSubscriptionId})},{Icon:pt,label:r._({id:"uAQUqI"}),value:(0,e.jsx)(F,{color:Qt[a.status],text:zt[a.status]})},...c(N)?[{Icon:lt,label:r._({id:"GdgCoi"}),value:(0,e.jsx)(Mt,{plan:N,isTrialPeriod:o})}]:[],...c(f)?[{Icon:_t,label:r._({id:"nJGwRf"}),value:f}]:[],{Icon:X,label:r._({id:"nSK0mT"}),value:b(a.currentPeriodStart,a.currentPeriodEnd)},...c(a.trialStart)&&c(a.trialEnd)?[{Icon:X,label:r._({id:"67waeA"}),value:b(a.trialStart,a.trialEnd)}]:[],...a.cancelAtPeriodEnd?[{Icon:ee,label:r._({id:"2CAby/"}),value:r._({id:"l75CjT"})}]:[],...c(a.cancelAt)?[{Icon:ee,label:r._({id:"zbbpgB"}),value:W(a.cancelAt)}]:[],...c(a.canceledAt)?[{Icon:ee,label:r._({id:"dC0BTo"}),value:W(a.canceledAt)}]:[],...a.items.map(l=>({Icon:l.productKey===Wt?je:l.productKey===qt?V:At,label:l.productName||r._({id:"a3Hy65"}),value:(0,e.jsxs)(Ht,{children:[(0,e.jsx)("span",{children:P(l)}),c(l.productKey)&&(0,e.jsx)(F,{color:"gray",text:l.productKey})]})}))]:[];return(0,e.jsxs)(ae,{children:[(0,e.jsxs)(w,{children:[(0,e.jsx)(L,{title:r._({id:"876pfE"}),description:r._({id:"Zk8585"})}),(0,e.jsx)(te,{rounded:!0,items:p,gridAutoColumns:"3fr 8fr"})]}),(0,e.jsxs)(w,{children:[(0,e.jsx)(L,{title:r._({id:"7FaY4u"}),description:c(m)?r._({id:"Woqoyp"}):r._({id:"YrBAQE"})}),c(m)&&(0,e.jsx)(te,{rounded:!0,items:g,gridAutoColumns:"3fr 8fr"})]}),(0,e.jsxs)(w,{children:[(0,e.jsx)(L,{title:r._({id:"WVzGc2"}),description:a?r._({id:"C6vAhD"}):r._({id:"glQp+P"})}),a&&(0,e.jsx)(te,{rounded:!0,items:M,gridAutoColumns:"3fr 8fr"})]}),(0,e.jsx)(Ft,{workspaceId:t,creditGrants:A,onGrantCreditsClick:()=>k(ge)}),(0,e.jsx)(Nt,{modalInstanceId:ge,workspaceId:t})]})},Jt=$`
  query GetAdminWorkspaceChatThreads($workspaceId: UUID!) {
    getAdminWorkspaceChatThreads(workspaceId: $workspaceId) {
      id
      title
      totalInputTokens
      totalOutputTokens
      conversationSize
      messageCount
      createdAt
      updatedAt
    }
  }
`,er=$`
  fragment UserInfoFragment on UserInfo {
    id
    email
    firstName
    lastName
    createdAt
  }
`,_e=$`
  ${er}
  query WorkspaceLookupAdminPanel($workspaceId: UUID!) {
    workspaceLookupAdminPanel(workspaceId: $workspaceId) {
      user {
        ...UserInfoFragment
      }
      workspaces {
        id
        name
        allowImpersonation
        logo
        totalUsers
        activationStatus
        createdAt
        workspaceUrls {
          customUrl
          subdomainUrl
        }
        users {
          id
          email
          firstName
          lastName
          avatarUrl
        }
        featureFlags {
          key
          value
        }
      }
    }
  }
`,tr=()=>{const[t,r]=Me(ve);return{updateFeatureFlagState:(i,k,h)=>{c(t)&&t.id===i&&r({...t,featureFlags:t.featureFlags?.map(v=>v.key===k?{...v,value:h}:v)})}}},Se="settings-admin-workspace-detail-tabs",C={INFO:"info",BILLING:"billing",MEMBERS:"members",FEATURE_FLAGS:"feature-flags",CHATS:"chats"},ma=()=>{const{workspaceId:t}=De(),r=Q(),d=Ye(tt,Se),i=K(Ze),k=K(ve),h=K(Xe)?.isBillingEnabled??!1,v=K(ft),{enqueueErrorSnackBar:D}=ie(),{updateFeatureFlagState:j}=tr(),{handleImpersonate:y,impersonatingUserId:A}=ht(),[a]=ne(Ct,{client:r,refetchQueries:[{query:_e,variables:{workspaceId:t}}]}),{data:m,loading:_}=H(_e,{client:r,variables:{workspaceId:t},skip:!t}),p=m?.workspaceLookupAdminPanel?.workspaces?.[0],f=d||C.INFO,{data:b,loading:N}=H(Jt,{client:r,variables:{workspaceId:t},skip:!t||!p?.allowImpersonation||f!==C.CHATS}),{data:o}=H(nt,{client:r,variables:{workspaceIds:t?[t]:[]},skip:!t,fetchPolicy:"network-only"}),g=b?.getAdminWorkspaceChatThreads??[],P=async(s,I)=>{if(!t)return;const E=p?.featureFlags?.find(z=>z.key===s)?.value;j(t,s,I),await a({variables:{workspaceId:t,featureFlag:s,value:I},onError:z=>{c(E)&&j(t,s,E),D({message:`Failed to update feature flag. ${z.message}`})}})},M=[{id:C.INFO,title:n._({id:"CE+M2e"}),Icon:Fe},...h?[{id:C.BILLING,title:n._({id:"R+w/Va"}),Icon:ke}]:[],...i?.canImpersonate?[{id:C.MEMBERS,title:n._({id:"wlQNTg"}),Icon:je}]:[],...v?[{id:C.FEATURE_FLAGS,title:n._({id:"+ZqAYI"}),Icon:Ge}]:[],...p?.allowImpersonation?[{id:C.CHATS,title:n._({id:"8Q+lLG"}),Icon:dt}]:[]],l=p?.name||t||"",S=(0,kt.isNonEmptyString)(p?.logo)?p.logo:It;return _?(0,e.jsx)(mt,{}):(0,e.jsx)(gt,{title:l,icon:(0,e.jsx)(ce,{avatarUrl:me(S),placeholder:l,placeholderColorSeed:p?.id,size:"md"}),links:[{children:n._({id:"/IX/7x"}),href:Z(Y.AdminPanel)},{children:n._({id:"05jO4l"}),href:xt},{children:l}],children:(0,e.jsxs)(St,{children:[(0,e.jsx)(ct,{tabs:M,behaveAsLinks:!1,componentInstanceId:Se}),f===C.INFO&&p&&(0,e.jsx)(vt,{activeWorkspace:p,workspaceUpgradeStatus:o?.getUpgradeStatus?.find(s=>s?.workspaceId===t)}),f===C.BILLING&&h&&t&&(0,e.jsx)(Xt,{workspaceId:t}),f===C.MEMBERS&&p&&(0,e.jsxs)(w,{children:[(0,e.jsx)(L,{title:n._({id:"wlQNTg"}),description:n._({id:"wtxjAY"})}),(0,e.jsx)(J,{children:(0,e.jsxs)(fe,{children:[(0,e.jsxs)(U,{gridTemplateColumns:"1fr 2fr 100px",children:[(0,e.jsx)(O,{children:n._({id:"6YtxFj"})}),(0,e.jsx)(O,{children:n._({id:"O3oNi5"})}),(0,e.jsx)(O,{align:"right",children:n._({id:"7L01XJ"})})]}),p.users?.map(s=>{const I=s.id;return c(I)?(0,e.jsxs)(U,{gridTemplateColumns:"1fr 2fr 100px",to:Z(Y.AdminPanelUserDetail,{userId:I}),children:[(0,e.jsxs)(T,{color:q.font.color.primary,gap:q.spacing[2],overflow:"hidden",children:[(0,e.jsx)(ce,{avatarUrl:me(s.avatarUrl),placeholder:`${s.firstName||""} ${s.lastName||""}`.trim()||s.email,placeholderColorSeed:s.id,size:"md",type:"rounded"}),(0,e.jsx)(Ce,{text:`${s.firstName||""} ${s.lastName||""}`.trim()||"—"})]}),(0,e.jsx)(T,{children:s.email}),(0,e.jsx)(T,{align:"right",children:p.allowImpersonation&&c(i?.id)&&I!==i.id&&(0,e.jsx)(se,{Icon:Le,variant:"secondary",size:"small",title:n._({id:"tSVr6t"}),onClick:E=>{E.preventDefault(),E.stopPropagation(),y(I,t)},disabled:A===I})})]},I):null})]})})]}),f===C.FEATURE_FLAGS&&p&&(0,e.jsxs)(w,{children:[(0,e.jsx)(L,{title:n._({id:"+ZqAYI"}),description:n._({id:"Dt05oz"})}),(0,e.jsx)(J,{children:(0,e.jsxs)(fe,{children:[(0,e.jsxs)(U,{gridAutoColumns:"1fr 100px",mobileGridAutoColumns:"1fr 80px",children:[(0,e.jsx)(O,{children:n._({id:"YXjpZx"})}),(0,e.jsx)(O,{align:"right",children:n._({id:"uAQUqI"})})]}),p.featureFlags?.map(s=>{const I=(k?.id===t?k?.featureFlags?.find(E=>E.key===s.key)?.value:void 0)??s.value;return(0,e.jsxs)(U,{gridAutoColumns:"1fr 100px",mobileGridAutoColumns:"1fr 80px",children:[(0,e.jsx)(T,{children:s.key}),(0,e.jsx)(T,{align:"right",children:c(s.key)&&(0,e.jsx)(We,{value:I,onChange:E=>P(s.key,E)})})]},s.key)})]})})]}),f===C.CHATS&&(0,e.jsxs)(w,{children:[(0,e.jsx)(L,{title:n._({id:"jTS+KY"}),description:n._({id:"qiD/6r"})}),N?(0,e.jsx)(ye,{}):g.length===0?(0,e.jsx)(Be,{rounded:!0,children:(0,e.jsx)(U,{gridTemplateColumns:"1fr",children:(0,e.jsx)(T,{color:q.font.color.tertiary,align:"center",children:n._({id:"NjIy4U"})})})}):(0,e.jsxs)(J,{children:[(0,e.jsxs)(U,{gridTemplateColumns:"1fr 120px 120px",children:[(0,e.jsx)(O,{children:n._({id:"MHrjPM"})}),(0,e.jsx)(O,{align:"right",children:n._({id:"t7TeQU"})}),(0,e.jsx)(O,{align:"right",children:n._({id:"+b7T3G"})})]}),g.map(s=>(0,e.jsxs)(U,{gridTemplateColumns:"1fr 120px 120px",to:Z(Y.AdminPanelWorkspaceChatThread,{workspaceId:t??"",threadId:s.id}),children:[(0,e.jsx)(T,{color:q.font.color.primary,children:s.title||n._({id:"wja8aL"})}),(0,e.jsx)(T,{align:"right",children:s.messageCount}),(0,e.jsx)(T,{align:"right",children:new Date(s.updatedAt).toLocaleDateString()})]},s.id))]})]})]})})};export{ma as SettingsAdminWorkspaceDetail};
