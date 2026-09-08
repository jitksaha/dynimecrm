"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _buildapplicationfilelistutil = require("../build-application-file-list.util");
describe('buildApplicationFileList', ()=>{
    it('includes source and built files for logic functions and front components', ()=>{
        const manifest = {
            application: {},
            logicFunctions: [
                {
                    sourceHandlerPath: 'src/send-email.function.ts',
                    builtHandlerPath: 'src/send-email.function.mjs'
                }
            ],
            frontComponents: [
                {
                    sourceComponentPath: 'src/inbox.front-component.tsx',
                    builtComponentPath: 'src/inbox.front-component.mjs'
                }
            ],
            publicAssets: [
                {
                    filePath: 'assets/logo.svg'
                }
            ]
        };
        expect((0, _buildapplicationfilelistutil.buildApplicationFileList)(manifest)).toEqual([
            {
                relativePath: 'package.json',
                fileFolder: _types.FileFolder.Dependencies,
                isRequired: true
            },
            {
                relativePath: 'manifest.json',
                fileFolder: _types.FileFolder.Source,
                isRequired: true
            },
            {
                relativePath: 'src/send-email.function.ts',
                fileFolder: _types.FileFolder.Source,
                isRequired: false
            },
            {
                relativePath: 'src/send-email.function.mjs',
                fileFolder: _types.FileFolder.BuiltLogicFunction,
                isRequired: true
            },
            {
                relativePath: 'src/inbox.front-component.tsx',
                fileFolder: _types.FileFolder.Source,
                isRequired: false
            },
            {
                relativePath: 'src/inbox.front-component.mjs',
                fileFolder: _types.FileFolder.BuiltFrontComponent,
                isRequired: true
            },
            {
                relativePath: 'assets/logo.svg',
                fileFolder: _types.FileFolder.PublicAsset,
                isRequired: true
            }
        ]);
    });
    it('includes the shared dependencies bundle when the application declares one', ()=>{
        const manifest = {
            application: {
                frontComponentSharedDependencies: {
                    dependencies: [
                        'react'
                    ],
                    builtPath: 'front-component-shared-dependencies.mjs',
                    builtChecksum: 'checksum'
                }
            }
        };
        expect((0, _buildapplicationfilelistutil.buildApplicationFileList)(manifest)).toEqual(expect.arrayContaining([
            {
                relativePath: 'front-component-shared-dependencies.mjs',
                fileFolder: _types.FileFolder.BuiltFrontComponent,
                isRequired: true
            }
        ]));
    });
});

//# sourceMappingURL=build-application-file-list.util.spec.js.map