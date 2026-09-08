"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _types = require("twenty-shared/types");
const _widgetgridmaxcolumnsconstant = require("../../constants/widget-grid-max-columns.constant");
const _widgetgridmaxrowsconstant = require("../../constants/widget-grid-max-rows.constant");
const _pagelayoutwidgetexception = require("../../exceptions/page-layout-widget.exception");
const _validatepagelayoutwidgetgridpositionutil = require("../validate-page-layout-widget-grid-position.util");
describe('validatePageLayoutWidgetGridPosition', ()=>{
    const validGridPosition = {
        layoutMode: _types.PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 2,
        columnSpan: 3
    };
    describe('Valid grid positions', ()=>{
        it('should return empty array for valid grid position', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)(validGridPosition, 'Test Widget');
            expect(errors).toEqual([]);
        });
        it('should return empty array for widget at max column boundary', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: 0,
                column: _widgetgridmaxcolumnsconstant.WIDGET_GRID_MAX_COLUMNS - 1,
                rowSpan: 1,
                columnSpan: 1
            }, 'Test Widget');
            expect(errors).toEqual([]);
        });
        it('should return empty array for widget at max row boundary', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: _widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS - 1,
                column: 0,
                rowSpan: 1,
                columnSpan: 1
            }, 'Test Widget');
            expect(errors).toEqual([]);
        });
        it('should return empty array for widget spanning to column grid edge', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: 0,
                column: 8,
                rowSpan: 1,
                columnSpan: 4
            }, 'Test Widget');
            expect(errors).toEqual([]);
        });
        it('should return empty array for widget spanning to row grid edge', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: _widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS - 5,
                column: 0,
                rowSpan: 5,
                columnSpan: 6
            }, 'Test Widget');
            expect(errors).toEqual([]);
        });
    });
    it.each([
        {
            row: -1
        },
        {
            column: -1
        },
        {
            rowSpan: 0
        },
        {
            columnSpan: 0
        },
        {
            row: 0.5
        },
        {
            column: 0.5
        },
        {
            rowSpan: 1.5
        },
        {
            columnSpan: 1.5
        },
        {
            row: undefined
        }
    ])('rejects invalid grid coordinates: %j', (invalidCoordinates)=>{
        const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
            ...validGridPosition,
            ...invalidCoordinates
        }, 'Test Widget');
        expect(errors).toEqual([
            expect.objectContaining({
                code: _pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA
            })
        ]);
    });
    describe('Invalid row positions', ()=>{
        it('should return error for row exceeding max rows', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                ...validGridPosition,
                row: _widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].code).toBe(_pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA);
        });
        it('should return error when widget extends beyond grid height', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: _widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS - 2,
                column: 0,
                rowSpan: 5,
                columnSpan: 6
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some((error)=>error.message.includes('extends beyond grid height'))).toBe(true);
        });
    });
    describe('Invalid column positions', ()=>{
        it('should return error for column exceeding max columns', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                ...validGridPosition,
                column: _widgetgridmaxcolumnsconstant.WIDGET_GRID_MAX_COLUMNS
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].code).toBe(_pagelayoutwidgetexception.PageLayoutWidgetExceptionCode.INVALID_PAGE_LAYOUT_WIDGET_DATA);
        });
    });
    describe('Widget extending beyond grid', ()=>{
        it('should return error when widget extends beyond grid width', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: 0,
                column: 10,
                rowSpan: 1,
                columnSpan: 3
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some((error)=>error.message.includes('extends beyond grid width'))).toBe(true);
        });
    });
    describe('Error messages', ()=>{
        it('should include max columns value in error', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: 0,
                column: 10,
                rowSpan: 1,
                columnSpan: 5
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some((error)=>error.message.includes(_widgetgridmaxcolumnsconstant.WIDGET_GRID_MAX_COLUMNS.toString()))).toBe(true);
        });
        it('should include max rows value in error for row start', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: _widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS + 10,
                column: 0,
                rowSpan: 1,
                columnSpan: 1
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some((error)=>error.message.includes(_widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS.toString()))).toBe(true);
        });
        it('should include max rows value in error for row extension', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: 95,
                column: 0,
                rowSpan: 10,
                columnSpan: 6
            }, 'Test Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some((error)=>error.message.includes(_widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS.toString()))).toBe(true);
        });
        it('should include widget title in error message', ()=>{
            const errors = (0, _validatepagelayoutwidgetgridpositionutil.validatePageLayoutWidgetGridPosition)({
                layoutMode: _types.PageLayoutTabLayoutMode.GRID,
                row: _widgetgridmaxrowsconstant.WIDGET_GRID_MAX_ROWS,
                column: 0,
                rowSpan: 1,
                columnSpan: 1
            }, 'My Custom Widget');
            expect(errors.length).toBeGreaterThan(0);
            expect(errors.some((error)=>error.message.includes('My Custom Widget'))).toBe(true);
        });
    });
});

//# sourceMappingURL=validate-page-layout-widget-grid-position.util.spec.js.map