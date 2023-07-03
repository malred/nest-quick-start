// event.service.ts
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common/services";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginateOptions, paginate } from "../pagination/paginator";
import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import { Event, PaginatedEvents } from "./event.entity";
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name)
    constructor(
        @InjectRepository(Event)
        private readonly eventsRepository: Repository<Event>,
    ) {

    }

    private getEventsBaseQuery(): SelectQueryBuilder<Event> {
        return this.eventsRepository
            .createQueryBuilder('e')
            // .select(['e.id', 'e.name'])
            .orderBy('e.id', 'ASC')
    }

    // 分页查询
    public async getEventsPaginated(paginateOptions: PaginateOptions)
        : Promise<PaginatedEvents> {
        return await paginate<Event>(
            this.getEventsBaseQuery(),
            paginateOptions
        )
    }

    // 查询单个
    public async findOne(id: number): Promise<Event | undefined> {
        return await this.eventsRepository.findOne({ where: { id } })
    }

    // 创建
    public async createEvent(input: CreateEventDto): Promise<Event> {
        return await this.eventsRepository.save(
            new Event({
                ...input,
                when: new Date(input.when)
            })
        )
    }

    // 更新
    public async updateEvent(event: Event, input: UpdateEventDto): Promise<Event> {
        return await this.eventsRepository.save(
            new Event({
                ...event, ...input,
                when: input.when ? new Date(input.when) : event.when
            })
        )
    }

    // 删除
    public async deleteEvent(id: number): Promise<DeleteResult> {
        return await this.eventsRepository
            .createQueryBuilder('e')
            .delete()
            .where('id = :id', { id })
            .execute()
    }
}
