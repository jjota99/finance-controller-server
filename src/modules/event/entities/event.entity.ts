import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Participant } from '../../participant/entities/participant.entity'

@Entity('tb_event')
export class Event {
   @PrimaryGeneratedColumn({ name: 'id' })
   id: number

   @Column({ name: 'nome' })
   eventName: string

   @Column({ name: 'data' })
   eventDate: string
}
