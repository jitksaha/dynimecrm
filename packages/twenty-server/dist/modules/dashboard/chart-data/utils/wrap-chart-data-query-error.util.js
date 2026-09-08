"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "wrapChartDataQueryError", {
    enumerable: true,
    get: function() {
        return wrapChartDataQueryError;
    }
});
const _permissionsexception = require("../../../../engine/metadata-modules/permissions/permissions.exception");
const _chartdataexception = require("../exceptions/chart-data.exception");
const wrapChartDataQueryError = (error, contextPrefix)=>{
    if (error instanceof _chartdataexception.ChartDataException) {
        return error;
    }
    if (error instanceof _permissionsexception.PermissionsException && error.code === _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED) {
        return new _chartdataexception.ChartDataException((0, _chartdataexception.generateChartDataExceptionMessage)(_chartdataexception.ChartDataExceptionCode.PERMISSION_DENIED, error.message), _chartdataexception.ChartDataExceptionCode.PERMISSION_DENIED);
    }
    return new _chartdataexception.ChartDataException((0, _chartdataexception.generateChartDataExceptionMessage)(_chartdataexception.ChartDataExceptionCode.QUERY_EXECUTION_FAILED, `${contextPrefix}: ${error instanceof Error ? error.message : String(error)}`), _chartdataexception.ChartDataExceptionCode.QUERY_EXECUTION_FAILED);
};

//# sourceMappingURL=wrap-chart-data-query-error.util.js.map