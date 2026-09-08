import { type Plugin } from 'vite';
type WywProfilingOptions = {
    devSlowThresholdMs?: number;
    topSlowFilesCount?: number;
    warmupThresholdMs?: number;
};
export declare const createWywProfilingPlugin: (wywPlugin: Plugin<any>, options?: WywProfilingOptions | undefined) => Plugin<any>;
export {};
//# sourceMappingURL=createWywProfilingPlugin.d.ts.map