import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';
import { plainToInstance } from 'class-transformer';
import { AerolineaService } from './aerolinea.service';
@Controller('aerolinea')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) { }
    @Get()
    async findAll() {
    return await this.aerolineaService.findAll();
    }
    @Get(':airlines')
    async findOne(@Param('airlines') airlines: string) {
        return await this.aerolineaService.findOne(airlines);
    }
    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
    const airline: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
    return await this.aerolineaService.create(airline);
    }
    @Put(':airlines')
    async update(@Param('airlines') airlines: string, @Body() aerolineaDto: AerolineaDto) {
      const airline: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.aerolineaService.update(airlines, airline);
    }
    @Delete(':airlines')
    @HttpCode(204)
    async delete(@Param('airlines') airlines: string) {
      return await this.aerolineaService.delete(airlines);
    }
}
