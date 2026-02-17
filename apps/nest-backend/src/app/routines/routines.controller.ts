import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BearerAuthGuard } from '../auth/guards/bearer-auth.guard';
import { type AuthenticatedUser } from '../auth/types/authenticated-user.type';
import {
  CreateRoutineRequestDto,
  CreateRoutineResponseDto
} from './dto/create-routine.dto';
import { RoutineSummaryDto } from './dto/routine-summary.dto';
import {
  AppendRoutineExerciseResponseDto,
  UpsertRoutineExerciseRequestDto
} from './dto/upsert-routine-exercise.dto';
import { RoutinesService } from './routines.service';

@Controller('routines')
@UseGuards(BearerAuthGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  getRoutines(
    @CurrentUser() user: AuthenticatedUser
  ): Promise<RoutineSummaryDto[]> {
    return this.routinesService.getRoutineSummariesByUserId(user.id);
  }

  @Post()
  createRoutine(
    @Body() payload: CreateRoutineRequestDto,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<CreateRoutineResponseDto> {
    return this.routinesService.createRoutineByUserId(user.id, payload);
  }

  @Delete(':routineId')
  @HttpCode(204)
  async deleteRoutine(
    @Param('routineId') routineId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<void> {
    await this.routinesService.deleteRoutineByUserId(routineId, user.id);
  }

  @Delete(':routineId/exercises/:routineExerciseId')
  @HttpCode(204)
  async deleteRoutineExercise(
    @Param('routineId') routineId: string,
    @Param('routineExerciseId') routineExerciseId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<void> {
    await this.routinesService.deleteRoutineExerciseByUserId(
      routineId,
      routineExerciseId,
      user.id
    );
  }

  @Patch(':routineId/exercises/:routineExerciseId')
  @HttpCode(204)
  async updateRoutineExercise(
    @Param('routineId') routineId: string,
    @Param('routineExerciseId') routineExerciseId: string,
    @Body() payload: UpsertRoutineExerciseRequestDto,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<void> {
    await this.routinesService.updateRoutineExerciseByUserId(
      routineId,
      routineExerciseId,
      user.id,
      payload
    );
  }

  @Post(':routineId/exercises')
  async appendRoutineExercise(
    @Param('routineId') routineId: string,
    @Body() payload: UpsertRoutineExerciseRequestDto,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<AppendRoutineExerciseResponseDto> {
    return this.routinesService.appendRoutineExerciseByUserId(
      routineId,
      user.id,
      payload
    );
  }
}
