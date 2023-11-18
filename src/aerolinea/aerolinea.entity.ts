import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

/* @OneToMany(() => AeropuertoEntity, aeropuerto => aeropuerto.aerolinea)
 aeropuerto: AeropuertoEntity[];*/
}
