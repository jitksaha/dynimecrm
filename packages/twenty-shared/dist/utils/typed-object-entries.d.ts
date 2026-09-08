type StrictEntries<T> = T extends unknown ? {
    [K in keyof T]-?: [K, T[K]];
}[keyof T] : never;
export declare const typedObjectEntries: <T extends Record<string, unknown>>(object: T) => StrictEntries<T>[];
export {};
//# sourceMappingURL=typed-object-entries.d.ts.map