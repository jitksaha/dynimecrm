"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "workspaceHasEnabledModels", {
    enumerable: true,
    get: function() {
        return workspaceHasEnabledModels;
    }
});
const workspaceHasEnabledModels = (availabilitySettings, recommendedModelIds)=>{
    if (availabilitySettings.useRecommendedModels) {
        return (recommendedModelIds?.size ?? 0) > 0;
    }
    return availabilitySettings.enabledAiModelIds.length > 0;
};

//# sourceMappingURL=workspace-has-enabled-models.util.js.map