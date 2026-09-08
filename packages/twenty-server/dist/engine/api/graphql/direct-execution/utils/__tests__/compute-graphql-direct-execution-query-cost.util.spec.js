"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _graphql = require("graphql");
const _computegraphqldirectexecutionquerycostutil = require("../compute-graphql-direct-execution-query-cost.util");
const _extractargumentsfromastutil = require("../extract-arguments-from-ast.util");
const _graphqlbuildfragmentmaputil = require("../graphql-build-fragment-map.util");
const _graphqlextracttoplevelfieldsutil = require("../graphql-extract-top-level-fields.util");
const _resolvermethodnames = require("../../../workspace-resolver-builder/constants/resolver-method-names");
describe('computeGraphQLDirectExecutionQueryCost', ()=>{
    it('multiplies selected fields by the requested row count', ()=>{
        const document = (0, _graphql.parse)(`
      query FindPeople($first: Int!) {
        people(first: $first) {
          edges {
            node {
              id
              name {
                firstName
                lastName
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `);
        const variables = {
            first: 25
        };
        const [field] = (0, _graphqlextracttoplevelfieldsutil.graphQLExtractTopLevelFields)(document, 'FindPeople');
        const result = (0, _computegraphqldirectexecutionquerycostutil.computeGraphQLDirectExecutionQueryCost)({
            rootFields: [
                {
                    field,
                    method: _resolvermethodnames.RESOLVER_METHOD_NAMES.FIND_MANY,
                    args: (0, _extractargumentsfromastutil.extractArgumentsFromAst)(field.arguments, variables)
                }
            ],
            fragmentMap: (0, _graphqlbuildfragmentmaputil.graphQLBuildFragmentMap)(document)
        });
        expect(result).toEqual({
            estimatedResultFieldCount: 125,
            requestedRowCount: 25,
            selectedLeafFieldCount: 5
        });
    });
    it('uses the maximum page size when find many has no explicit limit', ()=>{
        const document = (0, _graphql.parse)(`
      query FindPeople {
        people {
          edges {
            node {
              id
              name {
                firstName
              }
            }
          }
        }
      }
    `);
        const [field] = (0, _graphqlextracttoplevelfieldsutil.graphQLExtractTopLevelFields)(document, 'FindPeople');
        const result = (0, _computegraphqldirectexecutionquerycostutil.computeGraphQLDirectExecutionQueryCost)({
            rootFields: [
                {
                    field,
                    method: _resolvermethodnames.RESOLVER_METHOD_NAMES.FIND_MANY,
                    args: {}
                }
            ],
            fragmentMap: (0, _graphqlbuildfragmentmaputil.graphQLBuildFragmentMap)(document)
        });
        expect(result).toEqual({
            estimatedResultFieldCount: 400,
            requestedRowCount: 200,
            selectedLeafFieldCount: 2
        });
    });
    it('counts fragment fields and combines root resolver costs', ()=>{
        const document = (0, _graphql.parse)(`
      query FindRecords {
        people(first: 10) {
          edges {
            node {
              ...PersonFields
            }
          }
        }
        findOneCompany(filter: { id: { eq: "company-id" } }) {
          id
          name
        }
      }

      fragment PersonFields on Person {
        id
        jobTitle
      }
    `);
        const fields = (0, _graphqlextracttoplevelfieldsutil.graphQLExtractTopLevelFields)(document, 'FindRecords');
        const result = (0, _computegraphqldirectexecutionquerycostutil.computeGraphQLDirectExecutionQueryCost)({
            rootFields: [
                {
                    field: fields[0],
                    method: _resolvermethodnames.RESOLVER_METHOD_NAMES.FIND_MANY,
                    args: (0, _extractargumentsfromastutil.extractArgumentsFromAst)(fields[0].arguments, {})
                },
                {
                    field: fields[1],
                    method: _resolvermethodnames.RESOLVER_METHOD_NAMES.FIND_ONE,
                    args: (0, _extractargumentsfromastutil.extractArgumentsFromAst)(fields[1].arguments, {})
                }
            ],
            fragmentMap: (0, _graphqlbuildfragmentmaputil.graphQLBuildFragmentMap)(document)
        });
        expect(result).toEqual({
            estimatedResultFieldCount: 22,
            requestedRowCount: 11,
            selectedLeafFieldCount: 4
        });
    });
    it('computes each shared fragment once', ()=>{
        const fragmentCount = 60;
        const fragmentDefinitions = Array.from({
            length: fragmentCount
        }, (_, index)=>index === fragmentCount - 1 ? `fragment SharedFragment${index} on Person { id }` : `fragment SharedFragment${index} on Person {
              ...SharedFragment${index + 1}
              ...SharedFragment${index + 1}
            }`).join('\n');
        const document = (0, _graphql.parse)(`
      query FindPeople {
        people(first: 1) {
          edges {
            node {
              ...SharedFragment0
            }
          }
        }
      }

      ${fragmentDefinitions}
    `);
        const [field] = (0, _graphqlextracttoplevelfieldsutil.graphQLExtractTopLevelFields)(document, 'FindPeople');
        const fragmentMap = (0, _graphqlbuildfragmentmaputil.graphQLBuildFragmentMap)(document);
        const fragmentLookupSpy = jest.spyOn(fragmentMap, 'get');
        const result = (0, _computegraphqldirectexecutionquerycostutil.computeGraphQLDirectExecutionQueryCost)({
            rootFields: [
                {
                    field,
                    method: _resolvermethodnames.RESOLVER_METHOD_NAMES.FIND_MANY,
                    args: {
                        first: 1
                    }
                }
            ],
            fragmentMap
        });
        expect(result).toEqual({
            estimatedResultFieldCount: Number.MAX_SAFE_INTEGER,
            requestedRowCount: 1,
            selectedLeafFieldCount: Number.MAX_SAFE_INTEGER
        });
        expect(fragmentLookupSpy).toHaveBeenCalledTimes(fragmentCount);
    });
});

//# sourceMappingURL=compute-graphql-direct-execution-query-cost.util.spec.js.map