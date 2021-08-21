import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'auth/entity/auth.entity';
import { GetUser } from 'auth/decorators/get-user.decorator';

import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetFilteredTasksDto } from '../dto/get-filtered-tasks.dto';
import { Task } from '../entities/task.entity';
import { ETaskStatus } from '../enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(
    getFilteredTasksDto: GetFilteredTasksDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(getFilteredTasksDto, user);
  }

  async getTaskById(id: number, @GetUser() user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTaskStatus(
    id: number,
    status: ETaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await task.save();

    return task;
  }

  async deleteTaskById(id: number, user: User): Promise<string> {
    const deleted = await this.taskRepository.delete({ id, userId: user.id });

    if (!deleted.affected) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return 'ok';
  }
}
