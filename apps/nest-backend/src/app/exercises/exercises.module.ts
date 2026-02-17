import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExercisesController } from './exercises.controller';
import { ExercisesRepository } from './exercises.repository';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExercisesController],
  providers: [ExercisesService, ExercisesRepository]
})
export class ExercisesModule {}
