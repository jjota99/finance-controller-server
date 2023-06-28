import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Event } from '../../event/entities/event.entity'

@Entity('tb_participant')
export class Participant {
   @PrimaryGeneratedColumn({ name: 'id' })
   id: number

   @Column({ name: 'nome' })
   participantName: string

   @OneToMany(() => Event, (event) => event.participant)
   event: Event
}
