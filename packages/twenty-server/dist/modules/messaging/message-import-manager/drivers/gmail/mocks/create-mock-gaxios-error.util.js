"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createMockGaxiosError", {
    enumerable: true,
    get: function() {
        return createMockGaxiosError;
    }
});
const _gaxios = require("gaxios");
const MOCK_URL = new URL('https://gmail.googleapis.com/mocks');
const createMockGaxiosResponse = (status, statusText, data)=>{
    const headers = new Headers();
    const response = {
        config: {
            url: MOCK_URL,
            headers: new Headers()
        },
        data,
        status,
        statusText,
        headers,
        ok: status >= 200 && status < 300,
        redirected: false,
        type: 'default',
        url: MOCK_URL.toString(),
        body: null,
        bodyUsed: true,
        arrayBuffer: ()=>Promise.resolve(new ArrayBuffer(0)),
        blob: ()=>Promise.resolve(new Blob()),
        bytes: ()=>Promise.resolve(new Uint8Array()),
        formData: ()=>Promise.resolve(new FormData()),
        json: ()=>Promise.resolve(data),
        text: ()=>Promise.resolve(''),
        clone: ()=>response
    };
    return response;
};
const createMockGaxiosError = ({ message, status, statusText = '', data })=>{
    return new _gaxios.GaxiosError(message, {
        url: MOCK_URL,
        headers: new Headers()
    }, createMockGaxiosResponse(status, statusText, data));
};

//# sourceMappingURL=create-mock-gaxios-error.util.js.map