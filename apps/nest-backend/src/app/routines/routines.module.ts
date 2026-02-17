import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { RoutinesController } from './routines.controller';
import { RoutinesRepository } from './routines.repository';
import { RoutinesService } from './routines.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [RoutinesController],
  providers: [RoutinesService, RoutinesRepository]
})
export class RoutinesModule {}
