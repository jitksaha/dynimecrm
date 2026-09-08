"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get buildObjectEventEnvelope () {
        return buildObjectEventEnvelope;
    },
    get buildPageviewEnvelope () {
        return buildPageviewEnvelope;
    },
    get buildWorkspaceEventEnvelope () {
        return buildWorkspaceEventEnvelope;
    },
    get computeEventContextFields () {
        return computeEventContextFields;
    }
});
const _analyticsutils = require("./analytics.utils");
const computeEventContextFields = (context)=>({
        ...context?.workspaceId ? {
            workspaceId: context.workspaceId
        } : {},
        ...context?.userId ? {
            userId: context.userId
        } : {}
    });
const buildWorkspaceEventEnvelope = (contextFields, event, properties)=>({
        table: 'workspaceEvent',
        row: {
            ...contextFields,
            ...(0, _analyticsutils.makeTrackEvent)(event, properties)
        }
    });
const buildObjectEventEnvelope = (contextFields, event, properties)=>{
    const { recordId, objectMetadataId, isCustom, ...restProperties } = properties;
    return {
        table: 'objectEvent',
        row: {
            ...contextFields,
            ...(0, _analyticsutils.makeTrackEvent)(event, restProperties),
            recordId,
            objectMetadataId,
            isCustom
        }
    };
};
const buildPageviewEnvelope = (contextFields, name, properties)=>({
        table: 'pageview',
        row: {
            ...contextFields,
            ...(0, _analyticsutils.makePageview)(name, properties)
        }
    });

//# sourceMappingURL=build-event-envelope.js.map