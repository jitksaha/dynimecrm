import { isDefined as c } from "../utils/validation/isDefined.js";
import { ScriptTarget as l, SyntaxKind as n, createSourceFile as y } from "typescript";
var p = "TwentyRecord", f = (r) => {
  const e = r.typeArguments?.[0];
  if (c(e) && e.kind === n.LiteralType && e.literal.kind === n.StringLiteral) return e.literal.text;
}, u = (r) => r.type === "record" ? {
  type: "records",
  objectUniversalIdentifier: r.objectUniversalIdentifier
} : {
  type: "array",
  items: r
}, o = (r) => {
  switch (r.kind) {
    case n.NumberKeyword:
      return { type: "number" };
    case n.StringKeyword:
      return { type: "string" };
    case n.BooleanKeyword:
      return { type: "boolean" };
    case n.ArrayType:
      return u(o(r.elementType));
    case n.TypeReference: {
      const e = r, t = e.typeName.kind === n.Identifier ? e.typeName.text : void 0;
      if (t === "Array" || t === "ReadonlyArray") {
        const i = e.typeArguments?.[0];
        return u(c(i) ? o(i) : {});
      }
      if (t === p) {
        const i = f(e);
        if (c(i)) return {
          type: "record",
          objectUniversalIdentifier: i
        };
      }
      return {};
    }
    case n.ObjectKeyword:
      return { type: "object" };
    case n.TypeLiteral: {
      const e = {};
      return r.members.forEach((t) => {
        if (c(t.name) && c(t.type)) {
          const i = t.name.text;
          e[i] = o(t.type);
        }
      }), {
        type: "object",
        properties: e
      };
    }
    case n.UnionType: {
      const e = r, t = [];
      let i = !0;
      return e.types.forEach((a) => {
        if (a.kind === n.LiteralType) {
          const s = a.literal;
          s.kind === n.StringLiteral ? t.push(s.text) : i = !1;
        } else i = !1;
      }), i ? {
        type: "string",
        enum: t
      } : {};
    }
    default:
      return {};
  }
}, m = (r, e) => r.parameters.reduce((t, i) => {
  const a = i.type;
  return c(a) ? [...t, o(a)] : [...t, {}];
}, e), d = (r) => r.kind === n.FunctionDeclaration ? [r] : r.kind === n.VariableStatement ? r.declarationList.declarations.filter((e) => c(e.initializer) && e.initializer.kind === n.ArrowFunction).map((e) => e.initializer) : [], v = (r) => {
  const e = y("temp.ts", r, l.ESNext, !0);
  let t = [];
  return e.forEachChild((i) => {
    (i.kind === n.FunctionDeclaration || i.kind === n.VariableStatement) && d(i).forEach((a) => {
      t = m(a, t);
    });
  }), t;
};
export {
  v as getFunctionInputSchema
};

//# sourceMappingURL=get-function-input-schema.js.map