import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ETaskStatus, ITask } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-filtered-tasks.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getFilteredTasks(getFilteredTasksDto: GetFilteredTasksDto): ITask[] {
    const { status, search } = getFilteredTasksDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): ITask {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): ITask {
    const { title, description } = createTaskDto;

    const task: ITask = {
      id: uuidv4(),
      title,
      description,
      status: ETaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTaskStatus(id: string, status: ETaskStatus): ITask {
    const selectedTask = this.getTaskById(id);

    if (selectedTask) {
      selectedTask.status = status;

      return selectedTask;
    }
  }

  deleteTaskById(id: string): string {
    const foundTask = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== foundTask.id);

    return 'ok';
  }
}
