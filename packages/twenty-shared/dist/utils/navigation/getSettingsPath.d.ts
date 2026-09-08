import { type PathParam } from 'react-router-dom';
import { type SettingsPath } from '../../types';
export declare const getSettingsPath: <T extends SettingsPath>(to: T, params?: { [key in PathParam<`/settings/${T}`>]: string | null; } | undefined, queryParams?: Record<string, any> | undefined, hash?: string | undefined) => string;
//# sourceMappingURL=getSettingsPath.d.ts.map