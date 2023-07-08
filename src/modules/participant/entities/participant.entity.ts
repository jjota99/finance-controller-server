import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('tb_participant')
export class Participant {
   @PrimaryGeneratedColumn({ name: 'id' })
   id: number

   @Column({ name: 'nome' })
   participantName: string

   @Column({ name: 'event_id' })
   eventId: number
}
