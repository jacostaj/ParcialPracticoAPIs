import { Test, TestingModule } from '@nestjs/testing';
import { AerolineaService } from './aerolinea.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AerolineaEntity } from './aerolinea.entity';
import { faker } from '@faker-js/faker';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity';
describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineaList: AerolineaEntity[];
  let aeropuertoEntity: AeropuertoEntity
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    aerolineaList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.sentence(),
        fechaFundacion: faker.lorem.sentence(),
        paginaWeb: faker.lorem.sentence()
      })
      aerolineaList.push(aerolinea);
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all aeroline', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineaList.length);
  });
  it('findOne should return a aeroline by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineaList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre)
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion)
    expect(aerolinea.fechaFundacion).toEqual(storedAerolinea.fechaFundacion)
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb)
  });
  it('findOne should throw an exception for an invalid aeroline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The aeroline with the given id was not found")
  });
  it('create should return a new aeroline', async () => {
    const aerolinea: AerolineaEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      fechaFundacion: faker.lorem.sentence(),
      paginaWeb: faker.lorem.sentence(),
      aeropuerto: aeropuertoEntity,
    }
 
    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();
 
    const storedAerolinea: AerolineaEntity = await repository.findOne({where: {id: newAerolinea.id}})
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion)
    expect(storedAerolinea.fechaFundacion).toEqual(newAerolinea.fechaFundacion)
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb)
  });
  it('update should modify a aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea.nombre = "New name";
    aerolinea.descripcion = "New description";
     const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, aerolinea);
    expect(updatedAerolinea).not.toBeNull();
     const storedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(aerolinea.nombre)
    expect(storedAerolinea.descripcion).toEqual(aerolinea.descripcion)
  });
  it('update should throw an exception for an invalid aerolinea', async () => {
    let aerolinea: AerolineaEntity = aerolineaList[0];
    aerolinea = {
      ...aerolinea, nombre: "New name", descripcion: "New description"
    }
    await expect(() => service.update("0", aerolinea)).rejects.toHaveProperty("message", "The aeroline with the given id was not found")
  });
  it('delete should remove a aeroline', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await service.delete(aerolinea.id);
     const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    expect(deletedAerolinea).toBeNull();
  });
  it('delete should throw an exception for an invalid aeroline', async () => {
    const aerolinea: AerolineaEntity = aerolineaList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The aeroline with the given id was not found")
  });

});
