// TODO: derive default model preferences dynamically from the catalog
// instead of hardcoding model IDs that become stale as models evolve
//
// These lists are resolved by taking the first model that is actually
// available, meaning the one whose provider the instance holds a key for. They
// are therefore a preference chain across providers, not a shortlist: every
// supported provider needs an entry, or an instance configured with only that
// provider resolves to nothing and shows an empty model picker.
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
    get DEFAULT_DISABLED_MODELS () {
        return DEFAULT_DISABLED_MODELS;
    },
    get DEFAULT_FAST_MODELS () {
        return DEFAULT_FAST_MODELS;
    },
    get DEFAULT_MODEL_PREFERENCES () {
        return DEFAULT_MODEL_PREFERENCES;
    },
    get DEFAULT_RECOMMENDED_MODELS () {
        return DEFAULT_RECOMMENDED_MODELS;
    },
    get DEFAULT_SMART_MODELS () {
        return DEFAULT_SMART_MODELS;
    }
});
const DEFAULT_FAST_MODELS = [
    'openai/gpt-5.6-luna',
    'anthropic/claude-sonnet-5',
    'google/gemini-3.7-flash',
    'xai/grok-4.3',
    'mistral/mistral-large-latest'
];
const DEFAULT_SMART_MODELS = [
    'openai/gpt-5.6-sol',
    'anthropic/claude-opus-5',
    'google/gemini-3.1-pro-preview',
    'xai/grok-4.6',
    'mistral/mistral-large-latest'
];
const DEFAULT_RECOMMENDED_MODELS = [
    'openai/gpt-5.6-luna',
    'openai/gpt-5.6-sol',
    'anthropic/claude-sonnet-5',
    'anthropic/claude-opus-5',
    'google/gemini-3.1-pro-preview',
    'xai/grok-4.6',
    'mistral/mistral-large-latest'
];
const DEFAULT_DISABLED_MODELS = [];
const DEFAULT_MODEL_PREFERENCES = {
    disabledModels: [],
    recommendedModels: DEFAULT_RECOMMENDED_MODELS,
    defaultFastModels: DEFAULT_FAST_MODELS,
    defaultSmartModels: DEFAULT_SMART_MODELS
};

//# sourceMappingURL=load-default-model-preferences.util.js.map