"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_DESKTOP () {
        return CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_DESKTOP;
    },
    get CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_MOBILE () {
        return CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_MOBILE;
    },
    get CONDITIONAL_DISPLAY_DEVICE_DESKTOP () {
        return CONDITIONAL_DISPLAY_DEVICE_DESKTOP;
    },
    get CONDITIONAL_DISPLAY_DEVICE_MOBILE () {
        return CONDITIONAL_DISPLAY_DEVICE_MOBILE;
    },
    get GRID_LAYOUT_POSITIONS () {
        return GRID_LAYOUT_POSITIONS;
    },
    get TAB_PROPS () {
        return TAB_PROPS;
    },
    get VERTICAL_LIST_LAYOUT_POSITIONS () {
        return VERTICAL_LIST_LAYOUT_POSITIONS;
    },
    get WIDGET_PROPS () {
        return WIDGET_PROPS;
    }
});
const _types = require("twenty-shared/types");
const CONDITIONAL_DISPLAY_DEVICE_MOBILE = {
    and: [
        {
            '===': [
                {
                    var: 'device'
                },
                'MOBILE'
            ]
        }
    ]
};
const CONDITIONAL_DISPLAY_DEVICE_DESKTOP = {
    and: [
        {
            '===': [
                {
                    var: 'device'
                },
                'DESKTOP'
            ]
        }
    ]
};
const CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_MOBILE = 'device == "MOBILE"';
const CONDITIONAL_AVAILABILITY_EXPRESSION_DEVICE_DESKTOP = 'device == "DESKTOP"';
const GRID_LAYOUT_POSITIONS = {
    FULL_WIDTH: {
        layoutMode: _types.PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 12,
        columnSpan: 12
    },
    HALF_HEIGHT: {
        layoutMode: _types.PageLayoutTabLayoutMode.GRID,
        row: 0,
        column: 0,
        rowSpan: 6,
        columnSpan: 12
    },
    RICH_TEXT: {
        layoutMode: _types.PageLayoutTabLayoutMode.GRID,
        row: 12,
        column: 0,
        rowSpan: 6,
        columnSpan: 12
    }
};
const VERTICAL_LIST_LAYOUT_POSITIONS = {
    FIRST: {
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST,
        index: 0
    },
    SECOND: {
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST,
        index: 1
    },
    THIRD: {
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST,
        index: 2
    },
    FOURTH: {
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST,
        index: 3
    },
    FIFTH: {
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST,
        index: 4
    }
};
const TAB_PROPS = {
    home: {
        title: 'Home',
        position: 10,
        icon: 'IconHome',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    timeline: {
        title: 'Timeline',
        position: 20,
        icon: 'IconTimelineEvent',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    tasks: {
        title: 'Tasks',
        position: 30,
        icon: 'IconCheckbox',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    notes: {
        title: 'Notes',
        position: 40,
        icon: 'IconNotes',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    files: {
        title: 'Files',
        position: 50,
        icon: 'IconFiles',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    emails: {
        title: 'Emails',
        position: 60,
        icon: 'IconMail',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    calendar: {
        title: 'Calendar',
        position: 70,
        icon: 'IconCalendarEvent',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    note: {
        title: 'Note',
        position: 15,
        icon: 'IconNotes',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    flow: {
        title: 'Flow',
        position: 10,
        icon: 'IconSettings',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    composer: {
        title: 'Email',
        position: 15,
        icon: 'IconMail',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    },
    flowSecondary: {
        title: 'Flow',
        position: 20,
        icon: 'IconSettings',
        layoutMode: _types.PageLayoutTabLayoutMode.VERTICAL_LIST
    }
};
const WIDGET_PROPS = {
    fields: {
        title: 'Fields',
        type: _types.WidgetType.FIELDS,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    timeline: {
        title: 'Timeline',
        type: _types.WidgetType.TIMELINE,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    tasks: {
        title: 'Tasks',
        type: _types.WidgetType.TASKS,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    notes: {
        title: 'Notes',
        type: _types.WidgetType.NOTES,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    files: {
        title: 'Files',
        type: _types.WidgetType.FILES,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    emails: {
        title: 'Emails',
        type: _types.WidgetType.EMAILS,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    calendar: {
        title: 'Calendar',
        type: _types.WidgetType.CALENDAR,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    noteRichText: {
        title: 'Note',
        type: _types.WidgetType.FIELD_RICH_TEXT,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    taskRichText: {
        title: 'Task',
        type: _types.WidgetType.FIELD_RICH_TEXT,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    workflow: {
        title: 'Flow',
        type: _types.WidgetType.WORKFLOW,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    messageCampaign: {
        title: 'Email',
        type: _types.WidgetType.MESSAGE_CAMPAIGN_BODY,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    workflowVersion: {
        title: 'Flow',
        type: _types.WidgetType.WORKFLOW_VERSION,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    workflowRun: {
        title: 'Flow',
        type: _types.WidgetType.WORKFLOW_RUN,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FIRST
    },
    emailThread: {
        title: 'Thread',
        type: _types.WidgetType.EMAIL_THREAD,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.SECOND
    }
};

//# sourceMappingURL=standard-page-layout-tabs.template.js.map