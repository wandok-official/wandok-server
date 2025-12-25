import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomsService } from './rooms.service.js';

@Controller()
export class RoomsController {
  constructor(
    private readonly rooms: RoomsService,
    private readonly config: ConfigService
  ) {}

  @Post('rooms')
  create(@Body() body: { targetUrl: string }) {
    const roomRecord = this.rooms.createRoom(body.targetUrl);
    const webBaseUrl = this.config.get<string>('WEB_BASE_URL') ?? 'http://localhost:5173';

    return {
      roomId: roomRecord.roomId,
      shareToken: roomRecord.token,
      sharePageUrl: `${webBaseUrl}/s/${roomRecord.token}`,
      targetUrl: roomRecord.targetUrl,
    };
  }

  @Get('share/:token')
  getShare(@Param('token') token: string) {
    const roomRecord = this.rooms.getRoomByToken(token);
    if (!roomRecord) {
      return { ok: false, error: 'Invalid token' };
    } else {
      return { ok: true, roomId: roomRecord.roomId, targetUrl: roomRecord.targetUrl };
    }
  }
}
