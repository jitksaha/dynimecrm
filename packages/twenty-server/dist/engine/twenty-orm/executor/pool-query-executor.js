"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PoolQueryExecutor", {
    enumerable: true,
    get: function() {
        return PoolQueryExecutor;
    }
});
const _computetwentyormexceptionutil = require("../error-handling/compute-twenty-orm-exception.util");
let PoolQueryExecutor = class PoolQueryExecutor {
    async execute(statement) {
        try {
            const result = await this.pool.query({
                text: statement.text,
                values: statement.values
            });
            return result.rows;
        } catch (error) {
            throw (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        }
    }
    constructor({ pool }){
        this.pool = pool;
    }
};

//# sourceMappingURL=pool-query-executor.js.map