"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getFlatIndexMetadataMock", {
    enumerable: true,
    get: function() {
        return getFlatIndexMetadataMock;
    }
});
const _faker = require("@faker-js/faker");
const _types = require("twenty-shared/types");
const getFlatIndexMetadataMock = (overrides)=>{
    const createdAt = _faker.faker.date.anytime().toISOString();
    return {
        universalFlatIndexFieldMetadatas: [],
        flatIndexFieldMetadatas: [],
        createdAt,
        id: _faker.faker.string.uuid(),
        indexType: _types.IndexType.BTREE,
        indexWhereClause: null,
        isCustom: false,
        isUnique: false,
        isSystemSideEffect: false,
        name: 'defaultFlatIndexMetadataName',
        updatedAt: createdAt,
        workspaceId: _faker.faker.string.uuid(),
        applicationId: _faker.faker.string.uuid(),
        ...overrides
    };
};

//# sourceMappingURL=get-flat-index-metadata.mock.js.map