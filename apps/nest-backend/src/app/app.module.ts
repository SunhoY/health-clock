import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoutinesModule } from './routines/routines.module';

@Module({
  imports: [AuthModule, RoutinesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
