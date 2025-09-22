import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { Point } from '../entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}