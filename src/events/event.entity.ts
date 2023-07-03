import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Expose } from "class-transformer";
import { PaginationResult } from "src/pagination/paginator";

// name: 表名
// @Entity('event', { name: 'event' })
@Entity() // 改变name不会删旧表,而是会创建新表
export class Event {
    constructor(parial?: Partial<Event>) {
        Object.assign(this, parial)
    }

    // @PrimaryGeneratedColumn('uuid')
    // @PrimaryGeneratedColumn('rowid')
    // @PrimaryColumn() // 如果是复合主键,就在每个主键上加
    @PrimaryGeneratedColumn() // 自动生成
    @Expose() // 暴露,序列化可以返回
    id: number;

    @Column({ length: 100 })
    @Expose()
    name: string;

    @Column()
    @Expose()
    description: string;

    // name指定列名
    // @Column({ name: 'when_date' })
    @Column()
    @Expose()
    when: Date;

    @Column()
    @Expose()
    address: string;
}
// 定义返回类型
export type PaginatedEvents = PaginationResult<Event>