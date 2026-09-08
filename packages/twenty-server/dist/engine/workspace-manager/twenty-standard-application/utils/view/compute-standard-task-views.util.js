"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "computeStandardTaskViews", {
    enumerable: true,
    get: function() {
        return computeStandardTaskViews;
    }
});
const _i18nlabelutil = require("../i18n-label.util");
const _types = require("twenty-shared/types");
const _indexviewnameconstant = require("../../../../metadata-modules/view/constants/index-view-name.constant");
const _createstandardviewflatmetadatautil = require("./create-standard-view-flat-metadata.util");
const computeStandardTaskViews = (args)=>{
    return {
        allTasks: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'allTasks',
                name: _indexviewnameconstant.INDEX_VIEW_NAME,
                type: _types.ViewType.TABLE,
                key: _types.ViewKey.INDEX,
                position: 0,
                icon: 'IconTable'
            }
        }),
        byStatus: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'byStatus',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "WluVVo",
                    message: "By Status"
                }),
                type: _types.ViewType.KANBAN,
                key: null,
                position: 1,
                icon: 'IconLayoutKanban',
                mainGroupByFieldName: 'status'
            }
        }),
        assignedToMe: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'assignedToMe',
                name: (0, _i18nlabelutil.i18nLabel)(/*i18n*/ {
                    id: "JytrLO",
                    message: "Assigned to Me"
                }),
                type: _types.ViewType.TABLE,
                key: null,
                position: 2,
                icon: 'IconUserCircle',
                mainGroupByFieldName: 'status'
            }
        }),
        taskRecordPageFields: (0, _createstandardviewflatmetadatautil.createStandardViewFlatMetadata)({
            ...args,
            objectName: 'task',
            context: {
                viewName: 'taskRecordPageFields',
                name: 'Task Record Page Fields',
                type: _types.ViewType.FIELDS_WIDGET,
                key: null,
                position: 0,
                icon: 'IconListDetails'
            }
        })
    };
};

//# sourceMappingURL=compute-standard-task-views.util.js.map