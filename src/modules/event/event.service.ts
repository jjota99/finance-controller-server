import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

   findAll(): Promise<Event[]> {
      return this.repository.find()
   }

   async findOne(id: number): Promise<Event> {
      try {
         const event = await this.repository.findOneById(id)

         if (event === null) {
            throw new HttpException('Evento não encontrado.', HttpStatus.NOT_FOUND)
         }

         return event
      } catch (error) {
         throw error
      }
   }

   async create(createEventDto: CreateEventDto): Promise<CreateEventDto> {
      const newEvent = await this.repository.create(createEventDto)

      await this.repository.save(newEvent)
      return createEventDto
   }

   async update(id: number, updateEventDto: UpdateEventDto): Promise<UpdateEventDto> {
      await this.repository.update(id, updateEventDto)
      return updateEventDto
   }

   async remove(id: number): Promise<void> {
      try {
         const event = await this.repository.findOneById(id)

         if (event === null) {
            throw new HttpException(
               'Não foi possível deletar evento.',
               HttpStatus.BAD_REQUEST,
            )
         }

         await this.repository.delete(id)
      } catch (error) {
         throw error
      }
   }
}
