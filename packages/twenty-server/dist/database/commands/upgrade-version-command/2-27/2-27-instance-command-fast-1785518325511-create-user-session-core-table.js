"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateUserSessionCoreTableFastInstanceCommand", {
    enumerable: true,
    get: function() {
        return CreateUserSessionCoreTableFastInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let CreateUserSessionCoreTableFastInstanceCommand = class CreateUserSessionCoreTableFastInstanceCommand {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "core"."userSession" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "tokenHash" text NOT NULL,
        "userId" uuid NOT NULL,
        "workspaceId" uuid,
        "userWorkspaceId" uuid,
        "authProvider" text NOT NULL,
        "isImpersonating" boolean NOT NULL DEFAULT false,
        "impersonatorUserWorkspaceId" uuid,
        "impersonatedUserWorkspaceId" uuid,
        "userAgent" text,
        "ipAddress" text,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "lastActiveAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revokedAt" TIMESTAMP WITH TIME ZONE,
        "revokedReason" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_userSession_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_USER_SESSION_USER_ID" FOREIGN KEY ("userId")
          REFERENCES "core"."user"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_USER_SESSION_WORKSPACE_ID" FOREIGN KEY ("workspaceId")
          REFERENCES "core"."workspace"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_USER_SESSION_USER_WORKSPACE_ID" FOREIGN KEY ("userWorkspaceId")
          REFERENCES "core"."userWorkspace"("id") ON DELETE CASCADE
      )`);
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_USER_SESSION_TOKEN_HASH_UNIQUE" ON "core"."userSession" ("tokenHash")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_USER_SESSION_USER_ID" ON "core"."userSession" ("userId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_USER_SESSION_WORKSPACE_ID" ON "core"."userSession" ("workspaceId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_USER_SESSION_USER_WORKSPACE_ID" ON "core"."userSession" ("userWorkspaceId")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_USER_SESSION_EXPIRES_AT" ON "core"."userSession" ("expiresAt")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_USER_SESSION_REVOKED_AT" ON "core"."userSession" ("revokedAt")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "core"."userSession"`);
    }
};
CreateUserSessionCoreTableFastInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.27.0', 1785518325511)
], CreateUserSessionCoreTableFastInstanceCommand);

//# sourceMappingURL=2-27-instance-command-fast-1785518325511-create-user-session-core-table.js.map