"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isCoreTablePresent", {
    enumerable: true,
    get: function() {
        return isCoreTablePresent;
    }
});
const isCoreTablePresent = async (queryRunner, tableName)=>{
    const rows = await queryRunner.query(`SELECT 1 FROM pg_tables WHERE schemaname = 'core' AND tablename = $1`, [
        tableName
    ]);
    return rows.length > 0;
};

//# sourceMappingURL=is-core-table-present.util.js.map