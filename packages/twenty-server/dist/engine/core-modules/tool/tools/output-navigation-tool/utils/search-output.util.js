"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "searchOutput", {
    enumerable: true,
    get: function() {
        return searchOutput;
    }
});
const _guards = require("@sniptt/guards");
const _searchoutputmaxmatchlengthconstant = require("../constants/search-output-max-match-length.constant");
const _utils = require("twenty-shared/utils");
const escapeRegExp = (value)=>value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const compilePattern = (pattern)=>{
    try {
        return new RegExp(pattern, 'g');
    } catch  {
        return new RegExp(escapeRegExp(pattern), 'g');
    }
};
const truncateMatch = (match)=>{
    if (match.length <= _searchoutputmaxmatchlengthconstant.SEARCH_OUTPUT_MAX_MATCH_LENGTH) {
        return match;
    }
    const half = Math.floor((_searchoutputmaxmatchlengthconstant.SEARCH_OUTPUT_MAX_MATCH_LENGTH - 1) / 2);
    return `${match.slice(0, half)}…${match.slice(match.length - half)}`;
};
const buildContext = ({ content, index, length, contextChars })=>{
    const start = Math.max(0, index - contextChars);
    const end = Math.min(content.length, index + length + contextChars);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < content.length ? '…' : '';
    return `${prefix}${content.slice(start, end)}${suffix}`;
};
const searchOutput = ({ content, pattern, maxMatches, offset, contextChars })=>{
    if (!(0, _guards.isNonEmptyString)(pattern)) {
        throw new Error('Search pattern must be a non-empty string.');
    }
    const regex = compilePattern(pattern);
    const matches = [];
    let totalMatches = 0;
    let execResult = regex.exec(content);
    while((0, _utils.isDefined)(execResult)){
        const index = execResult.index;
        const matched = execResult[0];
        if (totalMatches >= offset && matches.length < maxMatches) {
            matches.push({
                charOffset: index,
                match: truncateMatch(matched),
                context: buildContext({
                    content,
                    index,
                    length: matched.length,
                    contextChars
                })
            });
        }
        totalMatches += 1;
        if (matched.length === 0) {
            regex.lastIndex += 1;
        }
        execResult = regex.exec(content);
    }
    return {
        matches,
        totalMatches,
        hasMore: offset + matches.length < totalMatches
    };
};

//# sourceMappingURL=search-output.util.js.map