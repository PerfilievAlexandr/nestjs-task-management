import { ETaskStatus } from '../enums/task-status.enum';
import { IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class GetFilteredTasksDto {
  @IsOptional()
  @IsIn([ETaskStatus.OPEN, ETaskStatus.IN_PROGRESS, ETaskStatus.DONE])
  status: ETaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
