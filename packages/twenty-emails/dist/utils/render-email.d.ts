export declare class EmailRenderError extends Error {
    constructor(message: string);
}
export declare const renderEmail: (node: import("react").ReactNode, options?: import("react-email").Options | undefined) => Promise<string>;
