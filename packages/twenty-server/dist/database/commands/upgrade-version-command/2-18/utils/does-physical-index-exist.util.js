"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "doesPhysicalIndexExist", {
    enumerable: true,
    get: function() {
        return doesPhysicalIndexExist;
    }
});
const doesPhysicalIndexExist = async ({ queryRunner, schemaName, indexName })=>{
    const result = await queryRunner.query(`SELECT EXISTS (
      SELECT 1
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = $2 AND n.nspname = $1 AND c.relkind IN ('i', 'I')
    ) AS "exists"`, [
        schemaName,
        indexName
    ]);
    return result[0]?.exists === true;
};

//# sourceMappingURL=does-physical-index-exist.util.js.map