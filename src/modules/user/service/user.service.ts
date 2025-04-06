import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  public async findById(id: string) {
    const user = await this.userRepo.findById(id);

    return user;
  }

  public async getAll() {
    const users = await this.userRepo.findAll();

    return users;
  }
}
