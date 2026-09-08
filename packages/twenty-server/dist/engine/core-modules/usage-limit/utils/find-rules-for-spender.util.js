"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "findRulesForSpender", {
    enumerable: true,
    get: function() {
        return findRulesForSpender;
    }
});
const findRulesForSpender = ({ rules, spender, operationType })=>rules.filter((rule)=>rule.spenderType === spender.spenderType && rule.operationType === operationType && (rule.spenderId === '' || rule.spenderId === spender.spenderId));

//# sourceMappingURL=find-rules-for-spender.util.js.map