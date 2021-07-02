import { Body, Controller, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { IUser } from './models/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: IUser): Observable<IUser> {
    return this.authService.registerAccount(user);
  }

  @Post('login')
  login(@Body() user: IUser): Observable<{ token: string }> {
    return this.authService.login(user).pipe(map((token) => ({ token })));
  }
}
