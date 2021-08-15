import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskRepository } from './task.repository';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-filtered-tasks.dto';
import { Task } from './task.entity';
import { ETaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(getFilteredTasksDto: GetFilteredTasksDto): Promise<Task[]> {
    return this.taskRepository.getTasks(getFilteredTasksDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async updateTaskStatus(id: number, status: ETaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await task.save();

    return task;
  }

  async deleteTaskById(id: number): Promise<string> {
    const deleted = await this.taskRepository.delete(id);

    if (!deleted.affected) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return 'ok';
  }
}
