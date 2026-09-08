"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getPhysicalIndexDefinition", {
    enumerable: true,
    get: function() {
        return getPhysicalIndexDefinition;
    }
});
const getPhysicalIndexDefinition = async ({ queryRunner, schemaName, indexName })=>{
    const result = await queryRunner.query(`SELECT pg_get_indexdef(c.oid) AS "indexdef"
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = $2 AND n.nspname = $1 AND c.relkind IN ('i', 'I')`, [
        schemaName,
        indexName
    ]);
    return result[0]?.indexdef ?? null;
};

//# sourceMappingURL=get-physical-index-definition.util.js.map