import { type APP_LOCALES } from 'twenty-shared/translations';
type SendApprovedAccessDomainValidationProps = {
    link: string;
    domain: string;
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
export declare function SendApprovedAccessDomainValidation({ link, domain, workspace, sender, serverUrl, locale }: SendApprovedAccessDomainValidationProps): import("react").JSX.Element;
export declare namespace SendApprovedAccessDomainValidation {
    var PreviewProps: {
        link: string;
        domain: string;
        workspace: {
            name: string;
            logo: string;
        };
        sender: {
            email: string;
            firstName: string;
            lastName: string;
        };
        serverUrl: string;
        locale: string;
    };
}
export default SendApprovedAccessDomainValidation;
