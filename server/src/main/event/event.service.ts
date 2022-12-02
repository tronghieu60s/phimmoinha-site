import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { PingUserSectionInput } from '../user/user.entity';

const APP_JWT_TOKEN_KEY = process.env.APP_JWT_TOKEN_KEY || 'JwtToken';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async ping(server: Server, data: PingUserSectionInput) {
    const { Section_Id, Service_Id, Socket_Id, OnlineStatus = 'Online' } = data;
    const usersModel = this.prisma.users;
    const userSectionsModel = this.prisma.userSections;

    if (!Service_Id) {
      return;
    }

    await userSectionsModel.upsert({
      where: { Service_Id },
      update: { ...data, Socket_Id: { push: [Socket_Id] }, OnlineStatus },
      create: { ...data, Section_Id, Socket_Id, OnlineStatus },
    });

    try {
      const vUser = this.jwtService.verify(Section_Id, { secret: APP_JWT_TOKEN_KEY });
      const user = await usersModel.findUnique({ where: { Id: vUser.Id } });
      if (!user) {
        throw new Error('No user found.');
      }

      await userSectionsModel.update({ where: { Service_Id }, data: { User_Ref: user.Id } });
    } catch (error) {
      server.sockets.emit('logout', data);
    }

    server.sockets.emit('pong', data);
  }

  async disconnect(server: Server, data: PingUserSectionInput) {
    const { Service_Id, Socket_Id } = data;
    if (!Service_Id) {
      return;
    }

    const userSection = await this.prisma.userSections.findUnique({
      where: { Service_Id },
      select: { Socket_Id: true },
    });
    if (!userSection) {
      return;
    }

    const sockets = userSection.Socket_Id.filter((id) => id !== Socket_Id);
    const isOnline = sockets.length > 0;

    await this.prisma.userSections.update({
      where: { Service_Id },
      data: {
        Socket_Id: { set: sockets },
        OnlineStatus: isOnline ? 'Online' : 'Offline',
      },
    });

    server.sockets.emit('pong', data);
  }
}
