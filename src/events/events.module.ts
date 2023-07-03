import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  providers: [EventsService],
  imports: [
    // 操作数据库需要
    TypeOrmModule.forFeature([Event])
  ],
  controllers: [
    EventsController,
  ],
})
export class EventsModule { }
