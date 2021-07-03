import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IPayload } from 'src/auth/models/payload.interface';
import { UserService } from 'src/auth/user/user.service';
import { FeedService } from '../feed.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params }: IPayload & Request = context
      .switchToHttp()
      .getRequest();

    if (!user || !params) {
      return false;
    }

    if (user.role === 'admin') {
      return true;
    }

    const userId = user.id;
    const feedId = +params.id;

    return this.userService.findUserById(userId).pipe(
      switchMap((user) =>
        this.feedService.findById(feedId).pipe(
          map((feed) => {
            const isAuthor = user.id === feed.author.id;
            return isAuthor;
          }),
        ),
      ),
    );
  }
}
