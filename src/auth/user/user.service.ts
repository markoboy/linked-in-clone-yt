import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { IUser } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findUserById(id: number): Observable<IUser> {
    return from(this.userRepository.findOne({ id }));
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: IUser = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;

    return from(this.userRepository.update(id, user));
  }

  findImagePathByUserId(id: number): Observable<string> {
    return this.findUserById(id).pipe(map((user) => user.imagePath));
  }
}
