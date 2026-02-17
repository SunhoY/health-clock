import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RoutinesController } from './routines.controller';
import { RoutinesRepository } from './routines.repository';
import { RoutinesService } from './routines.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [RoutinesController],
  providers: [RoutinesService, RoutinesRepository]
})
export class RoutinesModule {}
