import { type APP_LOCALES } from 'twenty-shared/translations';
type PasswordUpdateNotifyEmailProps = {
    userName: string;
    email: string;
    link: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function PasswordUpdateNotifyEmail({ userName, email, link, locale }: PasswordUpdateNotifyEmailProps): import("react").JSX.Element;
export declare namespace PasswordUpdateNotifyEmail {
    var PreviewProps: PasswordUpdateNotifyEmailProps;
}
export default PasswordUpdateNotifyEmail;
