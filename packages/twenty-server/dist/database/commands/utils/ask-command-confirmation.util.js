"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "askCommandConfirmation", {
    enumerable: true,
    get: function() {
        return askCommandConfirmation;
    }
});
const _promises = require("node:readline/promises");
const askCommandConfirmation = async (message)=>{
    const readline = (0, _promises.createInterface)({
        input: process.stdin,
        output: process.stdout
    });
    try {
        const answer = await readline.question(`${message} (y/N): `);
        return answer.trim().toLowerCase() === 'y';
    } finally{
        readline.close();
    }
};

//# sourceMappingURL=ask-command-confirmation.util.js.map