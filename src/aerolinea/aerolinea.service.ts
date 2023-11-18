import { Injectable } from '@nestjs/common';
import { AerolineaEntity } from './aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ){}

    async findAll(): Promise<AerolineaEntity[]> {
        return await this.aerolineaRepository.find();
    }

    async findOne(id: string): Promise<AerolineaEntity> {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id}} );
        if (!aerolinea)
          throw new BusinessLogicException("The aeroline with the given id was not found", BusinessError.NOT_FOUND);
   
        return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return await this.aerolineaRepository.save(aerolinea);
    }

    async update(id: string, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const persistedAerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!persistedAerolinea)
          throw new BusinessLogicException("The aeroline with the given id was not found", BusinessError.NOT_FOUND);
       
          aerolinea.id = id; 
       
        return await this.aerolineaRepository.save(aerolinea);
    }

    async delete(id: string) {
        const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where:{id}});
        if (!aerolinea)
          throw new BusinessLogicException("The aeroline with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.aerolineaRepository.remove(aerolinea);
    }
}
