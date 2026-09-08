// Step name of the 2.13 fast instance command that renames isUIReadOnly to
// isUIEditable (inverted polarity) and adds isUICreatable. Referenced by the
// upgrade-aware entity decorators on objectMetadata and fieldMetadata so that
// cross-version upgrades from pre-2.13 schemas keep working: before this step
// is applied, the new columns are hidden from TypeORM and the legacy
// isUIReadOnly column is still written.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RENAME_IS_UI_READ_ONLY_TO_IS_UI_EDITABLE_UPGRADE_COMMAND_NAME", {
    enumerable: true,
    get: function() {
        return RENAME_IS_UI_READ_ONLY_TO_IS_UI_EDITABLE_UPGRADE_COMMAND_NAME;
    }
});
const RENAME_IS_UI_READ_ONLY_TO_IS_UI_EDITABLE_UPGRADE_COMMAND_NAME = '2.13.0_RenameIsUiReadOnlyToIsUiEditableFastInstanceCommand_1781277453604';

//# sourceMappingURL=rename-is-ui-read-only-to-is-ui-editable-upgrade-command-name.constant.js.map