"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "buildMutationQueryBuilder", {
    enumerable: true,
    get: function() {
        return buildMutationQueryBuilder;
    }
});
const buildMutationQueryBuilder = ({ repository, alias, filter, commonQueryParser })=>{
    const filteredQueryBuilder = repository.createQueryBuilder(alias);
    commonQueryParser.applyFilterToBuilder(filteredQueryBuilder, alias, filter);
    const hasRelationTraversal = filteredQueryBuilder.getJoinAliases().length > 0;
    if (!hasRelationTraversal) {
        return {
            selectQueryBuilder: filteredQueryBuilder,
            rowLevelPermissionsApplied: false
        };
    }
    const idSubQueryBuilder = filteredQueryBuilder.select(`${alias}.id`).withDeleted();
    repository.applyWriteRowLevelPermissions(idSubQueryBuilder);
    const selectQueryBuilder = repository.createQueryBuilder(alias).where(`"${alias}"."id" IN (${idSubQueryBuilder.getQuery()})`).setParameters(idSubQueryBuilder.getParameters());
    return {
        selectQueryBuilder,
        rowLevelPermissionsApplied: true
    };
};

//# sourceMappingURL=build-mutation-query-builder.util.js.map