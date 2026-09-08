import { type APP_LOCALES } from 'twenty-shared/translations';
type BillingSubscriptionRenewingEmailProps = {
    userName: string;
    workspaceDisplayName: string | undefined;
    renewsAt: Date;
    link: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function BillingSubscriptionRenewingEmail({ userName, workspaceDisplayName, renewsAt, link, locale }: BillingSubscriptionRenewingEmailProps): import("react").JSX.Element;
export declare namespace BillingSubscriptionRenewingEmail {
    var PreviewProps: BillingSubscriptionRenewingEmailProps;
}
export default BillingSubscriptionRenewingEmail;
