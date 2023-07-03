import { Body, ClassSerializerInterceptor, Controller, Delete, DefaultValuePipe, Get, HttpCode, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, SerializeOptions, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { EventsService } from './events.service';
import { PaginateOptions } from 'src/pagination/paginator';
import { CreateEventDto } from './input/create-event.dto';
import { CurrentUser } from 'src/auth/current-user.decorate';
import { User } from 'src/auth/user.entity';
import { UpdateEventDto } from './input/update-event.dto';
import { ListEvents } from './input/list.event';

@Controller('events')
@SerializeOptions({
    strategy: 'excludeAll' // 序列化时排除所有,res为空
})
export class EventsController {
    // 日志
    private readonly logger = new Logger(EventsController.name);

    // 依赖注入
    constructor(
        private readonly eventsService: EventsService
    ) { }

    @Get() // Query: ?xxx=xxx
    @UsePipes(new ValidationPipe({ transform: true })) // 没有提供值时,会填充默认值
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListEvents) {
        const events = await this.eventsService
            .getEventsPaginated({
                total: true,
                currentPage: filter.page,
                limit: filter.limit,
            })
        return events
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const event = await this.eventsService.findOne(id)

        if (!event) {
            throw new NotFoundException()
        }
        return event
    }

    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(
        @Body() input: CreateEventDto,
        @CurrentUser() user: User
    ) {
        return await this.eventsService.createEvent(input)
    }

    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
        @Param('id', ParseIntPipe) id,
        @Body() input: UpdateEventDto,
    ) {
        const event = await this.eventsService.findOne(id)

        if (!event) {
            throw new NotFoundException()
        }

        return await this.eventsService.updateEvent(event, input)
    }
    @Delete(':id')
    @UseGuards(AuthGuardJwt)
    @HttpCode(204)
    async remove(
        @Param('id', ParseIntPipe) id,
    ) {
        const event = await this.eventsService.findOne(id)

        if (!event) {
            throw new NotFoundException()
        }

        await this.eventsService.deleteEvent(id)
    }
}