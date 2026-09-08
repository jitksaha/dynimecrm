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
    get FIELD_FILTER_COLUMN_BY_FILTER_FIELD () {
        return FIELD_FILTER_COLUMN_BY_FILTER_FIELD;
    },
    get FieldFilterInput () {
        return FieldFilterInput;
    }
});
const _graphql = require("@nestjs/graphql");
const _booleanfieldcomparisoninput = require("../../pagination/dtos/boolean-field-comparison.input");
const _uuidfiltercomparisoninput = require("../../pagination/dtos/uuid-filter-comparison.input");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let FieldFilterInput = class FieldFilterInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            FieldFilterInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], FieldFilterInput.prototype, "and", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            FieldFilterInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], FieldFilterInput.prototype, "or", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_uuidfiltercomparisoninput.UUIDFilterComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _uuidfiltercomparisoninput.UUIDFilterComparisonInput === "undefined" ? Object : _uuidfiltercomparisoninput.UUIDFilterComparisonInput)
], FieldFilterInput.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], FieldFilterInput.prototype, "isActive", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], FieldFilterInput.prototype, "isSystem", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], FieldFilterInput.prototype, "isUIEditable", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], FieldFilterInput.prototype, "isUIReadOnly", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_uuidfiltercomparisoninput.UUIDFilterComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _uuidfiltercomparisoninput.UUIDFilterComparisonInput === "undefined" ? Object : _uuidfiltercomparisoninput.UUIDFilterComparisonInput)
], FieldFilterInput.prototype, "objectMetadataId", void 0);
FieldFilterInput = _ts_decorate([
    (0, _graphql.InputType)('FieldFilter')
], FieldFilterInput);
const FIELD_FILTER_COLUMN_BY_FILTER_FIELD = {
    id: {
        column: 'id',
        type: 'uuid'
    },
    isActive: {
        column: 'isActive',
        type: 'boolean'
    },
    isSystem: {
        column: 'isSystem',
        type: 'boolean'
    },
    isUIEditable: {
        column: 'isUIEditable',
        type: 'boolean'
    },
    // The legacy isUIReadOnly column is no longer written since the 2.13
    // rename, so the deprecated filter runs inverted against isUIEditable,
    // consistent with how the field itself is resolved.
    isUIReadOnly: {
        column: 'isUIEditable',
        type: 'boolean',
        invertBooleanValues: true
    },
    objectMetadataId: {
        column: 'objectMetadataId',
        type: 'uuid'
    }
};

//# sourceMappingURL=field-filter.input.js.map