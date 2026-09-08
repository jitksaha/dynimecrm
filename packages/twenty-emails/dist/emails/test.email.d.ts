import { type APP_LOCALES } from 'twenty-shared/translations';
type TestEmailProps = {
    locale: keyof typeof APP_LOCALES;
};
export declare function TestEmail({ locale }: TestEmailProps): import("react").JSX.Element;
export declare namespace TestEmail {
    var PreviewProps: {
        locale: string;
    };
}
export default TestEmail;
