import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;

    const user = await new User();

    user.username = username;
    user.salt = await bcrypt.genSalt(10);
    user.password = await UserRepository.hashPassword(password, user.salt);

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

  async validateUserPassword(
    authCredentials: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentials;

    const user = await this.findOne({ username });
    const isPasswordValid = await user?.validatePassword(password);

    if (isPasswordValid) {
      return user.username;
    } else {
      return null;
    }
  }
}
