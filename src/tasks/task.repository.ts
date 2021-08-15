import { EntityRepository, Repository } from 'typeorm';

import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ETaskStatus } from './enums/task-status.enum';
import { GetFilteredTasksDto } from './dto/get-filtered-tasks.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(getFilteredTasksDto: GetFilteredTasksDto): Promise<Task[]> {
    const { status, search } = getFilteredTasksDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();

    task.description = description;
    task.title = title;
    task.status = ETaskStatus.OPEN;

    await task.save();

    return task;
  }
}
