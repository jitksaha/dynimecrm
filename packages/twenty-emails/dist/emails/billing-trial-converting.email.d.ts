import { type APP_LOCALES } from 'twenty-shared/translations';
type BillingTrialConvertingEmailProps = {
    userName: string;
    workspaceDisplayName: string | undefined;
    trialEndsAt: Date;
    interval: 'month' | 'year';
    link: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function BillingTrialConvertingEmail({ userName, workspaceDisplayName, trialEndsAt, interval, link, locale }: BillingTrialConvertingEmailProps): import("react").JSX.Element;
export declare namespace BillingTrialConvertingEmail {
    var PreviewProps: BillingTrialConvertingEmailProps;
}
export default BillingTrialConvertingEmail;
