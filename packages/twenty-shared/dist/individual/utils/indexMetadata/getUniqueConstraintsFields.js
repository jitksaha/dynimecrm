import { isDefined as r } from "../validation/isDefined.js";
var l = (e) => {
  const a = e.indexMetadatas.filter((i) => i.isUnique), o = new Map(e.fields.map((i) => [i.id, i])), n = e.fields.find((i) => i.name === "id");
  if (!r(n)) throw new Error(`Primary key constraint field not found for object metadata ${e.id}`);
  const s = a.map((i) => i.indexFieldMetadatas.map((d) => {
    const t = o.get(d.fieldMetadataId);
    if (!r(t)) throw new Error(`Index field not found for field id ${d.fieldMetadataId} in index metadata ${i.id}`);
    return t;
  }));
  return [[n], ...s];
};
export {
  l as getUniqueConstraintsFields
};

//# sourceMappingURL=getUniqueConstraintsFields.js.map