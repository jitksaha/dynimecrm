"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isSuppressionBlockingSend", {
    enumerable: true,
    get: function() {
        return isSuppressionBlockingSend;
    }
});
const _utils = require("twenty-shared/utils");
const _hardsuppressionreasonsconstant = require("../constants/hard-suppression-reasons.constant");
const isSuppressionBlockingSend = ({ sendKind, suppression, unsubscribeTopicId })=>{
    if (_hardsuppressionreasonsconstant.HARD_SUPPRESSION_REASONS.includes(suppression.reason)) {
        return true;
    }
    if (sendKind === 'TRANSACTIONAL') {
        return false;
    }
    if (!(0, _utils.isDefined)(suppression.unsubscribeTopicId)) {
        return true;
    }
    return suppression.unsubscribeTopicId === unsubscribeTopicId;
};

//# sourceMappingURL=is-suppression-blocking-send.util.js.map