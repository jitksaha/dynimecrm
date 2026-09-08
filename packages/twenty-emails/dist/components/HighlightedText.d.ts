import { type JSX } from 'react';
type HighlightedTextProps = {
    value: JSX.Element | JSX.Element[] | string | undefined;
    centered?: boolean;
};
export declare const HighlightedText: ({ value }: HighlightedTextProps) => JSX.Element;
export {};
