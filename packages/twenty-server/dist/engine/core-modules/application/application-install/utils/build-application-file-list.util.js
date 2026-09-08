"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildApplicationFileList", {
    enumerable: true,
    get: function() {
        return buildApplicationFileList;
    }
});
const _types = require("twenty-shared/types");
const _utils = require("twenty-shared/utils");
const buildApplicationFileList = (manifest)=>{
    const files = [
        {
            relativePath: 'package.json',
            fileFolder: _types.FileFolder.Dependencies,
            isRequired: true
        },
        {
            relativePath: 'manifest.json',
            fileFolder: _types.FileFolder.Source,
            isRequired: true
        }
    ];
    for (const logicFunction of manifest.logicFunctions ?? []){
        files.push({
            relativePath: logicFunction.sourceHandlerPath,
            fileFolder: _types.FileFolder.Source,
            isRequired: false
        }, {
            relativePath: logicFunction.builtHandlerPath,
            fileFolder: _types.FileFolder.BuiltLogicFunction,
            isRequired: true
        });
    }
    for (const frontComponent of manifest.frontComponents ?? []){
        files.push({
            relativePath: frontComponent.sourceComponentPath,
            fileFolder: _types.FileFolder.Source,
            isRequired: false
        }, {
            relativePath: frontComponent.builtComponentPath,
            fileFolder: _types.FileFolder.BuiltFrontComponent,
            isRequired: true
        });
    }
    const sharedDependencies = manifest.application.frontComponentSharedDependencies;
    if ((0, _utils.isDefined)(sharedDependencies)) {
        files.push({
            relativePath: sharedDependencies.builtPath,
            fileFolder: _types.FileFolder.BuiltFrontComponent,
            isRequired: true
        });
    }
    for (const publicAsset of manifest.publicAssets ?? []){
        files.push({
            relativePath: publicAsset.filePath,
            fileFolder: _types.FileFolder.PublicAsset,
            isRequired: true
        });
    }
    return files;
};

//# sourceMappingURL=build-application-file-list.util.js.map