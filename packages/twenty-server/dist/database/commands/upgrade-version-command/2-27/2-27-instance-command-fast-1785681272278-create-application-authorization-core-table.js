"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateApplicationAuthorizationCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateApplicationAuthorizationCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateApplicationAuthorizationCoreTableFastInstanceCommand = class CreateApplicationAuthorizationCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."applicationAuthorization" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "workspaceId" uuid NOT NULL,
        "applicationId" uuid NOT NULL,
        "userWorkspaceId" uuid NOT NULL,
        "scopes" text array,
        "lastAuthorizedAt" TIMESTAMP WITH TIME ZONE,
        "lastUsedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revokedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_applicationAuthorization_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_APPLICATION_AUTHORIZATION_USER_ID" FOREIGN KEY ("userId")
          REFERENCES "core"."user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_APPLICATION_AUTHORIZATION_WORKSPACE_ID" FOREIGN KEY ("workspaceId")
          REFERENCES "core"."workspace"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_APPLICATION_AUTHORIZATION_APPLICATION_ID" FOREIGN KEY ("applicationId")
          REFERENCES "core"."application"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_APPLICATION_AUTHORIZATION_USER_WORKSPACE_ID" FOREIGN KEY ("userWorkspaceId")
          REFERENCES "core"."userWorkspace"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_APPLICATION_AUTHORIZATION_USER_APPLICATION_UNIQUE" ON "core"."applicationAuthorization" ("userId", "applicationId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_AUTHORIZATION_WORKSPACE_ID" ON "core"."applicationAuthorization" ("workspaceId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_AUTHORIZATION_APPLICATION_ID" ON "core"."applicationAuthorization" ("applicationId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_APPLICATION_AUTHORIZATION_USER_WORKSPACE_ID" ON "core"."applicationAuthorization" ("userWorkspaceId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."applicationAuthorization"`);
    }
};
CreateApplicationAuthorizationCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.27.0', 1785681272278)
], CreateApplicationAuthorizationCoreTableFastInstanceCommand);

//# sourceMappingURL=2-27-instance-command-fast-1785681272278-create-application-authorization-core-table.js.map