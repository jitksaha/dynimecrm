"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DataSeedWorkspaceCommand", {
    enumerable: true,
    get: function() {
        return DataSeedWorkspaceCommand;
    }
});
const _common = require("@nestjs/common");
const _nestcommander = require("nest-commander");
const _seederworkspacesconstant = require("../../engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant");
const _devseederservice = require("../../engine/workspace-manager/dev-seeder/services/dev-seeder.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let DataSeedWorkspaceCommand = class DataSeedWorkspaceCommand extends _nestcommander.CommandRunner {
    parseLight() {
        return true;
    }
    async run(_passedParams, options) {
        const workspaceIds = options.light ? [
            _seederworkspacesconstant.SEED_APPLE_WORKSPACE_ID
        ] : [
            _seederworkspacesconstant.SEED_APPLE_WORKSPACE_ID,
            _seederworkspacesconstant.SEED_YCOMBINATOR_WORKSPACE_ID
        ];
        try {
            for (const workspaceId of workspaceIds){
                await this.devSeederService.seedDev(workspaceId, {
                    light: options.light
                });
            }
        } catch (error) {
            this.logger.error(error);
            this.logger.error(error.stack);
        }
    }
    constructor(devSeederService){
        super(), this.devSeederService = devSeederService, this.logger = new _common.Logger(DataSeedWorkspaceCommand.name);
    }
};
_ts_decorate([
    (0, _nestcommander.Option)({
        flags: '--light',
        description: 'Light seed: only seed the Apple workspace (skip YCombinator), skip demo custom objects (Pet, Survey, etc.) and limit records to 5 per object'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", Boolean)
], DataSeedWorkspaceCommand.prototype, "parseLight", null);
DataSeedWorkspaceCommand = _ts_decorate([
    (0, _nestcommander.Command)({
        name: 'workspace:seed:dev',
        description: 'Seed workspace with initial data. This command is intended for development only.'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _devseederservice.DevSeederService === "undefined" ? Object : _devseederservice.DevSeederService
    ])
], DataSeedWorkspaceCommand);

//# sourceMappingURL=data-seed-dev-workspace.command.js.map