import { Module } from '@nestjs/common';

import { TasksModule } from 'tasks/tasks.module';
import { AuthModule } from 'auth/auth.module';
import { AppConfigModule } from 'config/app/configuration.module';
import { DBConfigModule } from 'config/db/configuration.module';

@Module({
  imports: [AppConfigModule, DBConfigModule, TasksModule, AuthModule],
})
export class AppModule {}
