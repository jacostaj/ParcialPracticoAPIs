import { Test, TestingModule } from '@nestjs/testing';
import { AeropuertoService } from './aeropuerto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity';
import { faker } from '@faker-js/faker';
describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertoList: AeropuertoEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    aeropuertoList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        codigo: faker.lorem.sentence(),
        pais: faker.lorem.sentence(),
        ciudad: faker.lorem.sentence()
      })
      aeropuertoList.push(aeropuerto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airport', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertoList.length);
  });
  it('findOne should return a airport by id', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertoList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedAeropuerto.nombre)
    expect(aeropuerto.codigo).toEqual(storedAeropuerto.codigo)
    expect(aeropuerto.pais).toEqual(storedAeropuerto.pais)
    expect(aeropuerto.ciudad).toEqual(storedAeropuerto.ciudad)
  });
  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
  it('create should return a new airport', async () => {
    const aeropuerto: AeropuertoEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      codigo: faker.lorem.sentence(),
      pais: faker.lorem.sentence(),
      ciudad: faker.lorem.sentence(),
      aerolinea: [],
    }
 
    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();
 
    const storedAeropuerto: AeropuertoEntity = await repository.findOne({where: {id: newAeropuerto.id}})
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(newAeropuerto.nombre)
    expect(storedAeropuerto.codigo).toEqual(newAeropuerto.codigo)
    expect(storedAeropuerto.pais).toEqual(newAeropuerto.pais)
    expect(storedAeropuerto.ciudad).toEqual(newAeropuerto.ciudad)
  });
  it('update should modify a airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto.nombre = "New name";
    aeropuerto.pais = "New country";
     const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, aeropuerto);
    expect(updatedAeropuerto).not.toBeNull();
     const storedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto.nombre).toEqual(aeropuerto.nombre)
    expect(storedAeropuerto.pais).toEqual(aeropuerto.pais)
  });
  it('update should throw an exception for an invalid airpot', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertoList[0];
    aeropuerto = {
      ...aeropuerto, nombre: "New name", pais: "New country"
    }
    await expect(() => service.update("0", aeropuerto)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
  it('delete should remove a airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await service.delete(aeropuerto.id);
     const deletedAeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    expect(deletedAeropuerto).toBeNull();
  });
  it('delete should throw an exception for an invalid airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertoList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
});
