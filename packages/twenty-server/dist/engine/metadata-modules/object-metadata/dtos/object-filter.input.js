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
    get OBJECT_FILTER_COLUMN_BY_FILTER_FIELD () {
        return OBJECT_FILTER_COLUMN_BY_FILTER_FIELD;
    },
    get ObjectFilterInput () {
        return ObjectFilterInput;
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
let ObjectFilterInput = class ObjectFilterInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            ObjectFilterInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], ObjectFilterInput.prototype, "and", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            ObjectFilterInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], ObjectFilterInput.prototype, "or", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_uuidfiltercomparisoninput.UUIDFilterComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _uuidfiltercomparisoninput.UUIDFilterComparisonInput === "undefined" ? Object : _uuidfiltercomparisoninput.UUIDFilterComparisonInput)
], ObjectFilterInput.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_uuidfiltercomparisoninput.UUIDFilterComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _uuidfiltercomparisoninput.UUIDFilterComparisonInput === "undefined" ? Object : _uuidfiltercomparisoninput.UUIDFilterComparisonInput)
], ObjectFilterInput.prototype, "universalIdentifier", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isActive", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isRemote", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isSearchable", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isSystem", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isUICreatable", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isUIEditable", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], ObjectFilterInput.prototype, "isUIReadOnly", void 0);
ObjectFilterInput = _ts_decorate([
    (0, _graphql.InputType)('ObjectFilter')
], ObjectFilterInput);
const OBJECT_FILTER_COLUMN_BY_FILTER_FIELD = {
    id: {
        column: 'id',
        type: 'uuid'
    },
    universalIdentifier: {
        column: 'universalIdentifier',
        type: 'uuid'
    },
    isActive: {
        column: 'isActive',
        type: 'boolean'
    },
    isRemote: {
        column: 'isRemote',
        type: 'boolean'
    },
    isSearchable: {
        column: 'isSearchable',
        type: 'boolean'
    },
    isSystem: {
        column: 'isSystem',
        type: 'boolean'
    },
    isUICreatable: {
        column: 'isUICreatable',
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
    }
};

//# sourceMappingURL=object-filter.input.js.map