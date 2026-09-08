"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _classvalidator = require("class-validator");
const _enablevalidationmetadatacacheutil = require("../enable-validation-metadata-cache.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ValidatedInput = class ValidatedInput {
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], ValidatedInput.prototype, "name", void 0);
describe('enableValidationMetadataCache', ()=>{
    it('should serve repeated identical lookups from cache (same array reference)', ()=>{
        (0, _enablevalidationmetadatacacheutil.enableValidationMetadataCache)();
        const storage = (0, _classvalidator.getMetadataStorage)();
        const first = storage.getTargetValidationMetadatas(ValidatedInput, '', true, false);
        const second = storage.getTargetValidationMetadatas(ValidatedInput, '', true, false);
        expect(first.length).toBeGreaterThan(0);
        expect(second).toBe(first);
    });
    it('should cache independently per lookup arguments', ()=>{
        (0, _enablevalidationmetadatacacheutil.enableValidationMetadataCache)();
        const storage = (0, _classvalidator.getMetadataStorage)();
        const noGroup = storage.getTargetValidationMetadatas(ValidatedInput, '', true, false);
        const withGroup = storage.getTargetValidationMetadatas(ValidatedInput, '', true, false, [
            'a'
        ]);
        expect(withGroup).not.toBe(noGroup);
    });
    it('should be idempotent when installed more than once', ()=>{
        (0, _enablevalidationmetadatacacheutil.enableValidationMetadataCache)();
        (0, _enablevalidationmetadatacacheutil.enableValidationMetadataCache)();
        const storage = (0, _classvalidator.getMetadataStorage)();
        const result = storage.getTargetValidationMetadatas(ValidatedInput, '', true, false);
        expect(Array.isArray(result)).toBe(true);
    });
});

//# sourceMappingURL=enable-validation-metadata-cache.util.spec.js.map