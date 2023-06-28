import { Injectable } from '@nestjs/common'
import { CreateParticipantDto } from './dto/create-participant.dto'
import { UpdateParticipantDto } from './dto/update-participant.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Participant } from './entities/participant.entity'
import { ParticipantRepository } from './repository/participant.repository'

@Injectable()
export class ParticipantService {
   constructor(
      @InjectRepository(Participant)
      private repository: ParticipantRepository,
   ) {}
   create(createParticipantDto: CreateParticipantDto) {
      return this.repository.create(createParticipantDto)
   }

   findAll() {
      return this.repository.find()
   }

   findOne(id: number) {
      return this.findOne(id)
   }

   update(id: number, updateParticipantDto: UpdateParticipantDto) {
      return this.repository.update(id, updateParticipantDto)
   }

   remove(id: number) {
      return this.remove(id)
   }
}
