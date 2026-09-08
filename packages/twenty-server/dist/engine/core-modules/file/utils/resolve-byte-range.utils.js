"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveByteRange", {
    enumerable: true,
    get: function() {
        return resolveByteRange;
    }
});
const _utils = require("twenty-shared/utils");
// Single-range subset of RFC 9110 Range requests; malformed or multi-range
// headers fall back to a full response, which is always a valid answer.
const SINGLE_BYTE_RANGE_HEADER_PATTERN = /^bytes=(\d*)-(\d*)$/i;
const resolveByteRange = ({ rangeHeader, fileSizeInBytes })=>{
    if (!(0, _utils.isDefined)(rangeHeader)) {
        return {
            type: 'full'
        };
    }
    const rangeHeaderMatch = rangeHeader.match(SINGLE_BYTE_RANGE_HEADER_PATTERN);
    if (!(0, _utils.isDefined)(rangeHeaderMatch)) {
        return {
            type: 'full'
        };
    }
    const [, startPart, endPart] = rangeHeaderMatch;
    if (startPart === '' && endPart === '') {
        return {
            type: 'full'
        };
    }
    const lastByteIndex = fileSizeInBytes - 1;
    if (startPart === '') {
        const suffixLength = Number(endPart);
        if (suffixLength === 0 || fileSizeInBytes === 0) {
            return {
                type: 'unsatisfiable'
            };
        }
        return {
            type: 'partial',
            byteRange: {
                startByte: Math.max(fileSizeInBytes - suffixLength, 0),
                endByte: lastByteIndex
            }
        };
    }
    const startByte = Number(startPart);
    if (startByte > lastByteIndex) {
        return {
            type: 'unsatisfiable'
        };
    }
    if (endPart === '') {
        return {
            type: 'partial',
            byteRange: {
                startByte,
                endByte: lastByteIndex
            }
        };
    }
    const requestedEndByte = Number(endPart);
    if (requestedEndByte < startByte) {
        return {
            type: 'full'
        };
    }
    return {
        type: 'partial',
        byteRange: {
            startByte,
            endByte: Math.min(requestedEndByte, lastByteIndex)
        }
    };
};

//# sourceMappingURL=resolve-byte-range.utils.js.map