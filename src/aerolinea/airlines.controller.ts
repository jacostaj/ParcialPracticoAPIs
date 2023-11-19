import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor'
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AerolineaDto } from './aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity';
import { plainToInstance } from 'class-transformer';
import { AerolineaService } from './aerolinea.service';
@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) { }
    @Get()
    async findAll() {
    return await this.aerolineaService.findAll();
    }
    @Get(':airlineId')
    async findOne(@Param('airlineId') airlineId: string) {
        return await this.aerolineaService.findOne(airlineId);
    }
    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
    const airline: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
    return await this.aerolineaService.create(airline);
    }
    @Put(':airlineId')
    async update(@Param('airlineId') airlineId: string, @Body() aerolineaDto: AerolineaDto) {
      const airline: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
      return await this.aerolineaService.update(airlineId, airline);
    }
    @Delete(':airlineId')
    @HttpCode(204)
    async delete(@Param('airlineId') airlineId: string) {
      return await this.aerolineaService.delete(airlineId);
    }
}
