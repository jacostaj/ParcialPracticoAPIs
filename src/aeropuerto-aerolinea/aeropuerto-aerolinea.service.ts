import { Injectable } from '@nestjs/common';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoAerolineaService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>
    ) {}

    async addAirportToAirline(airportId: string, airlineId: string): Promise<AeropuertoEntity> {
        const airline: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: airlineId}});
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
      
        const airport: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: airportId}, relations: ["aerolineas"]})
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
    
          airport.aerolinea = [...airport.aerolinea, airline];
        return await this.aeropuertoRepository.save(airport);
      }

      async findAirportsFromAirline(airportId: string, airlineId: string): Promise<AerolineaEntity> {
        const airline: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: airlineId}});
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
       
        const airport: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: airportId}, relations: ["aerolineas"]});
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
   
        const aeropuertoAerolinea: AerolineaEntity = airport.aerolinea.find(e => e.id === airline.id);
   
        if (!aeropuertoAerolinea)
          throw new BusinessLogicException("The airline with the given id is not associated to the airport", BusinessError.PRECONDITION_FAILED)
   
        return aeropuertoAerolinea;
    }

    async findAirportFromAirline(airportId: string): Promise<AerolineaEntity[]> {
        const airport: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: airportId}, relations: ["aerolineas"]});
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
       
        return airport.aerolinea;
    }

    async updateAirportsFromAirline(airportId: string, airlines: AerolineaEntity[]): Promise<AeropuertoEntity> {
        const airport: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: airportId}, relations: ["aerolineas"]});
    
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < airlines.length; i++) {
          const aerolinea: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: airlines[i].id}});
          if (!aerolinea)
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        airport.aerolinea = airlines;
        return await this.aeropuertoRepository.save(airport);
      }

      async deleteAirportFromAirline(airportId: string, airlineId: string){
        const airline: AerolineaEntity = await this.aerolineaRepository.findOne({where: {id: airlineId}});
        if (!airline)
          throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND)
    
        const airport: AeropuertoEntity = await this.aeropuertoRepository.findOne({where: {id: airportId}, relations: ["aerolineas"]});
        if (!airport)
          throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND)
    
        const airportAirline: AerolineaEntity = airport.aerolinea.find(e => e.id === airline.id);
    
        if (!airportAirline)
            throw new BusinessLogicException("The airline with the given id is not associated to the airport", BusinessError.PRECONDITION_FAILED)
 
        airport.aerolinea = airport.aerolinea.filter(e => e.id !== airlineId);
        await this.aeropuertoRepository.save(airport);
    }  
}
