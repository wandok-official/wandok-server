import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service.js';

@Controller()
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Post('rooms')
  create(@Body() body: { targetUrl: string }) {
    const roomRecord = this.rooms.createRoom(body.targetUrl);
    return {
      roomId: roomRecord.roomId,
      shareToken: roomRecord.token,
      shareUrl: `http://localhost:3000/s/${roomRecord.token}`,
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
