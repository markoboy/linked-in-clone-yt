import { IUser } from './user.interface';

export interface IPayload {
  user?: Partial<IUser>;
}
