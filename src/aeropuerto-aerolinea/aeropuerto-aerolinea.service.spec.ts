import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Repository } from 'typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let airportRepository: Repository<AeropuertoEntity>;
  let airlineRepository: Repository<AerolineaEntity>;
  let airport: AeropuertoEntity;
  let airlineList : AerolineaEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoAerolineaService],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(AeropuertoAerolineaService);
    airportRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    airlineRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();

    airlineList = [];
    for (let i = 0; i < 5; i++) {
      const airpline: AerolineaEntity = await airlineRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.lorem.sentence(),
        paginaWeb: faker.lorem.sentence(),
        aeropuerto:airport
      })
      airlineList.push(airpline);
    }

    airport = await airportRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.lorem.sentence(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),
      aerolinea: airlineList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to a airline', async () => {
    const newAirline: AerolineaEntity = await airlineRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
    });

    const newAirport: AeropuertoEntity = await airportRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.lorem.sentence(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),
    })

    const result: AeropuertoEntity = await service.addAirportToAirline(newAirport.id, newAirline.id);

    expect(result.aerolinea.length).toBe(1);
    expect(result.aerolinea[0]).not.toBeNull();
    expect(result.aerolinea[0].nombre).toBe(newAirline.nombre)
    expect(result.aerolinea[0].descripcion).toBe(newAirline.descripcion)
    expect(result.aerolinea[0].fechaFundacion).toBe(newAirline.fechaFundacion)
    expect(result.aerolinea[0].paginaWeb).toBe(newAirline.paginaWeb)
  });
  it('addAirportToAirline should thrown exception for an invalid airplane', async () => {
    const newAirport: AeropuertoEntity = await airportRepository.save({
      nombre: faker.lorem.sentence(),
      codigo: faker.lorem.sentence(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),
    })

    await expect(() => service.addAirportToAirline(newAirport.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });
  it('addAirportToAirline should throw an exception for an invalid airport', async () => {
    const newAirline: AerolineaEntity = await airlineRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
    });

    await expect(() => service.addAirportToAirline("0", newAirline.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });
  it('findAirportsFromAirline should return airline by airport', async () => {
    const airline: AerolineaEntity = airlineList[0];
    const storedAirline: AerolineaEntity = await service.findAirportsFromAirline(airport.id, airline.id);
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.nombre).toBe(airline.nombre);
    expect(storedAirline.descripcion).toBe(airline.descripcion);
    expect(storedAirline.fechaFundacion).toBe(airline.fechaFundacion);
    expect(storedAirline.paginaWeb).toBe(airline.paginaWeb);
  });

  it('findAirportsFromAirline should throw an exception for an invalid airline', async () => {
    await expect(() => service.findAirportsFromAirline(airport.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('findAirportsFromAirline should throw an exception for an invalid airport', async () => {
    const airline: AerolineaEntity = airlineList[0];
    await expect(() => service.findAirportsFromAirline("0", airline.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportsFromAirline should throw an exception for an airline not associated to the airport', async () => {
    const newAirline: AerolineaEntity = await airlineRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
    });

    await expect(() => service.findAirportsFromAirline(airport.id, newAirline.id)).rejects.toHaveProperty("message", "The airline with the given id is not associated to the airport");
  });

  it('findAirportsFromAirline should return recipes by airport', async () => {
    const airline: AerolineaEntity[] = await service.findAirportFromAirline(airport.id);
    expect(airline.length).toBe(5)
  });

  it('findAirportsFromAirline should throw an exception for an invalid airport', async () => {
    await expect(() => service.findAirportFromAirline("0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });
  it('updateAirportsFromAirline should update recipes list for a airport', async () => {
    const newAirline: AerolineaEntity = await airlineRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
    });

    const updatedAirport: AeropuertoEntity = await service.updateAirportsFromAirline(airport.id, [newAirline]);
    expect(updatedAirport.aerolinea.length).toBe(1);
    expect(updatedAirport.aerolinea[0].nombre).toBe(newAirline.nombre);
    expect(updatedAirport.aerolinea[0].descripcion).toBe(newAirline.descripcion);
    expect(updatedAirport.aerolinea[0].fechaFundacion).toBe(newAirline.fechaFundacion);
    expect(updatedAirport.aerolinea[0].paginaWeb).toBe(newAirline.paginaWeb);
  });
  it('updateAirportsFromAirline should throw an exception for an invalid airport', async () => {
    const newAirline: AerolineaEntity = await airlineRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
    });

    await expect(() => service.updateAirportsFromAirline("0", [newAirline])).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });
  it('updateAirportsFromAirline should throw an exception for an invalid airline', async () => {
    const newAirline: AerolineaEntity = airlineList[0];
    newAirline.id = "0";

    await expect(() => service.updateAirportsFromAirline(airport.id, [newAirline])).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });
  it('deleteAirportFromAirline should remove a recipe from a gastronomic culture', async () => {
    const airline: AerolineaEntity = airlineList[0];

    await service.deleteAirportFromAirline(airport.id, airline.id);

    const storedAirport: AeropuertoEntity = await airportRepository.findOne({ where: { id: airport.id }, relations: ["aerolineas"] });
    const deletedAirline: AerolineaEntity = storedAirport.aerolinea.find(r => r.id === airline.id);

    expect(deletedAirline).toBeUndefined();

  });

  it('deleteAirportFromAirline should thrown an exception for an invalid airport', async () => {
    await expect(() => service.deleteAirportFromAirline(airport.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown an exception for an invalid airline', async () => {
    const airline: AerolineaEntity = airlineList[0];
    await expect(() => service.deleteAirportFromAirline("0", airline.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });
  it('deleteAirportFromAirline should thrown an exception for an non asocciated airline', async () => {
    const newAirline: AerolineaEntity = await airlineRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
    });

    await expect(() => service.deleteAirportFromAirline(airport.id, newAirline.id)).rejects.toHaveProperty("message", "The airline with the given id is not associated to the airport");
  });
});
