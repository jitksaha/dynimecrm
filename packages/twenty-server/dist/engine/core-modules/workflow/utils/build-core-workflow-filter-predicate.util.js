"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildCoreWorkflowFilterPredicate", {
    enumerable: true,
    get: function() {
        return buildCoreWorkflowFilterPredicate;
    }
});
const _guards = require("@sniptt/guards");
const _temporalpolyfill = require("temporal-polyfill");
const _utils = require("twenty-shared/utils");
const _graphqlerrorsutil = require("../../graphql/utils/graphql-errors.util");
const _coreworkflowfilterinput = require("../dtos/core-workflow-filter.input");
const _buildcoreworkflowstatuspredicateutil = require("./build-core-workflow-status-predicate.util");
const _workflowworkspaceentity = require("../../../../modules/workflow/common/standard-objects/workflow.workspace-entity");
const NAME_COLUMN = 'c.name';
const UPDATED_AT_COLUMN = 'c."updatedAt"';
const CORE_WORKFLOW_STATUS_VALUES = Object.values(_workflowworkspaceentity.WorkflowStatus);
const requireTextValue = (rule)=>{
    const trimmedValue = rule.value?.trim();
    if (!(0, _guards.isNonEmptyString)(trimmedValue)) {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} requires a value`);
    }
    return trimmedValue;
};
const parseJsonValue = (value)=>{
    try {
        return JSON.parse(value);
    } catch  {
        return value;
    }
};
const parseStatusValue = ({ candidate, rule })=>{
    const status = typeof candidate === 'string' ? CORE_WORKFLOW_STATUS_VALUES.find((statusValue)=>statusValue === candidate) : undefined;
    if (!(0, _utils.isDefined)(status)) {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} requires workflow statuses among ${CORE_WORKFLOW_STATUS_VALUES.join(', ')}`);
    }
    return status;
};
const parseStatusesValue = (rule)=>{
    const rawValue = requireTextValue(rule);
    let candidates;
    try {
        const parsedValue = JSON.parse(rawValue);
        if (!Array.isArray(parsedValue)) {
            throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} requires a JSON array of workflow statuses`);
        }
        candidates = parsedValue;
    } catch (error) {
        if (error instanceof _graphqlerrorsutil.UserInputError) {
            throw error;
        }
        candidates = [
            rawValue
        ];
    }
    const statuses = candidates.map((candidate)=>parseStatusValue({
            candidate,
            rule
        }));
    if (!(0, _utils.isNonEmptyArray)(statuses)) {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} requires at least one workflow status`);
    }
    return statuses;
};
const parseDateValue = (rule)=>{
    const rawValue = requireTextValue(rule);
    const parsedValue = parseJsonValue(rawValue);
    const date = new Date(typeof parsedValue === 'string' ? parsedValue : rawValue);
    if (Number.isNaN(date.getTime())) {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} requires an ISO 8601 date value`);
    }
    return date;
};
const computeDayBounds = (zonedDateTime)=>({
        dayStart: (0, _utils.getPeriodStart)(zonedDateTime, 'DAY').toInstant().toString(),
        nextDayStart: (0, _utils.getNextPeriodStart)(zonedDateTime, 'DAY').toInstant().toString()
    });
const toRuleZonedDateTime = ({ date, rule })=>_temporalpolyfill.Temporal.Instant.fromEpochMilliseconds(date.getTime()).toZonedDateTimeISO(rule.timezone ?? 'UTC');
const parseRelativeDateRange = (rule)=>{
    const relativeDateFilter = (0, _utils.safeParseRelativeDateFilterJsonStringified)(requireTextValue(rule));
    if (!(0, _utils.isDefined)(relativeDateFilter)) {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} requires a relative date filter value`);
    }
    let referenceZonedDateTime;
    try {
        referenceZonedDateTime = _temporalpolyfill.Temporal.Now.zonedDateTimeISO(relativeDateFilter.timezone ?? rule.timezone ?? 'UTC');
    } catch  {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} on field ${rule.fieldKey} carries an invalid timezone`);
    }
    const resolvedFilter = (0, _utils.resolveRelativeDateTimeFilter)(relativeDateFilter, referenceZonedDateTime.round({
        smallestUnit: 'second'
    }));
    return {
        start: resolvedFilter.start.toInstant().toString(),
        end: resolvedFilter.end.toInstant().toString()
    };
};
const buildUpdatedAtRangePredicate = ({ bindParameter, start, end })=>`(${UPDATED_AT_COLUMN} >= ${bindParameter(start)}::timestamptz AND ${UPDATED_AT_COLUMN} < ${bindParameter(end)}::timestamptz)`;
const buildNameIlikePredicate = ({ bindParameter, pattern, negated })=>{
    const comparison = `${NAME_COLUMN} ${negated ? 'NOT ILIKE' : 'ILIKE'} ${bindParameter(pattern)} ESCAPE '\\'`;
    return negated ? `(${NAME_COLUMN} IS NULL OR ${comparison})` : comparison;
};
const buildUpdatedAtComparisonPredicate = ({ bindParameter, rule, sqlOperator })=>`${UPDATED_AT_COLUMN} ${sqlOperator} ${bindParameter(parseDateValue(rule).toISOString())}::timestamptz`;
const PREDICATE_BUILDER_BY_OPERAND_BY_FIELD_KEY = {
    [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.NAME]: {
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS]: ({ rule, bindParameter })=>buildNameIlikePredicate({
                bindParameter,
                pattern: `%${(0, _utils.escapeForIlike)(requireTextValue(rule))}%`,
                negated: false
            }),
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN]: ({ rule, bindParameter })=>buildNameIlikePredicate({
                bindParameter,
                pattern: `%${(0, _utils.escapeForIlike)(requireTextValue(rule))}%`,
                negated: true
            }),
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY]: ()=>`(${NAME_COLUMN} IS NULL OR ${NAME_COLUMN} = '')`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY]: ()=>`(${NAME_COLUMN} IS NOT NULL AND ${NAME_COLUMN} <> '')`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_BEFORE]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_AFTER]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_PAST]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_FUTURE]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_TODAY]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE]: null
    },
    [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.STATUSES]: {
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS]: ({ rule })=>(0, _buildcoreworkflowstatuspredicateutil.buildCoreWorkflowHasAnyOfStatusesPredicate)(parseStatusesValue(rule)),
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN]: ({ rule })=>`(NOT ${(0, _buildcoreworkflowstatuspredicateutil.buildCoreWorkflowHasAnyOfStatusesPredicate)(parseStatusesValue(rule))})`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY]: ()=>`(NOT ${_buildcoreworkflowstatuspredicateutil.CORE_WORKFLOW_HAS_ANY_STATUS_PREDICATE})`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY]: ()=>_buildcoreworkflowstatuspredicateutil.CORE_WORKFLOW_HAS_ANY_STATUS_PREDICATE,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_BEFORE]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_AFTER]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_PAST]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_FUTURE]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_TODAY]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE]: null
    },
    [_coreworkflowfilterinput.CoreWorkflowFilterFieldKey.UPDATED_AT]: {
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS]: ({ rule, bindParameter })=>{
            const { dayStart, nextDayStart } = computeDayBounds(toRuleZonedDateTime({
                date: parseDateValue(rule),
                rule
            }));
            return buildUpdatedAtRangePredicate({
                bindParameter,
                start: dayStart,
                end: nextDayStart
            });
        },
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_BEFORE]: ({ rule, bindParameter })=>buildUpdatedAtComparisonPredicate({
                bindParameter,
                rule,
                sqlOperator: '<'
            }),
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_AFTER]: ({ rule, bindParameter })=>buildUpdatedAtComparisonPredicate({
                bindParameter,
                rule,
                sqlOperator: '>='
            }),
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_PAST]: ()=>`${UPDATED_AT_COLUMN} < now()`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_IN_FUTURE]: ()=>`${UPDATED_AT_COLUMN} > now()`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_TODAY]: ({ rule, bindParameter })=>{
            const { dayStart, nextDayStart } = computeDayBounds(_temporalpolyfill.Temporal.Now.zonedDateTimeISO(rule.timezone ?? 'UTC'));
            return buildUpdatedAtRangePredicate({
                bindParameter,
                start: dayStart,
                end: nextDayStart
            });
        },
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_RELATIVE]: ({ rule, bindParameter })=>{
            const { start, end } = parseRelativeDateRange(rule);
            return buildUpdatedAtRangePredicate({
                bindParameter,
                start,
                end
            });
        },
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_EMPTY]: ()=>`${UPDATED_AT_COLUMN} IS NULL`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT_EMPTY]: ()=>`${UPDATED_AT_COLUMN} IS NOT NULL`,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.CONTAINS]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.DOES_NOT_CONTAIN]: null,
        [_coreworkflowfilterinput.CoreWorkflowFilterOperand.IS_NOT]: null
    }
};
const SEPARATOR_BY_LOGICAL_OPERATOR = {
    [_coreworkflowfilterinput.CoreWorkflowFilterLogicalOperator.AND]: ' AND ',
    [_coreworkflowfilterinput.CoreWorkflowFilterLogicalOperator.OR]: ' OR '
};
const buildRulePredicate = ({ rule, bindParameter })=>{
    const buildPredicate = PREDICATE_BUILDER_BY_OPERAND_BY_FIELD_KEY[rule.fieldKey][rule.operand];
    if (!(0, _utils.isDefined)(buildPredicate)) {
        throw new _graphqlerrorsutil.UserInputError(`Operand ${rule.operand} is not supported on field ${rule.fieldKey}`);
    }
    return buildPredicate({
        rule,
        bindParameter
    });
};
const buildCoreWorkflowFilterPredicate = ({ filter, firstParameterIndex })=>{
    if (!(0, _utils.isDefined)(filter) || !(0, _utils.isNonEmptyArray)(filter.rules)) {
        return {
            parameters: []
        };
    }
    const parameters = [];
    const bindParameter = (value)=>{
        parameters.push(value);
        return `$${firstParameterIndex + parameters.length - 1}`;
    };
    const rulePredicates = filter.rules.map((rule)=>buildRulePredicate({
            rule,
            bindParameter
        }));
    return {
        predicate: `(${rulePredicates.join(SEPARATOR_BY_LOGICAL_OPERATOR[filter.logicalOperator])})`,
        parameters
    };
};

//# sourceMappingURL=build-core-workflow-filter-predicate.util.js.map