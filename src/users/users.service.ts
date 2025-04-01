import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { hash } from 'bcrypt';
import { Users } from './users.schema';
import { UsersPayload } from './user.payload';
import { CreateUserInput } from './users.input';
import { UsersFilter } from './users.filter';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  public create(body: CreateUserInput): Observable<UsersPayload> {
    return from(hash(body.password, 10)).pipe(
      switchMap((hashedPassword) => {
        const createdUser = new this.usersModel({
          ...body,
          password: hashedPassword,
        });

        return from(createdUser.save());
      }),
      catchError(() => {
        return throwError(
          () => new ConflictException('User with this email already exists'),
        );
      }),
    );
  }

  public getAll(): Observable<UsersPayload[]> {
    return from(this.usersModel.find().exec());
  }

  public get(filters: UsersFilter) {
    const filtersMongo = this.getFilters(filters);
    return from(this.usersModel.findOne(filtersMongo).exec());
  }

  private getFilters(filters: UsersFilter): Record<string, any> {
    return {
      ...(!!filters.id && { _id: { $in: new Types.ObjectId(filters.id) } }),
      ...(!!filters.email && { email: { $in: filters.email } }),
      ...(!!filters.fullName && { fullName: { $in: filters.fullName } }),
    };
  }
}
