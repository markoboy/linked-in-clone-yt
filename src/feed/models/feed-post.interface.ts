import { IUser } from 'src/auth/models/user.interface';
import { IBase } from 'src/models/base.interface';

export interface IFeedPost extends IBase {
  body?: string;
  author?: IUser;
}
