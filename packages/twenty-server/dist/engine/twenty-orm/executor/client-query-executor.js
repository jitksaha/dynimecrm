"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientQueryExecutor", {
    enumerable: true,
    get: function() {
        return ClientQueryExecutor;
    }
});
const _computetwentyormexceptionutil = require("../error-handling/compute-twenty-orm-exception.util");
let ClientQueryExecutor = class ClientQueryExecutor {
    async execute(statement) {
        try {
            const result = await this.client.query({
                text: statement.text,
                values: statement.values
            });
            return result.rows;
        } catch (error) {
            throw (0, _computetwentyormexceptionutil.computeTwentyOrmException)(error);
        }
    }
    constructor({ client }){
        this.client = client;
    }
};

//# sourceMappingURL=client-query-executor.js.map