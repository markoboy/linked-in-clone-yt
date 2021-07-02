import { FeedPostEntity } from 'src/feed/models/feed-post.entity';
import { BaseEntity } from 'src/models/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ERole } from './role.enum';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'text', default: ERole.USER })
  role: ERole;

  @OneToMany(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.author)
  feedPosts: FeedPostEntity[];
}
