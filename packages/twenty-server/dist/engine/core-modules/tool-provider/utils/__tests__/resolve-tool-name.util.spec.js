"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _tools = require("../../tools");
const _resolvetoolnameutil = require("../resolve-tool-name.util");
describe('resolveToolName', ()=>{
    it('returns the inner toolName when the wrapper is execute_tool', ()=>{
        const resolved = (0, _resolvetoolnameutil.resolveToolName)({
            toolName: _tools.EXECUTE_TOOL_TOOL_NAME,
            input: {
                toolName: 'find_records',
                arguments: {
                    limit: 10
                }
            }
        });
        expect(resolved).toBe('find_records');
    });
    it('returns the part toolName as-is for non-execute_tool wrappers', ()=>{
        expect((0, _resolvetoolnameutil.resolveToolName)({
            toolName: 'learn_tools',
            input: {
                toolNames: [
                    'find_records'
                ]
            }
        })).toBe('learn_tools');
        expect((0, _resolvetoolnameutil.resolveToolName)({
            toolName: 'load_skills',
            input: {
                skillNames: [
                    'workflow-building'
                ]
            }
        })).toBe('load_skills');
        expect((0, _resolvetoolnameutil.resolveToolName)({
            toolName: 'app_exa_web_search',
            input: {
                query: 'twenty crm'
            }
        })).toBe('app_exa_web_search');
    });
    it('falls back to a sentinel when execute_tool input is malformed', ()=>{
        expect((0, _resolvetoolnameutil.resolveToolName)({
            toolName: _tools.EXECUTE_TOOL_TOOL_NAME,
            input: undefined
        })).toBe(`${_tools.EXECUTE_TOOL_TOOL_NAME}:unknown`);
        expect((0, _resolvetoolnameutil.resolveToolName)({
            toolName: _tools.EXECUTE_TOOL_TOOL_NAME,
            input: {
                toolName: ''
            }
        })).toBe(`${_tools.EXECUTE_TOOL_TOOL_NAME}:unknown`);
        expect((0, _resolvetoolnameutil.resolveToolName)({
            toolName: _tools.EXECUTE_TOOL_TOOL_NAME,
            input: {
                toolName: 42
            }
        })).toBe(`${_tools.EXECUTE_TOOL_TOOL_NAME}:unknown`);
    });
});

//# sourceMappingURL=resolve-tool-name.util.spec.js.map