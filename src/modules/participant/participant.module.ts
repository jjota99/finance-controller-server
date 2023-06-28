import { Module } from '@nestjs/common'
import { ParticipantService } from './participant.service'
import { ParticipantController } from './participant.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Participant } from './entities/participant.entity'

@Module({
   imports: [TypeOrmModule.forFeature([Participant])],
   controllers: [ParticipantController],
   providers: [ParticipantService],
})
export class ParticipantModule {}
