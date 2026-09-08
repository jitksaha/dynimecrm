import { RATING_VALUES as t } from "../../../constants/RatingValues.js";
var i = (a) => t.filter((r) => +r.split("_")[1] >= a), n = (a) => t.filter((r) => +r.split("_")[1] <= a), l = (a) => `RATING_${a}`;
export {
  i as convertGreaterThanOrEqualRatingToArrayOfRatingValues,
  n as convertLessThanOrEqualRatingToArrayOfRatingValues,
  l as convertRatingToRatingValue
};

//# sourceMappingURL=fieldRatingConvertors.js.map