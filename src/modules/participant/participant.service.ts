import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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

   findAll(): Promise<Participant[]> {
      return this.repository.find()
   }

   async findOne(id: number): Promise<Participant> {
      try {
         const participant = await this.repository.findOneById(id)
         if (participant === null) {
            throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
         }
         return participant
      } catch (error) {
         throw error
      }
   }

   async create(
      createParticipantDto: CreateParticipantDto,
   ): Promise<CreateParticipantDto> {
      const newParticipant = await this.repository.create(
         this.repository.create(createParticipantDto),
      )

      await this.repository.save(newParticipant)
      return createParticipantDto
   }

   async update(
      id: number,
      updateParticipantDto: UpdateParticipantDto,
   ): Promise<UpdateParticipantDto> {
      await this.repository.update(id, updateParticipantDto)

      return updateParticipantDto
   }

   async remove(id: number): Promise<void> {
      try {
         const participant = await this.repository.findOneById(id)
         if (participant === null) {
            throw new HttpException(
               `Não foi possível deletar o usuário de id: ${id}`,
               HttpStatus.BAD_REQUEST,
            )
         }
         await this.repository.delete(id)
      } catch (error) {
         throw error
      }
   }
}
