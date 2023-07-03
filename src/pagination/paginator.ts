import { Expose } from "class-transformer"
import { SelectQueryBuilder } from "typeorm"

// 分页的选项
export interface PaginateOptions {
    limit: number // 单页最多多少数据
    currentPage: number // 当前页数
    total?: boolean // 总共多少数据
}

// 分页结果
export class PaginationResult<T> {
    // Partial: 使 中的所有属性可选
    constructor(partial: Partial<PaginationResult<T>>) {
        // 将所有可枚举自身属性的值从一个或多个源对象复制到 目标对象。返回目标对象
        Object.assign(this, partial)
    }
    @Expose()
    first: number
    @Expose()
    last: number
    @Expose()
    limit: number
    @Expose()
    total?: number
    @Expose()
    data: T[] // 所有数据
}

/**
 * 获取分页结果
 * @param qb 查询器
 * @param options 分页选项
 * @returns 分页结果
 */
export async function paginate<T>(
    qb: SelectQueryBuilder<T>,
    options: PaginateOptions = {
        limit: 10,
        currentPage: 1,
    }
): Promise<PaginationResult<T>> {
    console.log(options);
    console.log(typeof options.limit);

    // 计算偏移
    const offset = (options.currentPage - 1) * options.limit
    // 从数据库查结果
    const data = await qb.limit(options.limit)
        .offset(offset).getMany()
    return new PaginationResult({
        first: offset + 1,
        last: offset + data.length,
        limit: options.limit,
        total: options.total ? await qb.getCount() : null,
        data
    })
}