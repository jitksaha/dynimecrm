"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNativeMimeTypesForModalities", {
    enumerable: true,
    get: function() {
        return getNativeMimeTypesForModalities;
    }
});
const _modalitytomimetypesconstant = require("../constants/modality-to-mime-types.constant");
const getNativeMimeTypesForModalities = (modalities = [])=>new Set(modalities.flatMap((modality)=>_modalitytomimetypesconstant.MODALITY_TO_MIME_TYPES[modality] ?? []));

//# sourceMappingURL=get-native-mime-types-for-modalities.util.js.map