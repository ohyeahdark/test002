import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({ controllers: [NotificationsController], providers: [PrismaService] })
export class NotificationsModule {}