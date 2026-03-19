import { IsBooleanString, IsOptional } from 'class-validator';

export class GetUserQueryParams {
    @IsBooleanString()
    @IsOptional()
    includeDeactivated?: boolean;
}
