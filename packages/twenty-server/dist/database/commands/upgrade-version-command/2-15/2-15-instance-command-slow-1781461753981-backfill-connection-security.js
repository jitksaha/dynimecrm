"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BackfillConnectionSecuritySlowInstanceCommand", {
    enumerable: true,
    get: function() {
        return BackfillConnectionSecuritySlowInstanceCommand;
    }
});
const _registeredinstancecommanddecorator = require("../../../../engine/core-modules/upgrade/decorators/registered-instance-command.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let BackfillConnectionSecuritySlowInstanceCommand = class BackfillConnectionSecuritySlowInstanceCommand {
    async runDataMigration(dataSource) {
        await dataSource.query(`UPDATE "core"."connectedAccount"
       SET "connectionParameters" = jsonb_set(
         "connectionParameters" #- '{SMTP,secure}',
         '{SMTP,connectionSecurity}',
         to_jsonb(
           CASE WHEN "connectionParameters"->'SMTP'->>'port' = '465'
                THEN 'SSL_TLS' ELSE 'STARTTLS' END
         )
       )
       WHERE "connectionParameters" ? 'SMTP'
         AND NOT "connectionParameters"->'SMTP' ? 'connectionSecurity'`);
        await dataSource.query(`UPDATE "core"."connectedAccount"
       SET "connectionParameters" = jsonb_set(
         "connectionParameters" #- '{IMAP,secure}',
         '{IMAP,connectionSecurity}',
         to_jsonb(
           CASE WHEN "connectionParameters"->'IMAP'->>'secure' = 'false'
                THEN 'STARTTLS' ELSE 'SSL_TLS' END
         )
       )
       WHERE "connectionParameters" ? 'IMAP'
         AND NOT "connectionParameters"->'IMAP' ? 'connectionSecurity'`);
        await dataSource.query(`UPDATE "core"."connectedAccount"
       SET "connectionParameters" = jsonb_set(
         "connectionParameters" #- '{CALDAV,secure}',
         '{CALDAV,connectionSecurity}',
         to_jsonb('SSL_TLS'::text)
       )
       WHERE "connectionParameters" ? 'CALDAV'
         AND NOT "connectionParameters"->'CALDAV' ? 'connectionSecurity'`);
    }
    async up(_queryRunner) {
        return;
    }
    async down(_queryRunner) {
        return;
    }
};
BackfillConnectionSecuritySlowInstanceCommand = _ts_decorate([
    (0, _registeredinstancecommanddecorator.RegisteredInstanceCommand)('2.15.0', 1781461753981, {
        type: 'slow'
    })
], BackfillConnectionSecuritySlowInstanceCommand);

//# sourceMappingURL=2-15-instance-command-slow-1781461753981-backfill-connection-security.js.map