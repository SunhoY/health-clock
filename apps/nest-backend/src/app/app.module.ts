import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [AuthModule, ExercisesModule, RoutinesModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
