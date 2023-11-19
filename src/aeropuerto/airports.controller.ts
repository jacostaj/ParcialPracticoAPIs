import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AeropuertoDto } from './aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) { }
    @Get()
    async findAll() {
    return await this.aeropuertoService.findAll();
    }

    @Get(':airportId')
    async findOne(@Param('airportId') airportId: string) {
        return await this.aeropuertoService.findOne(airportId);
    }
    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
    const airport: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
    return await this.aeropuertoService.create(airport);
    }
    @Put(':airportId')
    async update(@Param('airportId') airportId: string, @Body() aeropuertoDto: AeropuertoDto) {
      const airport: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.aeropuertoService.update(airportId, airport);
    }
    @Delete(':airportId')
    @HttpCode(204)
    async delete(@Param('airportId') airportId: string) {
      return await this.aeropuertoService.delete(airportId);
    }

}
