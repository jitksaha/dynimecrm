"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _fs = /*#__PURE__*/ _interop_require_wildcard(require("fs"));
const _generatefrontconfig = require("../generate-front-config");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
// dotenv runs at import time with override: true, which would clobber the
// per-test process.env we set below. Neutralize it so each test controls env.
jest.mock('dotenv', ()=>({
        config: jest.fn()
    }));
jest.mock('fs');
const mockedFs = _fs;
const INDEX_TEMPLATE = `<html>
  <head>
    <!-- BEGIN: Twenty Config -->
    <script id="twenty-env-config">
      window._env_ = {"REACT_APP_SERVER_BASE_URL":"http://stale-value"};
    </script>
    <!-- END: Twenty Config -->
  </head>
</html>`;
// Pull the injected _env_ object back out of the written index.html and
// normalize whitespace so the multi-line output can be compared against a
// compact expected string.
const getInjectedEnv = ()=>{
    const writtenContent = mockedFs.writeFileSync.mock.calls[0][1];
    const match = writtenContent.match(/window\._env_ = (\{[\s\S]*?\});/);
    return match ? match[1].replace(/\s+/g, '') : '';
};
describe('generateFrontConfig', ()=>{
    const ORIGINAL_ENV = process.env;
    beforeEach(()=>{
        jest.clearAllMocks();
        process.env = {
            ...ORIGINAL_ENV
        };
        mockedFs.readFileSync.mockReturnValue(INDEX_TEMPLATE);
    });
    afterAll(()=>{
        process.env = ORIGINAL_ENV;
    });
    it('should clear any baked value so the front resolves the API origin from the page origin', ()=>{
        process.env.SERVER_URL = 'http://x.com';
        (0, _generatefrontconfig.generateFrontConfig)();
        expect(getInjectedEnv()).toBe('{}');
    });
});

//# sourceMappingURL=generate-front-config.spec.js.map