import{o as R}from"./chunk-ChpBd9eV.js";import{t as b}from"./react-M6yZRsSc.js";import{t as M}from"./isDefined-Dtu5EYqP-_d6Dqdoe.js";import{Hr as j}from"./utils-wA24uq8M-QF6HonJV.js";import{t as F}from"./useAtomStateValue-CwQXVWpa.js";import{n as I}from"./lib-C3IpGLsk.js";import{t as y}from"./useQuery-CqCz0Srw.js";import{t as q}from"./useApolloCoreClient-cYHBUwoT.js";import{t as Q}from"./objectMetadataItemsSelector-Cqt-LRdd.js";import{t as _}from"./useObjectPermissions-DHmZToEp.js";import{r as $,t as h}from"./getRecordFromRecordNode-Csy4sEjj.js";import{t as i}from"./useObjectMetadataItem-PGgeuYcz.js";import{t as v}from"./useGenerateDepthRecordGqlFieldsFromObject-CGW--HLF.js";import{t as G}from"./useObjectPermissionsForObject-DalV0JGL.js";var m=R(b(),1),L=({objectNameSingular:e,recordGqlFields:r,withSoftDeleted:s=!1})=>{const{objectMetadataItem:t}=i({objectNameSingular:e}),a=F(Q),{objectPermissionsByObjectMetadataId:o}=_();return{findOneRecordQuery:(0,m.useMemo)(()=>I`
      query FindOne${j(t.nameSingular)}($objectRecordId: UUID!) {
        ${t.nameSingular}(filter: {
        ${s?`
          or: [
            { deletedAt: { is: NULL } },
            { deletedAt: { is: NOT_NULL } }
          ],
        `:""}
          id: {
            eq: $objectRecordId
          }
        })${$({objectMetadataItems:a,objectMetadataItem:t,recordGqlFields:r,objectPermissionsByObjectMetadataId:o})}
      },
  `,[t,a,r,s,o])}},K=({objectNameSingular:e,objectRecordId:r="",recordGqlFields:s,skip:t,withSoftDeleted:a=!1})=>{const{objectMetadataItem:o}=i({objectNameSingular:e}),{recordGqlFields:c}=v({objectNameSingular:e,depth:1}),n=q(),{findOneRecordQuery:p}=L({objectNameSingular:e,recordGqlFields:s??c,withSoftDeleted:a}),f=G(o.id).canReadObjectRecords,{data:d,loading:l,error:u,refetch:O}=y(p,{skip:!M(o)||!r||t||!f,variables:{objectRecordId:r},client:n});return{record:(0,m.useMemo)(()=>d?.[e]?h({recordNode:d?.[e]}):void 0,[d,e]),loading:l,error:u,refetch:O}};export{L as n,K as t};
