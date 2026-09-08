"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _permissionsexception = require("../../../../../engine/metadata-modules/permissions/permissions.exception");
const _chartdataexception = require("../../exceptions/chart-data.exception");
const _wrapchartdataqueryerrorutil = require("../wrap-chart-data-query-error.util");
describe('wrapChartDataQueryError', ()=>{
    it('should pass through an existing ChartDataException unchanged', ()=>{
        const original = new _chartdataexception.ChartDataException('Object metadata not found', _chartdataexception.ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND);
        const result = (0, _wrapchartdataqueryerrorutil.wrapChartDataQueryError)(original, 'Bar chart');
        expect(result).toBe(original);
    });
    it('should map a record-level permission error to PERMISSION_DENIED', ()=>{
        const permissionError = new _permissionsexception.PermissionsException('Entity performing the request does not have permission', _permissionsexception.PermissionsExceptionCode.PERMISSION_DENIED);
        const result = (0, _wrapchartdataqueryerrorutil.wrapChartDataQueryError)(permissionError, 'Bar chart');
        expect(result).toBeInstanceOf(_chartdataexception.ChartDataException);
        expect(result.code).toBe(_chartdataexception.ChartDataExceptionCode.PERMISSION_DENIED);
    });
    it('should wrap an unknown error as QUERY_EXECUTION_FAILED with the context prefix', ()=>{
        const result = (0, _wrapchartdataqueryerrorutil.wrapChartDataQueryError)(new Error('boom'), 'Bar chart data retrieval failed');
        expect(result).toBeInstanceOf(_chartdataexception.ChartDataException);
        expect(result.code).toBe(_chartdataexception.ChartDataExceptionCode.QUERY_EXECUTION_FAILED);
        expect(result.message).toContain('Bar chart data retrieval failed: boom');
    });
    it('should not map a non-permission-denied PermissionsException to PERMISSION_DENIED', ()=>{
        const otherPermissionError = new _permissionsexception.PermissionsException('Method not allowed', _permissionsexception.PermissionsExceptionCode.METHOD_NOT_ALLOWED);
        const result = (0, _wrapchartdataqueryerrorutil.wrapChartDataQueryError)(otherPermissionError, 'Bar chart');
        expect(result.code).toBe(_chartdataexception.ChartDataExceptionCode.QUERY_EXECUTION_FAILED);
    });
});

//# sourceMappingURL=wrap-chart-data-query-error.util.spec.js.map