import { type JSX } from 'react';
type CallToActionProps = {
    href: string;
    value: JSX.Element | JSX.Element[] | string;
};
export declare const CallToAction: ({ value, href }: CallToActionProps) => JSX.Element;
export {};
