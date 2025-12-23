import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type Room = {
  roomId: string;
  token: string;
  targetUrl: string;
  createdAt: number;
};

@Injectable()
export class RoomsService {
  private roomsByToken = new Map<string, Room>();

  createRoom(targetUrl: string) {
    const roomId = randomUUID();
    const token = randomUUID().replace(/-/g, '');
    const roomRecord: Room = { roomId, token, targetUrl, createdAt: Date.now() };
    this.roomsByToken.set(token, roomRecord);
    return roomRecord;
  }

  getRoomByToken(token: string) {
    return this.roomsByToken.get(token) ?? null;
  }
}
