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
    get getExistingOrStandardFlatEntityOrThrow () {
        return getExistingOrStandardFlatEntityOrThrow;
    },
    get getStandardFlatEntitiesToCreateOrThrow () {
        return getStandardFlatEntitiesToCreateOrThrow;
    }
});
const _utils = require("twenty-shared/utils");
const getStandardFlatEntitiesToCreateOrThrow = ({ standardFlatEntityMaps, existingFlatEntityMaps, universalIdentifiers })=>universalIdentifiers.flatMap((universalIdentifier)=>{
        const standardFlatEntity = standardFlatEntityMaps.byUniversalIdentifier[universalIdentifier];
        if (!(0, _utils.isDefined)(standardFlatEntity)) {
            throw new Error(`Could not find standard entity ${universalIdentifier}`);
        }
        if ((0, _utils.isDefined)(existingFlatEntityMaps.byUniversalIdentifier[universalIdentifier])) {
            return [];
        }
        return [
            standardFlatEntity
        ];
    });
const getExistingOrStandardFlatEntityOrThrow = ({ standardFlatEntityMaps, existingFlatEntityMaps, universalIdentifier })=>{
    const existingFlatEntity = existingFlatEntityMaps.byUniversalIdentifier[universalIdentifier];
    if ((0, _utils.isDefined)(existingFlatEntity)) {
        return existingFlatEntity;
    }
    const standardFlatEntity = standardFlatEntityMaps.byUniversalIdentifier[universalIdentifier];
    if (!(0, _utils.isDefined)(standardFlatEntity)) {
        throw new Error(`Could not find standard entity ${universalIdentifier}`);
    }
    return standardFlatEntity;
};

//# sourceMappingURL=get-standard-flat-entities-to-create-or-throw.util.js.map