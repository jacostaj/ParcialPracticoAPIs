import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AeropuertoDto } from './aeropuerto.dto';
import { plainToInstance } from 'class-transformer';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity';
@Controller('aeropuerto')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) { }
    @Get()
    async findAll() {
    return await this.aeropuertoService.findAll();
    }
    @Get(':airports')
    async findOne(@Param('airports') airports: string) {
        return await this.aeropuertoService.findOne(airports);
    }
    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
    const airport: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
    return await this.aeropuertoService.create(airport);
    }
    @Put(':airports')
    async update(@Param('airports') airports: string, @Body() aeropuertoDto: AeropuertoDto) {
      const airport: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
      return await this.aeropuertoService.update(airports, airport);
    }
    @Delete(':airports')
    @HttpCode(204)
    async delete(@Param('airports') airports: string) {
      return await this.aeropuertoService.delete(airports);
    }

}
