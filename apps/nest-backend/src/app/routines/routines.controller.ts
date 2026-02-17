import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BearerAuthGuard } from '../auth/guards/bearer-auth.guard';
import { type AuthenticatedUser } from '../auth/types/authenticated-user.type';
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
}
