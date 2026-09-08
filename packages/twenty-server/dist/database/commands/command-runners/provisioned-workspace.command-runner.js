"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProvisionedWorkspaceCommandRunner", {
    enumerable: true,
    get: function() {
        return ProvisionedWorkspaceCommandRunner;
    }
});
const _workspace = require("twenty-shared/workspace");
const _workspacecommandrunner = require("./workspace.command-runner");
let ProvisionedWorkspaceCommandRunner = class ProvisionedWorkspaceCommandRunner extends _workspacecommandrunner.WorkspaceCommandRunner {
    constructor(workspaceIteratorService){
        super(workspaceIteratorService, _workspace.PROVISIONED_WORKSPACE_ACTIVATION_STATUSES), this.workspaceIteratorService = workspaceIteratorService;
    }
};

//# sourceMappingURL=provisioned-workspace.command-runner.js.map