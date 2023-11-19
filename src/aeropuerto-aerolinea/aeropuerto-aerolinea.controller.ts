import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor'
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AerolineaDto } from '../aerolinea/aerolinea.dto';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
@UseInterceptors(BusinessErrorsInterceptor)
@Controller('aeropuerto-aerolinea')
export class AeropuertoAerolineaController {
    constructor(private readonly aeropuertoAerolineaService: AeropuertoAerolineaService){}
    @Post('airlines/:airlineId/airports/:airporId')
    async addAirportToAirline(@Param('airlineId') airlineId: string, @Param('airporId') airporId: string) {
        return await this.aeropuertoAerolineaService.addAirportToAirline(airlineId, airporId);
    }
    @Get('airlines/:airlineId/airports/:airporId')
    async findAirportsFromAirline(@Param('airlineId') airlineId: string, @Param('airporId') airporId: string) {
        return await this.aeropuertoAerolineaService.findAirportsFromAirline(airlineId, airporId);
    }
    @Get(':airporId/airlines')
    async findAirportFromAirline(@Param('airporId') airporId: string) {
        return await this.aeropuertoAerolineaService.findAirportFromAirline(airporId);
    }
    @Put(':airporId/airlines')
    async updateAirportsFromAirline(@Body() aerolineaDto: AerolineaDto[], @Param('airporId') airporId: string) {
        const airline = plainToInstance(AerolineaEntity, aerolineaDto)
        return await this.aeropuertoAerolineaService.updateAirportsFromAirline(airporId, airline);
    }
    @Delete(':airlines/:airlineId/airports/:airporId')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('airporId') airporId: string, @Param('airlineId') airlineId: string) {
        return await this.aeropuertoAerolineaService.deleteAirportFromAirline(airporId, airlineId);
    }
}
