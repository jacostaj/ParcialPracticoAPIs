import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
@Entity()
export class AeropuertoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    nombre: string;

    @Column()
    codigo: string;

    @Column()
    pais : string;

    @Column()
    ciudad: string;

    @OneToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuerto)
    aerolinea: AerolineaEntity[];
}
