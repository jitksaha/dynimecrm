"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpgradeStatusModule", {
    enumerable: true,
    get: function() {
        return UpgradeStatusModule;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _typeorm = require("@nestjs/typeorm");
const _upgradecommandregistryservice = require("./services/upgrade-command-registry.service");
const _upgrademigrationservice = require("./services/upgrade-migration.service");
const _upgradesequencereaderservice = require("./services/upgrade-sequence-reader.service");
const _upgradestatuscacheservice = require("./services/upgrade-status-cache.service");
const _upgradestatusservice = require("./services/upgrade-status.service");
const _upgrademigrationentity = require("./upgrade-migration.entity");
const _workspaceentity = require("../workspace/workspace.entity");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let UpgradeStatusModule = class UpgradeStatusModule {
};
UpgradeStatusModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _core.DiscoveryModule,
            _typeorm.TypeOrmModule.forFeature([
                _upgrademigrationentity.UpgradeMigrationEntity,
                _workspaceentity.WorkspaceEntity
            ])
        ],
        providers: [
            _upgradecommandregistryservice.UpgradeCommandRegistryService,
            _upgrademigrationservice.UpgradeMigrationService,
            _upgradesequencereaderservice.UpgradeSequenceReaderService,
            _upgradestatuscacheservice.UpgradeStatusCacheService,
            _upgradestatusservice.UpgradeStatusService
        ],
        exports: [
            _upgradecommandregistryservice.UpgradeCommandRegistryService,
            _upgrademigrationservice.UpgradeMigrationService,
            _upgradesequencereaderservice.UpgradeSequenceReaderService,
            _upgradestatuscacheservice.UpgradeStatusCacheService,
            _upgradestatusservice.UpgradeStatusService
        ]
    })
], UpgradeStatusModule);

//# sourceMappingURL=upgrade-status.module.js.map