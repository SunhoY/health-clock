import { Body, Controller, Get, Post } from '@nestjs/common';
import { BodyPartDto } from './dto/body-part.dto';
import { CreateBodyPartRequestDto } from './dto/create-body-part.dto';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('body-parts')
  getBodyParts(): Promise<BodyPartDto[]> {
    return this.exercisesService.getBodyParts();
  }

  @Post('body-parts')
  createBodyPart(@Body() payload: CreateBodyPartRequestDto): Promise<BodyPartDto> {
    return this.exercisesService.createBodyPart(payload);
  }
}
