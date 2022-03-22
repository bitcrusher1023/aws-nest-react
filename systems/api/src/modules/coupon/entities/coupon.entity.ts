import typeorm from 'typeorm';

import { DiscountType } from '../constants/discount-type.constants';

const {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  Unique,
  UpdateDateColumn,
} = typeorm;

@Entity()
@TableInheritance({
  column: { enum: DiscountType, name: 'discount_type', type: 'enum' },
})
@Unique(['code'])
export abstract class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  product!: string;

  @Column()
  code!: string;

  @Column()
  active!: boolean;

  @Column({
    enum: DiscountType,
    insert: false,
    type: 'enum',
    update: false,
  })
  discountType!: DiscountType;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'timestamp without time zone',
  })
  startDate!: Date;

  @Column({
    nullable: true,
    type: 'timestamp without time zone',
  })
  endDate?: Date;

  @Column({
    default: {},
    type: 'json',
  })
  metadata!: Record<string, unknown>;

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
