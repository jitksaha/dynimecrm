import { ViewType as A } from "../../types/ViewType.js";
var E = {
  [A.TABLE]: A.TABLE,
  [A.KANBAN]: A.KANBAN,
  [A.CALENDAR]: A.CALENDAR,
  [A.LIST]: A.LIST,
  [A.FIELDS_WIDGET]: A.FIELDS_WIDGET,
  [A.TABLE_WIDGET]: A.TABLE,
  [A.KANBAN_WIDGET]: A.KANBAN,
  [A.LIST_WIDGET]: A.LIST,
  [A.CALENDAR_WIDGET]: A.CALENDAR
}, I = (T) => E[T];
export {
  I as getViewLayoutFromViewType
};

//# sourceMappingURL=getViewLayoutFromViewType.js.map