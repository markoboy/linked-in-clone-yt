import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedService } from './feed.service';
import { IFeedPost } from './models/feed-post.interface';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  findAll(): Observable<IFeedPost[]> {
    return this.feedService.findAll();
  }

  @Post()
  create(@Body() post: IFeedPost): Observable<IFeedPost> {
    return this.feedService.createPost(post);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() feedPost: IFeedPost,
  ): Observable<UpdateResult> {
    return this.feedService.updatePost(id, feedPost);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.feedService.deletePost(id);
  }
}
