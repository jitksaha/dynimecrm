"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildResolverNameMap", {
    enumerable: true,
    get: function() {
        return buildResolverNameMap;
    }
});
const _factories = require("../../workspace-resolver-builder/factories/factories");
const _getresolvernameutil = require("../../../../utils/get-resolver-name.util");
const buildResolverNameMap = (objectMetadatas)=>{
    const map = {};
    const allMethods = [
        ..._factories.workspaceResolverBuilderMethodNames.queries.map((method)=>({
                method,
                operationType: 'query'
            })),
        ..._factories.workspaceResolverBuilderMethodNames.mutations.map((method)=>({
                method,
                operationType: 'mutation'
            }))
    ];
    for (const objectMetadata of objectMetadatas){
        for (const { method, operationType } of allMethods){
            const resolverName = (0, _getresolvernameutil.getResolverName)(objectMetadata, method);
            map[resolverName] = {
                objectMetadataUniversalIdentifier: objectMetadata.universalIdentifier,
                method,
                operationType
            };
        }
    }
    return map;
};

//# sourceMappingURL=build-resolver-name-map.util.js.map