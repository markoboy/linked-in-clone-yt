import { UserEntity } from 'src/auth/models/user.entity';
import { BaseEntity } from 'src/models/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IFeedPost } from './feed-post.interface';

@Entity('feed_post')
export class FeedPostEntity extends BaseEntity implements IFeedPost {
  @Column({ default: '' })
  body: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.feedPosts)
  author: UserEntity;
}
