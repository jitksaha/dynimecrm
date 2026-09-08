import { type APP_LOCALES } from 'twenty-shared/translations';
type BillingTrialEndingEmailProps = {
    userName: string;
    workspaceDisplayName: string | undefined;
    trialEndsAt: Date;
    dataRetentionDays: number;
    link: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function BillingTrialEndingEmail({ userName, workspaceDisplayName, trialEndsAt, dataRetentionDays, link, locale }: BillingTrialEndingEmailProps): import("react").JSX.Element;
export declare namespace BillingTrialEndingEmail {
    var PreviewProps: BillingTrialEndingEmailProps;
}
export default BillingTrialEndingEmail;
