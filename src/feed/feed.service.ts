import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FeedPostEntity } from './models/feed-post.entity';
import { IFeedPost } from './models/feed-post.interface';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>,
  ) {}

  findAll(): Observable<IFeedPost[]> {
    return from(this.feedPostRepository.find());
  }

  createPost(feedPost: IFeedPost): Observable<IFeedPost> {
    return from(this.feedPostRepository.save(feedPost));
  }

  updatePost(id: number, feedPost: IFeedPost): Observable<UpdateResult> {
    return from(this.feedPostRepository.update(id, feedPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.feedPostRepository.delete(id));
  }
}
