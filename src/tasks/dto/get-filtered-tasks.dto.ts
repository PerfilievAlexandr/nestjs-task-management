import { ETaskStatus } from '../tasks.model';

export class GetFilteredTasksDto {
  status: ETaskStatus;
  search: string;
}
