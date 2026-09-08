"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _validateflatviewcalendarfieldsutil = require("../validate-flat-view-calendar-fields.util");
describe('validateFlatViewCalendarFields', ()=>{
    it.each([
        [
            _types.ViewCalendarLayout.DAY,
            _types.FieldMetadataType.DATE
        ],
        [
            _types.ViewCalendarLayout.DAY,
            _types.FieldMetadataType.DATE_TIME
        ],
        [
            _types.ViewCalendarLayout.WEEK,
            _types.FieldMetadataType.DATE
        ],
        [
            _types.ViewCalendarLayout.WEEK,
            _types.FieldMetadataType.DATE_TIME
        ],
        [
            _types.ViewCalendarLayout.MONTH,
            _types.FieldMetadataType.DATE
        ],
        [
            _types.ViewCalendarLayout.MONTH,
            _types.FieldMetadataType.DATE_TIME
        ]
    ])('accepts a %s calendar widget with a %s field', (calendarLayout, type)=>{
        const calendarField = {
            universalIdentifier: 'calendar-field',
            objectMetadataUniversalIdentifier: 'object',
            type
        };
        const flatView = {
            type: _types.ViewType.CALENDAR_WIDGET,
            objectMetadataUniversalIdentifier: 'object',
            calendarLayout,
            calendarFieldMetadataUniversalIdentifier: 'calendar-field',
            calendarEndFieldMetadataUniversalIdentifier: null
        };
        expect((0, _validateflatviewcalendarfieldsutil.validateFlatViewCalendarFields)({
            flatView,
            flatFieldMetadataMaps: {
                byUniversalIdentifier: {
                    'calendar-field': calendarField
                }
            }
        })).toEqual([]);
    });
});

//# sourceMappingURL=validate-flat-view-calendar-fields.util.spec.js.map