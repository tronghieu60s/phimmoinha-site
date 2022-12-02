import { atom } from 'recoil';
import { Socket } from 'socket.io-client';

export const socketClientState = atom<Socket>({
  key: 'socketClientState',
  default: undefined,
});

export default socketClientState;
