import { type PathParam } from 'react-router-dom';
import { type AppPath } from '../../types';
export declare const getAppPath: <T extends AppPath>(to: T, params?: { [key in PathParam<T>]: string | null; } | undefined, queryParams?: Record<string, any> | undefined) => string;
//# sourceMappingURL=getAppPath.d.ts.map