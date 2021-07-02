import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ERole } from 'src/auth/models/role.enum';
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

  @Roles(ERole.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  create(@Body() post: IFeedPost, @Request() req): Observable<IFeedPost> {
    return this.feedService.createPost(req.user, post);
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
