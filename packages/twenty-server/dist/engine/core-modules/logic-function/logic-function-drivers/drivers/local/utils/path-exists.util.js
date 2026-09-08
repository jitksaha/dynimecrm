"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pathExists", {
    enumerable: true,
    get: function() {
        return pathExists;
    }
});
const _fs = require("fs");
const pathExists = async (targetPath)=>{
    try {
        await _fs.promises.access(targetPath);
        return true;
    } catch  {
        return false;
    }
};

//# sourceMappingURL=path-exists.util.js.map