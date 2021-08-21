import { EntityRepository, Repository } from 'typeorm';

import { User } from 'auth/entity/auth.entity';

import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { ETaskStatus } from '../enums/task-status.enum';
import { GetFilteredTasksDto } from '../dto/get-filtered-tasks.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    getFilteredTasksDto: GetFilteredTasksDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = getFilteredTasksDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :id', { id: user.id });

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

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();

    task.description = description;
    task.title = title;
    task.status = ETaskStatus.OPEN;
    task.user = user;

    await task.save();

    delete task.user;

    return task;
  }
}
