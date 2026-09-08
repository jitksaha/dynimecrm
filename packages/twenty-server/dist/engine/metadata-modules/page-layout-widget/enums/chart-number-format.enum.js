"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ChartNumberFormat", {
    enumerable: true,
    get: function() {
        return ChartNumberFormat;
    }
});
const _graphql = require("@nestjs/graphql");
var ChartNumberFormat = /*#__PURE__*/ function(ChartNumberFormat) {
    ChartNumberFormat["SHORT"] = "SHORT";
    ChartNumberFormat["FULL"] = "FULL";
    return ChartNumberFormat;
}({});
(0, _graphql.registerEnumType)(ChartNumberFormat, {
    name: 'ChartNumberFormat',
    description: 'Format used to display the chart value'
});

//# sourceMappingURL=chart-number-format.enum.js.map