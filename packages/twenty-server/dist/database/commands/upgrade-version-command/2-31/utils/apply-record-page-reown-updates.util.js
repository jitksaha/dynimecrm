"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyRecordPageReownUpdates", {
    enumerable: true,
    get: function() {
        return applyRecordPageReownUpdates;
    }
});
const _pagelayouttabentity = require("../../../../../engine/metadata-modules/page-layout-tab/entities/page-layout-tab.entity");
const _pagelayoutwidgetentity = require("../../../../../engine/metadata-modules/page-layout-widget/entities/page-layout-widget.entity");
const _pagelayoutentity = require("../../../../../engine/metadata-modules/page-layout/entities/page-layout.entity");
const _viewfieldgroupentity = require("../../../../../engine/metadata-modules/view-field-group/entities/view-field-group.entity");
const _viewfieldentity = require("../../../../../engine/metadata-modules/view-field/entities/view-field.entity");
const _viewentity = require("../../../../../engine/metadata-modules/view/entities/view.entity");
const applyRecordPageReownUpdates = async ({ manager, workspaceId, reownUpdates })=>{
    await manager.transaction(async (entityManager)=>{
        const updatesByEntity = [
            [
                _pagelayoutentity.PageLayoutEntity,
                reownUpdates.pageLayoutUpdates
            ],
            [
                _pagelayouttabentity.PageLayoutTabEntity,
                reownUpdates.pageLayoutTabUpdates
            ],
            [
                _pagelayoutwidgetentity.PageLayoutWidgetEntity,
                reownUpdates.pageLayoutWidgetUpdates
            ],
            [
                _viewentity.ViewEntity,
                reownUpdates.viewUpdates
            ],
            [
                _viewfieldentity.ViewFieldEntity,
                reownUpdates.viewFieldUpdates
            ],
            [
                _viewfieldgroupentity.ViewFieldGroupEntity,
                reownUpdates.viewFieldGroupUpdates
            ]
        ];
        for (const [entity, updates] of updatesByEntity){
            const repository = entityManager.getRepository(entity);
            for (const { id, update } of updates){
                await repository.update({
                    id,
                    workspaceId
                }, update);
            }
        }
    });
};

//# sourceMappingURL=apply-record-page-reown-updates.util.js.map