import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../entity/auth.entity';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(authCredentials: SignUpDto): Promise<void> {
    const { username, password, role } = authCredentials;

    const user = await new User();

    user.username = username;
    user.salt = await bcrypt.genSalt(10);
    user.password = await UserRepository.hashPassword(password, user.salt);
    user.role = role;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentials: SignInDto): Promise<string> {
    const { username, password } = authCredentials;

    const user = await this.findOne({ username });
    const isPasswordValid = await user?.validatePassword(password);

    if (isPasswordValid) {
      return user.username;
    } else {
      return null;
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.find();
  }
}
