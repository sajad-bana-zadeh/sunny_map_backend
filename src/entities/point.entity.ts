import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('points')
export class Point {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column('simple-json')
  inventory: Array<{
    productName: string;
    productType: string;
    quantity: number;
  }>;

  @Column('simple-json')
  contactInfo: {
    email: string;
    phone: string;
  };
}