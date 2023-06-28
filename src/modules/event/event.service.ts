import { Injectable } from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { EventRepository } from './repository/event.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Event } from './entities/event.entity'

@Injectable()
export class EventService {
   constructor(
      @InjectRepository(Event)
      private repository: EventRepository,
   ) {}
   create(createEventDto: CreateEventDto) {
      return this.repository.create(createEventDto)
   }

   findAll() {
      return this.repository.find()
   }

   findOne(id: number) {
      return this.repository.findOneById(id)
   }

   update(id: number, updateEventDto: UpdateEventDto) {
      return this.repository.update(id, updateEventDto)
   }

   remove(id: number) {
      return this.repository.delete(id)
   }
}
