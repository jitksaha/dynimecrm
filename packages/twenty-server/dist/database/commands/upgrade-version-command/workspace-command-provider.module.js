"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "WorkspaceCommandProviderModule", {
    enumerable: true,
    get: function() {
        return WorkspaceCommandProviderModule;
    }
});
const _common = require("@nestjs/common");
const _121upgradeversioncommandmodule = require("./1-21/1-21-upgrade-version-command.module");
const _122upgradeversioncommandmodule = require("./1-22/1-22-upgrade-version-command.module");
const _123upgradeversioncommandmodule = require("./1-23/1-23-upgrade-version-command.module");
const _20upgradeversioncommandmodule = require("./2-0/2-0-upgrade-version-command.module");
const _21upgradeversioncommandmodule = require("./2-1/2-1-upgrade-version-command.module");
const _210upgradeversioncommandmodule = require("./2-10/2-10-upgrade-version-command.module");
const _213upgradeversioncommandmodule = require("./2-13/2-13-upgrade-version-command.module");
const _214upgradeversioncommandmodule = require("./2-14/2-14-upgrade-version-command.module");
const _215upgradeversioncommandmodule = require("./2-15/2-15-upgrade-version-command.module");
const _216upgradeversioncommandmodule = require("./2-16/2-16-upgrade-version-command.module");
const _217upgradeversioncommandmodule = require("./2-17/2-17-upgrade-version-command.module");
const _218upgradeversioncommandmodule = require("./2-18/2-18-upgrade-version-command.module");
const _219upgradeversioncommandmodule = require("./2-19/2-19-upgrade-version-command.module");
const _22upgradeversioncommandmodule = require("./2-2/2-2-upgrade-version-command.module");
const _220upgradeversioncommandmodule = require("./2-20/2-20-upgrade-version-command.module");
const _221upgradeversioncommandmodule = require("./2-21/2-21-upgrade-version-command.module");
const _222upgradeversioncommandmodule = require("./2-22/2-22-upgrade-version-command.module");
const _223upgradeversioncommandmodule = require("./2-23/2-23-upgrade-version-command.module");
const _225upgradeversioncommandmodule = require("./2-25/2-25-upgrade-version-command.module");
const _226upgradeversioncommandmodule = require("./2-26/2-26-upgrade-version-command.module");
const _227upgradeversioncommandmodule = require("./2-27/2-27-upgrade-version-command.module");
const _228upgradeversioncommandmodule = require("./2-28/2-28-upgrade-version-command.module");
const _23upgradeversioncommandmodule = require("./2-3/2-3-upgrade-version-command.module");
const _231upgradeversioncommandmodule = require("./2-31/2-31-upgrade-version-command.module");
const _232upgradeversioncommandmodule = require("./2-32/2-32-upgrade-version-command.module");
const _233upgradeversioncommandmodule = require("./2-33/2-33-upgrade-version-command.module");
const _234upgradeversioncommandmodule = require("./2-34/2-34-upgrade-version-command.module");
const _235upgradeversioncommandmodule = require("./2-35/2-35-upgrade-version-command.module");
const _236upgradeversioncommandmodule = require("./2-36/2-36-upgrade-version-command.module");
const _237upgradeversioncommandmodule = require("./2-37/2-37-upgrade-version-command.module");
const _238upgradeversioncommandmodule = require("./2-38/2-38-upgrade-version-command.module");
const _24upgradeversioncommandmodule = require("./2-4/2-4-upgrade-version-command.module");
const _25upgradeversioncommandmodule = require("./2-5/2-5-upgrade-version-command.module");
const _27upgradeversioncommandmodule = require("./2-7/2-7-upgrade-version-command.module");
const _28upgradeversioncommandmodule = require("./2-8/2-8-upgrade-version-command.module");
const _29upgradeversioncommandmodule = require("./2-9/2-9-upgrade-version-command.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let WorkspaceCommandProviderModule = class WorkspaceCommandProviderModule {
};
WorkspaceCommandProviderModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _121upgradeversioncommandmodule.V1_21_UpgradeVersionCommandModule,
            _122upgradeversioncommandmodule.V1_22_UpgradeVersionCommandModule,
            _123upgradeversioncommandmodule.V1_23_UpgradeVersionCommandModule,
            _20upgradeversioncommandmodule.V2_0_UpgradeVersionCommandModule,
            _21upgradeversioncommandmodule.V2_1_UpgradeVersionCommandModule,
            _22upgradeversioncommandmodule.V2_2_UpgradeVersionCommandModule,
            _23upgradeversioncommandmodule.V2_3_UpgradeVersionCommandModule,
            _24upgradeversioncommandmodule.V2_4_UpgradeVersionCommandModule,
            _25upgradeversioncommandmodule.V2_5_UpgradeVersionCommandModule,
            _27upgradeversioncommandmodule.V2_7_UpgradeVersionCommandModule,
            _28upgradeversioncommandmodule.V2_8_UpgradeVersionCommandModule,
            _29upgradeversioncommandmodule.V2_9_UpgradeVersionCommandModule,
            _210upgradeversioncommandmodule.V2_10_UpgradeVersionCommandModule,
            _213upgradeversioncommandmodule.V2_13_UpgradeVersionCommandModule,
            _214upgradeversioncommandmodule.V2_14_UpgradeVersionCommandModule,
            _215upgradeversioncommandmodule.V2_15_UpgradeVersionCommandModule,
            _216upgradeversioncommandmodule.V2_16_UpgradeVersionCommandModule,
            _217upgradeversioncommandmodule.V2_17_UpgradeVersionCommandModule,
            _218upgradeversioncommandmodule.V2_18_UpgradeVersionCommandModule,
            _219upgradeversioncommandmodule.V2_19_UpgradeVersionCommandModule,
            _220upgradeversioncommandmodule.V2_20_UpgradeVersionCommandModule,
            _221upgradeversioncommandmodule.V2_21_UpgradeVersionCommandModule,
            _222upgradeversioncommandmodule.V2_22_UpgradeVersionCommandModule,
            _223upgradeversioncommandmodule.V2_23_UpgradeVersionCommandModule,
            _225upgradeversioncommandmodule.V2_25_UpgradeVersionCommandModule,
            _226upgradeversioncommandmodule.V2_26_UpgradeVersionCommandModule,
            _227upgradeversioncommandmodule.V2_27_UpgradeVersionCommandModule,
            _228upgradeversioncommandmodule.V2_28_UpgradeVersionCommandModule,
            _231upgradeversioncommandmodule.V2_31_UpgradeVersionCommandModule,
            _232upgradeversioncommandmodule.V2_32_UpgradeVersionCommandModule,
            _233upgradeversioncommandmodule.V2_33_UpgradeVersionCommandModule,
            _234upgradeversioncommandmodule.V2_34_UpgradeVersionCommandModule,
            _235upgradeversioncommandmodule.V2_35_UpgradeVersionCommandModule,
            _236upgradeversioncommandmodule.V2_36_UpgradeVersionCommandModule,
            _237upgradeversioncommandmodule.V2_37_UpgradeVersionCommandModule,
            _238upgradeversioncommandmodule.V2_38_UpgradeVersionCommandModule
        ]
    })
], WorkspaceCommandProviderModule);

//# sourceMappingURL=workspace-command-provider.module.js.map