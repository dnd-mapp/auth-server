import { IsBoolean, IsOptional } from 'class-validator';

export class GetUserQueryParams {
    @IsBoolean()
    @IsOptional()
    includeDeactivated?: boolean;
}
