import { Column, Entity, OneToMany,ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
@Entity()
export class AerolineaEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;

 @Column()
 descripcion: string;

 @Column()
 fechaFundacion: string;

 @Column()
 paginaWeb: string;

 @ManyToOne(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolinea)
 aeropuerto: AeropuertoEntity;
}
