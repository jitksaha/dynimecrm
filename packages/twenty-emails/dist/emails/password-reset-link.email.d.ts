import { type APP_LOCALES } from 'twenty-shared/translations';
type PasswordResetLinkEmailProps = {
    duration: string;
    hasPassword: boolean;
    link: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function PasswordResetLinkEmail({ duration, hasPassword, link, locale }: PasswordResetLinkEmailProps): import("react").JSX.Element;
export declare namespace PasswordResetLinkEmail {
    var PreviewProps: PasswordResetLinkEmailProps;
}
export default PasswordResetLinkEmail;
