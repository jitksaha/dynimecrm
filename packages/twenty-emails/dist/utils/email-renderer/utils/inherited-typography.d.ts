import { type CSSProperties } from 'react';
declare const INHERITED_TYPOGRAPHY_PROPERTIES: readonly ["color", "fontSize", "lineHeight", "letterSpacing", "textAlign", "fontFamily", "fontWeight"];
export type InheritedTypography = Pick<CSSProperties, (typeof INHERITED_TYPOGRAPHY_PROPERTIES)[number]>;
export declare const pickInheritedTypography: (style: CSSProperties) => InheritedTypography;
export declare const mergeInheritedTypography: (inherited: InheritedTypography, style: CSSProperties) => InheritedTypography;
export {};
