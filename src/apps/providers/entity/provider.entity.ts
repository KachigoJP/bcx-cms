import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

// Source
import ServiceEntity from 'src/apps/services/entity/index.entity';

@Entity({ name: 'providers' })
export default class ProviderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  phone_code: string;

  @Column({ length: 255, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  second_phone: string;

  @Column({ length: 255, nullable: true })
  country: string;

  @Column({ length: 255, nullable: true })
  region: string;

  @Column({ length: 255, nullable: true })
  state: string;

  @Column({ length: 255, nullable: true })
  city: string;

  @Column({ length: 255, nullable: true })
  zip_code: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
