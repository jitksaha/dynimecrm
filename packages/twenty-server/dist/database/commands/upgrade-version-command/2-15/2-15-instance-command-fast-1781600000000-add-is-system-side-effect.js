"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddIsSystemSideEffectFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddIsSystemSideEffectFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
const TABLES_WITH_IS_SYSTEM_SIDE_EFFECT = [
    'view',
    'viewField',
    'indexMetadata',
    'commandMenuItem',
    'pageLayout',
    'pageLayoutTab',
    'pageLayoutWidget',
    'fieldMetadata'
];
let AddIsSystemSideEffectFastInstanceCommand = class AddIsSystemSideEffectFastInstanceCommand {
    async up(queryRunner) {
        for (const table of TABLES_WITH_IS_SYSTEM_SIDE_EFFECT){
            await queryRunner.query(`ALTER TABLE "core"."${table}" ADD COLUMN IF NOT EXISTS "isSystemSideEffect" boolean NOT NULL DEFAULT false`);
        }
    }
    async down(queryRunner) {
        for (const table of TABLES_WITH_IS_SYSTEM_SIDE_EFFECT){
            await queryRunner.query(`ALTER TABLE "core"."${table}" DROP COLUMN IF EXISTS "isSystemSideEffect"`);
        }
    }
};
AddIsSystemSideEffectFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.15.0', 1781600000000)
], AddIsSystemSideEffectFastInstanceCommand);

//# sourceMappingURL=2-15-instance-command-fast-1781600000000-add-is-system-side-effect.js.map