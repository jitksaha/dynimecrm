import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

const BROWSER_EXTENSION_URL_SCHEMES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
  'extension://',
];

const KNOWN_BROWSER_EXTENSION_ERROR_MESSAGES = [
  "Cannot read properties of undefined (reading 'M_ID')",
  "Cannot read property 'M_ID' of undefined",
  'ResizeObserver loop completed with undelivered notifications',
  'ResizeObserver loop limit exceeded',
];

export const checkIfItsABrowserExtensionError = (error: unknown): boolean => {
  if (!isDefined(error)) {
    return false;
  }

  const message =
    error instanceof Error
      ? error.message
      : isNonEmptyString(error)
        ? error
        : typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            isNonEmptyString(error.message)
          ? error.message
          : '';

  if (
    KNOWN_BROWSER_EXTENSION_ERROR_MESSAGES.some((knownMessage) =>
      message.includes(knownMessage),
    )
  ) {
    return true;
  }

  const stack =
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    isNonEmptyString(error.stack)
      ? error.stack
      : '';

  const fileName =
    typeof error === 'object' &&
    error !== null &&
    'fileName' in error &&
    isNonEmptyString(error.fileName)
      ? error.fileName
      : '';

  const sourceURL =
    typeof error === 'object' &&
    error !== null &&
    'sourceURL' in error &&
    isNonEmptyString(error.sourceURL)
      ? error.sourceURL
      : '';

  const combined = `${stack}\n${fileName}\n${sourceURL}`;

  return BROWSER_EXTENSION_URL_SCHEMES.some((scheme) =>
    combined.includes(scheme),
  );
};
