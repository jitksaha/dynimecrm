"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddLogicFunctionExecutionModeFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddLogicFunctionExecutionModeFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddLogicFunctionExecutionModeFastInstanceCommand = class AddLogicFunctionExecutionModeFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "core"."logicFunction_executionmode_enum" AS ENUM('LIVE', 'PREBUILT')`);
        await queryRunner.query(`ALTER TABLE "core"."logicFunction" ADD "executionMode" "core"."logicFunction_executionmode_enum" NOT NULL DEFAULT 'LIVE'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "core"."logicFunction" DROP COLUMN "executionMode"`);
        await queryRunner.query(`DROP TYPE "core"."logicFunction_executionmode_enum"`);
    }
};
AddLogicFunctionExecutionModeFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.9.0', 1799000030000)
], AddLogicFunctionExecutionModeFastInstanceCommand);

//# sourceMappingURL=2-9-instance-command-fast-1799000030000-add-logic-function-execution-mode.js.map