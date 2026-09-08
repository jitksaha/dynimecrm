"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MODALITY_TO_MIME_TYPES", {
    enumerable: true,
    get: function() {
        return MODALITY_TO_MIME_TYPES;
    }
});
const MODALITY_TO_MIME_TYPES = {
    image: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/heic',
        'image/heif'
    ],
    pdf: [
        'application/pdf'
    ],
    audio: [
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
    ],
    video: [
        'video/mp4',
        'video/mpeg',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-flv',
        'video/x-ms-wmv',
        'video/3gpp'
    ]
};

//# sourceMappingURL=modality-to-mime-types.constant.js.map