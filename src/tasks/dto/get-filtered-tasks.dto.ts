import { IsIn, IsOptional, IsNotEmpty } from 'class-validator';

import { ETaskStatus } from '../enums/task-status.enum';

export class GetFilteredTasksDto {
  @IsOptional()
  @IsIn([ETaskStatus.OPEN, ETaskStatus.IN_PROGRESS, ETaskStatus.DONE])
  status: ETaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
