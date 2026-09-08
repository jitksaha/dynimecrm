import { type APP_LOCALES } from 'twenty-shared/translations';
type SendInviteLinkEmailProps = {
    link: string;
    workspace: {
        name: string | undefined;
        logo: string | undefined;
    };
    sender: {
        email: string;
        firstName: string;
        lastName: string;
    };
    serverUrl: string;
    locale: keyof typeof APP_LOCALES;
};
export declare function SendInviteLinkEmail({ link, workspace, sender, serverUrl, locale }: SendInviteLinkEmailProps): import("react").JSX.Element;
export declare namespace SendInviteLinkEmail {
    var PreviewProps: SendInviteLinkEmailProps;
}
export default SendInviteLinkEmail;
