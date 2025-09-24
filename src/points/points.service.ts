import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from '../entities/point.entity';
import { CreatePointDto } from './dto/create-point.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async importPoints(createPointDtos: CreatePointDto[]) {
    const points = createPointDtos.map(dto => {
      const point = new Point();
      point.name = dto.name;
      point.latitude = dto.location.latitude;
      point.longitude = dto.location.longitude;
      point.inventory = dto.inventory;
      point.contactInfo = dto.contactInfo;
      return point;
    });

    const savedPoints = await this.pointRepository.save(points);
    return {
      message: 'Points imported successfully',
      imported: savedPoints.length,
      points: savedPoints,
    };
  }

  async calculateDensity() {
    const points = await this.pointRepository.find();
    
    // Create grid-based density map
    const gridSize = 0.5; // degrees (approximately 50km)
    const densityMap = new Map<string, { count: number; bounds: number[][] }>();

    points.forEach(point => {
      const latGrid = Math.floor(point.latitude / gridSize) * gridSize;
      const lngGrid = Math.floor(point.longitude / gridSize) * gridSize;
      const gridKey = `${latGrid},${lngGrid}`;

      let grid = densityMap.get(gridKey);
      if (!grid) {
        grid = {
          count: 0,
          bounds: [
            [latGrid, lngGrid],
            [latGrid + gridSize, lngGrid],
            [latGrid + gridSize, lngGrid + gridSize],
            [latGrid, lngGrid + gridSize],
            [latGrid, lngGrid], // Close the polygon
          ],
        };
        densityMap.set(gridKey, grid);
      }

      grid.count++;
    });

    return Array.from(densityMap.entries()).map(([key, value]) => ({
      boundaryName: `Grid_${key}`,
      pointCount: value.count,
      boundaryCoordinates: value.bounds,
    }));
  }

  async findClosestPoint(
    productName: string | undefined,
    productType: string | undefined,
    latitude: number,
    longitude: number,
  ) {
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new BadRequestException('Latitude and longitude are required to find the closest point');
    }

    const points = await this.pointRepository.find();
    
    // Filter points based on inventory criteria
    const filteredPoints = points.filter(point => {
      return point.inventory.some(item => {
        const nameMatch = !productName || 
          item.productName.toLowerCase().includes(productName.toLowerCase());
        const typeMatch = !productType || 
          item.productType.toLowerCase() === productType.toLowerCase();
        return nameMatch && typeMatch && item.quantity > 0;
      });
    });

    if (filteredPoints.length === 0) {
      throw new NotFoundException('No points found matching the criteria');
    }

    // Calculate distances using Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Earth radius in kilometers
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);
      
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Find closest point
    let closestPoint = filteredPoints[0];
    let minDistance = calculateDistance(latitude, longitude, closestPoint.latitude, closestPoint.longitude);

    filteredPoints.forEach(point => {
      const distance = calculateDistance(latitude, longitude, point.latitude, point.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    return {
      ...closestPoint,
      distance: minDistance.toFixed(2) + ' km',
    };
  }

  async getAllPoints() {
    return this.pointRepository.find();
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
