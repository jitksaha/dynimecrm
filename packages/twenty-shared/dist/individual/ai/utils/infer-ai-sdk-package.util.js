import { NATIVE_AI_SDK_PROVIDER_IDS as i } from "../constants/native-ai-sdk-provider-ids.const.js";
var k = (a) => i.includes(a) ? `@ai-sdk/${a}` : "@ai-sdk/openai-compatible";
export {
  k as inferAiSdkPackage
};

//# sourceMappingURL=infer-ai-sdk-package.util.js.map