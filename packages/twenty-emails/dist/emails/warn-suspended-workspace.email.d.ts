import { type APP_LOCALES } from 'twenty-shared/translations';
type WarnSuspendedWorkspaceEmailProps = {
    daysSinceInactive: number;
    inactiveDaysBeforeDelete: number;
    userName: string;
    workspaceDisplayName: string | undefined;
    link: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function WarnSuspendedWorkspaceEmail({ daysSinceInactive, inactiveDaysBeforeDelete, userName, workspaceDisplayName, link, locale }: WarnSuspendedWorkspaceEmailProps): import("react").JSX.Element;
export declare namespace WarnSuspendedWorkspaceEmail {
    var PreviewProps: {
        daysSinceInactive: number;
        inactiveDaysBeforeDelete: number;
        userName: string;
        workspaceDisplayName: string;
        link: string;
        locale: string;
    };
}
export default WarnSuspendedWorkspaceEmail;
