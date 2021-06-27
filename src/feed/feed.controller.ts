import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { FeedService } from './feed.service';
import { IFeedPost } from './models/feed-post.interface';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 20,
  ): Observable<IFeedPost[]> {
    const takeItems = take > 100 ? 100 : take;

    return this.feedService.findAll({ take: takeItems, skip });
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
