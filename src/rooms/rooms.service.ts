import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

type RoomRecord = {
  roomId: string;
  token: string;
  targetUrl: string;
  createdAt: number;
};

@Injectable()
export class RoomsService {
  private byToken = new Map<string, RoomRecord>();

  createRoom(targetUrl: string) {
    const roomId = randomUUID();
    const token = randomUUID().replace(/-/g, '');
    const rec: RoomRecord = { roomId, token, targetUrl, createdAt: Date.now() };
    this.byToken.set(token, rec);
    return rec;
  }

  getByToken(token: string) {
    return this.byToken.get(token) ?? null;
  }
}
