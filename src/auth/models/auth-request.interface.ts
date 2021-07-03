import { Request } from 'express';
import { IPayload } from './payload.interface';

export type AuthRequest = IPayload & Request;
