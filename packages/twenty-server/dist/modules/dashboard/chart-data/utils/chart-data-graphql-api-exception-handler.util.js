"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "chartDataGraphqlApiExceptionHandler", {
    enumerable: true,
    get: function() {
        return chartDataGraphqlApiExceptionHandler;
    }
});
const _common = require("@nestjs/common");
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../../../engine/core-modules/graphql/utils/graphql-errors.util");
const _chartdataexception = require("../exceptions/chart-data.exception");
const logger = new _common.Logger('ChartDataGraphqlApiExceptionHandler');
const chartDataGraphqlApiExceptionHandler = (error)=>{
    if (error instanceof _chartdataexception.ChartDataException) {
        switch(error.code){
            case _chartdataexception.ChartDataExceptionCode.WIDGET_NOT_FOUND:
            case _chartdataexception.ChartDataExceptionCode.OBJECT_METADATA_NOT_FOUND:
            case _chartdataexception.ChartDataExceptionCode.FIELD_METADATA_NOT_FOUND:
                logger.warn(error.message);
                throw new _graphqlerrorsutil.NotFoundError(error.message);
            case _chartdataexception.ChartDataExceptionCode.INVALID_WIDGET_CONFIGURATION:
                logger.warn(error.message);
                throw new _graphqlerrorsutil.UserInputError(error.message);
            case _chartdataexception.ChartDataExceptionCode.PERMISSION_DENIED:
                logger.warn(error.message);
                throw new _graphqlerrorsutil.ForbiddenError(error.message);
            case _chartdataexception.ChartDataExceptionCode.QUERY_EXECUTION_FAILED:
            case _chartdataexception.ChartDataExceptionCode.TRANSFORMATION_FAILED:
                logger.error(error.message, error.stack);
                throw new _graphqlerrorsutil.InternalServerError(error.message);
            default:
                {
                    return (0, _utils.assertUnreachable)(error.code);
                }
        }
    }
    logger.error(error.message, error.stack);
    throw error;
};

//# sourceMappingURL=chart-data-graphql-api-exception-handler.util.js.map