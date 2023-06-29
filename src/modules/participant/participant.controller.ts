import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common'
import { ParticipantService } from './participant.service'
import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { Participant } from './entities/participant.entity'

@Controller('participant')
export class ParticipantController {
   constructor(private readonly participantService: ParticipantService) {}

   @Get('all')
   findAll(): Promise<Participant[]> {
      return this.participantService.findAll()
   }

   @Get('one/:id')
   findOne(@Param('id') id: string): Promise<Participant> {
      return this.participantService.findOne(+id)
   }

   @Post('create')
   create(
      @Body() createParticipantDto: CreateParticipantDto,
   ): Promise<CreateParticipantDto> {
      return this.participantService.create(createParticipantDto)
   }

   @Put('update/:id')
   update(
      @Param('id') id: string,
      @Body() updateParticipantDto: UpdateParticipantDto,
   ): Promise<UpdateParticipantDto> {
      return this.participantService.update(+id, updateParticipantDto)
   }

   @Delete('delete/:id')
   remove(@Param('id') id: string): Promise<void> {
      return this.participantService.remove(+id)
   }
}
