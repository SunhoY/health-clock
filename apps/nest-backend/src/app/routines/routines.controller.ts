import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
}
