import { type z } from 'zod';
import { type FilterableAndTSVectorFieldType, type ViewFilterOperand } from '../../../../types';
export declare const getFilterValueSchema: ({ filterType, operand, subFieldName, }: {
    filterType: FilterableAndTSVectorFieldType;
    operand: ViewFilterOperand;
    subFieldName?: string | null | undefined;
}) => z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>> | undefined;
//# sourceMappingURL=getFilterValueSchema.d.ts.map