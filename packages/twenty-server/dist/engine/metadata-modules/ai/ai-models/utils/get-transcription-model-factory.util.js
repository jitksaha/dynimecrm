"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getTranscriptionModelFactory", {
    enumerable: true,
    get: function() {
        return getTranscriptionModelFactory;
    }
});
const hasTranscriptionFactory = (provider)=>typeof provider?.transcription === 'function';
const getTranscriptionModelFactory = (provider)=>{
    if (!hasTranscriptionFactory(provider)) {
        return undefined;
    }
    return (modelId)=>provider.transcription(modelId);
};

//# sourceMappingURL=get-transcription-model-factory.util.js.map