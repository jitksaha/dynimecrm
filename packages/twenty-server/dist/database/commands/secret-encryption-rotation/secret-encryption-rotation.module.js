"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SecretEncryptionRotationModule", {
    enumerable: true,
    get: function() {
        return SecretEncryptionRotationModule;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _utils = require("twenty-shared/utils");
const _secretencryptionrotationsiteentriesconstant = require("./constants/secret-encryption-rotation-site-entries.constant");
const _rotatesecretencryptioncommand = require("./rotate-secret-encryption.command");
const _secretencryptionrotationrunnerservice = require("./services/secret-encryption-rotation-runner.service");
const _keyvaluepairentity = require("../../../engine/core-modules/key-value-pair/key-value-pair.entity");
const _secretencryptionmodule = require("../../../engine/core-modules/secret-encryption/secret-encryption.module");
const _twentyconfigmodule = require("../../../engine/core-modules/twenty-config/twenty-config.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const ROTATION_ENTITIES = [
    ...Object.values(_secretencryptionrotationsiteentriesconstant.SECRET_ENCRYPTION_ROTATION_SITE_ENTRIES).map((entry)=>entry.entity),
    _keyvaluepairentity.KeyValuePairEntity
];
const DEDICATED_ROTATION_HANDLERS = [
    ...Object.values(_secretencryptionrotationsiteentriesconstant.SECRET_ENCRYPTION_ROTATION_SITE_ENTRIES).flatMap((entry)=>Object.values(entry.columnSiteNames)).map((meta)=>meta.customHandler).filter(_utils.isDefined),
    ...Object.values(_secretencryptionrotationsiteentriesconstant.SECRET_ENCRYPTION_ROTATION_UNTYPED_SITE_ENTRIES).map((entry)=>entry.handler)
];
let SecretEncryptionRotationModule = class SecretEncryptionRotationModule {
};
SecretEncryptionRotationModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _secretencryptionmodule.SecretEncryptionModule,
            _twentyconfigmodule.TwentyConfigModule,
            _typeorm.TypeOrmModule.forFeature(ROTATION_ENTITIES)
        ],
        providers: [
            ...DEDICATED_ROTATION_HANDLERS,
            _secretencryptionrotationrunnerservice.SecretEncryptionRotationRunnerService,
            _rotatesecretencryptioncommand.RotateSecretEncryptionCommand
        ],
        exports: [
            _secretencryptionrotationrunnerservice.SecretEncryptionRotationRunnerService,
            _rotatesecretencryptioncommand.RotateSecretEncryptionCommand
        ]
    })
], SecretEncryptionRotationModule);

//# sourceMappingURL=secret-encryption-rotation.module.js.map