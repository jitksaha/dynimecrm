"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _metadata = require("twenty-shared/metadata");
const _types = require("twenty-shared/types");
const _remaprecordpageuniversalidentifierstopre231util = require("../remap-record-page-universal-identifiers-to-pre-2-31.util");
describe('remapRecordPageUniversalIdentifiersToPre231', ()=>{
    it('should remap derived record-page universal identifiers to their pre-2.31 literals', ()=>{
        const remapped = (0, _remaprecordpageuniversalidentifierstopre231util.remapRecordPageUniversalIdentifiersToPre231)({
            universalIdentifier: _metadata.STANDARD_OBJECTS.callRecording.views.callRecordingRecordPageFields.universalIdentifier,
            nested: {
                viewUniversalIdentifier: _metadata.STANDARD_OBJECTS.calendarEvent.views.calendarEventRecordPageFields.universalIdentifier
            }
        });
        expect(remapped).toEqual({
            universalIdentifier: '99fa8b47-3b11-4f9b-8fbc-e67a9e1da682',
            nested: {
                viewUniversalIdentifier: 'c73668d1-022d-4eaf-b825-4e2548180db6'
            }
        });
    });
    it('should downgrade the FIELDS_WIDGET view key to the pre-2.31 null shape without touching the view type', ()=>{
        const remapped = (0, _remaprecordpageuniversalidentifierstopre231util.remapRecordPageUniversalIdentifiersToPre231)({
            key: null,
            type: _types.ViewType.FIELDS_WIDGET,
            name: 'Call Recording Record Page Fields'
        });
        expect(remapped).toEqual({
            key: null,
            type: _types.ViewType.FIELDS_WIDGET,
            name: 'Call Recording Record Page Fields'
        });
    });
    it('should leave INDEX view keys and unrelated identifiers untouched', ()=>{
        const input = {
            key: _types.ViewKey.INDEX,
            universalIdentifier: '11111111-1111-4111-8111-111111111111'
        };
        expect((0, _remaprecordpageuniversalidentifierstopre231util.remapRecordPageUniversalIdentifiersToPre231)(input)).toEqual(input);
    });
});

//# sourceMappingURL=remap-record-page-universal-identifiers-to-pre-2-31.util.spec.js.map