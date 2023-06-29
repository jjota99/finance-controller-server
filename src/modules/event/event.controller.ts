import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { EventService } from './event.service'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { Event } from './entities/event.entity'

@Controller('event')
export class EventController {
   constructor(private readonly eventService: EventService) {}

   @Get('all')
   findAll(): Promise<Event[]> {
      return this.eventService.findAll()
   }

   @Get('only/:id')
   findOne(@Param('id') id: string): Promise<Event> {
      return this.eventService.findOne(+id)
   }

   @Post('create')
   create(@Body() createEventDto: CreateEventDto): Promise<CreateEventDto> {
      return this.eventService.create(createEventDto)
   }

   @Put('update/:id')
   update(
      @Param('id') id: string,
      @Body() updateEventDto: UpdateEventDto,
   ): Promise<UpdateEventDto> {
      return this.eventService.update(+id, updateEventDto)
   }

   @Delete('delete/:id')
   remove(@Param('id') id: string): Promise<void> {
      return this.eventService.remove(+id)
   }
}
