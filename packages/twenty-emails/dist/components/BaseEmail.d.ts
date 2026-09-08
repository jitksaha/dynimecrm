import { type JSX } from 'react';
import { type APP_LOCALES } from 'twenty-shared/translations';
type BaseEmailProps = {
    children: JSX.Element | JSX.Element[] | string;
    width?: number;
    locale: keyof typeof APP_LOCALES;
};
export declare const BaseEmail: ({ children, width, locale }: BaseEmailProps) => JSX.Element;
export {};
