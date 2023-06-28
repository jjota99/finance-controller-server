import { EntityRepository, Repository } from 'typeorm'
import { Participant } from '../entities/participant.entity'

@EntityRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {}
