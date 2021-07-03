import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { IPayload } from './models/payload.interface';
import { UserEntity } from './models/user.entity';
import { IUser } from './models/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private _hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  registerAccount(user: IUser): Observable<IUser> {
    const { firstName, lastName, email, password } = user;

    return this._hashPassword(password).pipe(
      switchMap((hashedPassword) => {
        return from(
          this.userRepository.save({
            password: hashedPassword,
            firstName,
            lastName,
            email,
          }),
        ).pipe(
          map((user) => {
            delete user.password;
            return user;
          }),
        );
      }),
    );
  }

  private _validateUser(email: string, password: string): Observable<IUser> {
    return from(
      this.userRepository.findOne(
        { email },
        {
          select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
        },
      ),
    ).pipe(
      switchMap((user) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
          }),
        ),
      ),
    );
  }

  login(user: IUser): Observable<string> {
    const { email, password } = user;

    return this._validateUser(email, password).pipe(
      switchMap((user) => {
        if (user) {
          // create JWT credentials
          return from(this.jwtService.signAsync({ user } as IPayload));
        }
      }),
    );
  }
}
