"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isModelAllowedByWorkspace", {
    enumerable: true,
    get: function() {
        return isModelAllowedByWorkspace;
    }
});
const _utils = require("twenty-shared/utils");
const isModelAllowedByWorkspace = (modelId, availabilitySettings, recommendedModelIds)=>{
    if ((0, _utils.isAutoSelectModelId)(modelId)) {
        return true;
    }
    if (availabilitySettings.useRecommendedModels) {
        return recommendedModelIds?.has(modelId) ?? false;
    }
    return availabilitySettings.enabledAiModelIds.includes(modelId);
};

//# sourceMappingURL=is-model-allowed.util.js.map