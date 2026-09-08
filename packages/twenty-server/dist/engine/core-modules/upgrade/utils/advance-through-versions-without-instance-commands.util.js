"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "advanceThroughVersionsWithoutInstanceCommands", {
    enumerable: true,
    get: function() {
        return advanceThroughVersionsWithoutInstanceCommands;
    }
});
const advanceThroughVersionsWithoutInstanceCommands = ({ completedVersion, supportedVersions, versionsWithInstanceCommands })=>{
    const completedVersionIndex = supportedVersions.indexOf(completedVersion);
    if (completedVersionIndex === -1) {
        throw new Error(`Completed upgrade version "${completedVersion}" is not one of the supported versions [${supportedVersions.join(', ')}]`);
    }
    let reachedVersion = completedVersion;
    for (const version of supportedVersions.slice(completedVersionIndex + 1)){
        if (versionsWithInstanceCommands.has(version)) {
            break;
        }
        reachedVersion = version;
    }
    return reachedVersion;
};

//# sourceMappingURL=advance-through-versions-without-instance-commands.util.js.map