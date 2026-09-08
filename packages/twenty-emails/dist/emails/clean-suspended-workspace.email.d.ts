import { type APP_LOCALES } from 'twenty-shared/translations';
type CleanSuspendedWorkspaceEmailProps = {
    daysSinceInactive: number;
    userName: string;
    workspaceDisplayName: string | undefined;
    locale: keyof typeof APP_LOCALES;
};
export declare function CleanSuspendedWorkspaceEmail({ daysSinceInactive, userName, workspaceDisplayName, locale }: CleanSuspendedWorkspaceEmailProps): import("react").JSX.Element;
export declare namespace CleanSuspendedWorkspaceEmail {
    var PreviewProps: {
        daysSinceInactive: number;
        userName: string;
        workspaceDisplayName: string;
        locale: string;
    };
}
export default CleanSuspendedWorkspaceEmail;
