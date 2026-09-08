import { type APP_LOCALES } from 'twenty-shared/translations';
type ServerAdminAccessChangedEmailProps = {
    actorName: string;
    targetName: string;
    targetEmail: string;
    canAccessFullAdminPanel: boolean;
    canImpersonate: boolean;
    locale: keyof typeof APP_LOCALES;
};
export declare function ServerAdminAccessChangedEmail({ actorName, targetName, targetEmail, canAccessFullAdminPanel, canImpersonate, locale }: ServerAdminAccessChangedEmailProps): import("react").JSX.Element;
export declare namespace ServerAdminAccessChangedEmail {
    var PreviewProps: ServerAdminAccessChangedEmailProps;
}
export default ServerAdminAccessChangedEmail;
