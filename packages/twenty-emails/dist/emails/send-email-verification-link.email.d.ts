import { type APP_LOCALES } from 'twenty-shared/translations';
type SendEmailVerificationLinkEmailProps = {
    link: string;
    locale: keyof typeof APP_LOCALES;
    isEmailUpdate?: boolean;
};
export declare function SendEmailVerificationLinkEmail({ link, locale, isEmailUpdate }: SendEmailVerificationLinkEmailProps): import("react").JSX.Element;
export declare namespace SendEmailVerificationLinkEmail {
    var PreviewProps: {
        link: string;
        locale: string;
        isEmailUpdate: boolean;
    };
}
export default SendEmailVerificationLinkEmail;
