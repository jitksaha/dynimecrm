"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeModule", {
    enumerable: true,
    get: function() {
        return UpgradeModule;
    }
});
const _common = require("@nestjs/common");
const _commandshutdownmodule = require("../../../database/commands/command-runners/command-shutdown.module");
const _workspaceiteratormodule = require("../../../database/commands/command-runners/workspace-iterator.module");
const _instancecommandprovidermodule = require("../../../database/commands/upgrade-version-command/instance-command-provider.module");
const _workspacecommandprovidermodule = require("../../../database/commands/upgrade-version-command/workspace-command-provider.module");
const _metricsmodule = require("../metrics/metrics.module");
const _instancecommandrunnerservice = require("./services/instance-command-runner.service");
const _upgradesequencerunnerservice = require("./services/upgrade-sequence-runner.service");
const _workspacecommandrunnerservice = require("./services/workspace-command-runner.service");
const _upgradegaugeservice = require("./upgrade-gauge.service");
const _upgradestatusmodule = require("./upgrade-status.module");
const _upgradeawareentitymetadataadapter = require("../../twenty-orm/upgrade-aware/upgrade-aware-entity-metadata.adapter");
const _workspaceversionmodule = require("../../workspace-manager/workspace-version/workspace-version.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UpgradeModule = class UpgradeModule {
};
UpgradeModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _commandshutdownmodule.CommandShutdownModule,
            _instancecommandprovidermodule.InstanceCommandProviderModule,
            _metricsmodule.MetricsModule,
            _upgradestatusmodule.UpgradeStatusModule,
            _workspacecommandprovidermodule.WorkspaceCommandProviderModule,
            _workspaceiteratormodule.WorkspaceIteratorModule,
            _workspaceversionmodule.WorkspaceVersionModule
        ],
        providers: [
            _instancecommandrunnerservice.InstanceCommandRunnerService,
            _workspacecommandrunnerservice.WorkspaceCommandRunnerService,
            _upgradeawareentitymetadataadapter.UpgradeAwareEntityMetadataAdapter,
            _upgradesequencerunnerservice.UpgradeSequenceRunnerService,
            _upgradegaugeservice.UpgradeGaugeService
        ],
        exports: [
            _upgradestatusmodule.UpgradeStatusModule,
            _instancecommandrunnerservice.InstanceCommandRunnerService,
            _workspacecommandrunnerservice.WorkspaceCommandRunnerService,
            _upgradeawareentitymetadataadapter.UpgradeAwareEntityMetadataAdapter,
            _upgradesequencerunnerservice.UpgradeSequenceRunnerService
        ]
    })
], UpgradeModule);

//# sourceMappingURL=upgrade.module.js.map