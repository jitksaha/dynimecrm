"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getnativemimetypesformodalitiesutil = require("../get-native-mime-types-for-modalities.util");
describe('getNativeMimeTypesForModalities', ()=>{
    it('returns an empty set when no modalities are provided', ()=>{
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)()).toEqual(new Set());
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)([])).toEqual(new Set());
    });
    it('maps image modality to image MIME types', ()=>{
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)([
            'image'
        ])).toEqual(new Set([
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif'
        ]));
    });
    it('maps image and pdf modalities together', ()=>{
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)([
            'image',
            'pdf'
        ])).toEqual(new Set([
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif',
            'application/pdf'
        ]));
    });
    it('maps audio modality to audio MIME types', ()=>{
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)([
            'audio'
        ])).toEqual(new Set([
            'audio/mpeg',
            'audio/mp3',
            'audio/mp4',
            'audio/wav',
            'audio/x-wav',
            'audio/webm',
            'audio/ogg',
            'audio/flac',
            'audio/aac',
            'audio/aiff',
            'audio/x-m4a'
        ]));
    });
    it('maps video modality to video MIME types', ()=>{
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)([
            'video'
        ])).toEqual(new Set([
            'video/mp4',
            'video/mpeg',
            'video/webm',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-flv',
            'video/x-ms-wmv',
            'video/3gpp'
        ]));
    });
    it('ignores unknown modalities', ()=>{
        expect((0, _getnativemimetypesformodalitiesutil.getNativeMimeTypesForModalities)([
            'unknown',
            'image'
        ])).toEqual(new Set([
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif'
        ]));
    });
});

//# sourceMappingURL=get-native-mime-types-for-modalities.util.spec.js.map