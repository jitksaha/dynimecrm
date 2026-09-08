import { type JSX } from 'react';
type LinkProps = {
    value: JSX.Element | JSX.Element[] | string;
    href: string;
    color?: string;
};
export declare const Link: ({ value, href, color }: LinkProps) => JSX.Element;
export {};
