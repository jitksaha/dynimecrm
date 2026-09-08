"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddHasPaymentMethodToBillingCustomerFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return AddHasPaymentMethodToBillingCustomerFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddHasPaymentMethodToBillingCustomerFastInstanceCommand = class AddHasPaymentMethodToBillingCustomerFastInstanceCommand {
    async up(queryRunner) {
        const tableExists = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingCustomer'`);
        if (tableExists.length === 0) {
            return;
        }
        await queryRunner.query(`ALTER TABLE "core"."billingCustomer" ADD COLUMN IF NOT EXISTS "hasPaymentMethod" boolean`);
    }
    async down(queryRunner) {
        const tableExists = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = 'billingCustomer'`);
        if (tableExists.length === 0) {
            return;
        }
        await queryRunner.query(`ALTER TABLE "core"."billingCustomer" DROP COLUMN IF EXISTS "hasPaymentMethod"`);
    }
};
AddHasPaymentMethodToBillingCustomerFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.15.0', 1781280240009)
], AddHasPaymentMethodToBillingCustomerFastInstanceCommand);

//# sourceMappingURL=2-15-instance-command-fast-1781280240009-add-has-payment-method-to-billing-customer.js.map