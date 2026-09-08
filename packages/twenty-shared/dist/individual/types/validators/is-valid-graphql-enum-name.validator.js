import { registerDecorator as m } from "class-validator";
var t = /^[_A-Za-z][_0-9A-Za-z]*$/, i = (a) => (e, o) => {
  m({
    name: "isValidGraphQLEnumName",
    target: e.constructor,
    propertyName: o,
    options: a,
    validator: {
      validate: (r) => typeof r == "string" && t.test(r),
      defaultMessage: (r) => `${r.property} must match the ${t} format`
    }
  });
};
export {
  i as IsValidGraphQLEnumName
};

//# sourceMappingURL=is-valid-graphql-enum-name.validator.js.map