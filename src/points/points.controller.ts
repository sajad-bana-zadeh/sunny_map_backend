import { Controller, Post, Get, Body, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { SearchCriteriaDto } from './dto/search-criteria.dto';

@Controller('api')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('points/import')
  @HttpCode(HttpStatus.CREATED)
  async importPoints(@Body() points: CreatePointDto[]) {
    return this.pointsService.importPoints(points);
  }

  @Get('map/density')
  async getPointDensity() {
    return this.pointsService.calculateDensity();
  }

  @Get('points/closest')
  async findClosestPoint(@Query() searchCriteria: SearchCriteriaDto) {
    return this.pointsService.findClosestPoint(
      searchCriteria.productName,
      searchCriteria.productType,
      parseFloat(searchCriteria.latitude),
      parseFloat(searchCriteria.longitude),
    );
  }

  @Get('points')
  async getAllPoints() {
    return this.pointsService.getAllPoints();
  }
}