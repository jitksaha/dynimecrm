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
    get INDEX_FILTER_COLUMN_BY_FILTER_FIELD () {
        return INDEX_FILTER_COLUMN_BY_FILTER_FIELD;
    },
    get IndexFilterInput () {
        return IndexFilterInput;
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
let IndexFilterInput = class IndexFilterInput {
};
_ts_decorate([
    (0, _graphql.Field)(()=>[
            IndexFilterInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], IndexFilterInput.prototype, "and", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>[
            IndexFilterInput
        ], {
        nullable: true
    }),
    _ts_metadata("design:type", Array)
], IndexFilterInput.prototype, "or", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_uuidfiltercomparisoninput.UUIDFilterComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _uuidfiltercomparisoninput.UUIDFilterComparisonInput === "undefined" ? Object : _uuidfiltercomparisoninput.UUIDFilterComparisonInput)
], IndexFilterInput.prototype, "id", void 0);
_ts_decorate([
    (0, _graphql.Field)(()=>_booleanfieldcomparisoninput.BooleanFieldComparisonInput, {
        nullable: true
    }),
    _ts_metadata("design:type", typeof _booleanfieldcomparisoninput.BooleanFieldComparisonInput === "undefined" ? Object : _booleanfieldcomparisoninput.BooleanFieldComparisonInput)
], IndexFilterInput.prototype, "isCustom", void 0);
IndexFilterInput = _ts_decorate([
    (0, _graphql.InputType)('IndexFilter')
], IndexFilterInput);
const INDEX_FILTER_COLUMN_BY_FILTER_FIELD = {
    id: {
        column: 'id',
        type: 'uuid'
    },
    isCustom: {
        column: 'isCustom',
        type: 'boolean'
    }
};

//# sourceMappingURL=index-filter.input.js.map