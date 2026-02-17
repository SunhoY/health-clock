import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import type { BodyPartDto } from './dto/body-part.dto';
import type { CreateBodyPartRequestDto } from './dto/create-body-part.dto';
import type { BodyPartExerciseDto } from './dto/body-part-exercise.dto';
import type { CreateBodyPartExerciseRequestDto } from './dto/create-body-part-exercise.dto';
import { ExercisesService } from './exercises.service';

@Controller()
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('exercises/body-parts')
  getBodyParts(): Promise<BodyPartDto[]> {
    return this.exercisesService.getBodyParts();
  }

  @Post('exercises/body-parts')
  createBodyPart(@Body() payload: CreateBodyPartRequestDto): Promise<BodyPartDto> {
    return this.exercisesService.createBodyPart(payload);
  }

  @Get([
    'body-parts/:bodyPartId/exercises',
    'exercises/body-parts/:bodyPartId/exercises'
  ])
  getExercisesByBodyPart(
    @Param('bodyPartId') bodyPartId: string
  ): Promise<BodyPartExerciseDto[]> {
    return this.exercisesService.getExercisesByBodyPartId(bodyPartId);
  }

  @Post([
    'body-parts/:bodyPartId/exercises',
    'exercises/body-parts/:bodyPartId/exercises'
  ])
  createExerciseByBodyPart(
    @Param('bodyPartId') bodyPartId: string,
    @Body() payload: CreateBodyPartExerciseRequestDto
  ): Promise<BodyPartExerciseDto> {
    return this.exercisesService.createExerciseByBodyPartId(bodyPartId, payload);
  }

  @Delete('exercises/:exerciseCode')
  @HttpCode(204)
  async deleteExerciseByCode(
    @Param('exerciseCode') exerciseCode: string
  ): Promise<void> {
    await this.exercisesService.deleteExerciseByCode(exerciseCode);
  }
}
