import { IFeedPost } from 'src/feed/models/feed-post.interface';
import { IBase } from 'src/models/base.interface';
import { ERole } from './role.enum';

export interface IUser extends IBase {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imagePath?: string;
  role?: ERole;
  feedPosts?: IFeedPost[];
}
