import { CANVAS_THEME_DEFAULTS as e } from "./canvas-theme.js";
import { isCanvasTheme as m } from "./is-canvas-theme.js";
var s = (r) => m(r) ? {
  ...e,
  ...r
} : null;
export {
  s as resolveCanvasTheme
};

//# sourceMappingURL=resolve-canvas-theme.js.map