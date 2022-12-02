import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';

@Module({
  providers: [EventGateway, EventService, JwtService],
})
export class EventModule {}
