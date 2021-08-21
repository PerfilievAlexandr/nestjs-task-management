import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../repositories/auth.repository';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { User } from '../entity/auth.entity';
import { IJwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: SignUpDto): Promise<void> {
    await this.userRepository.signUp(authCredentials);
  }

  async signIn(authCredentials: SignInDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentials,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: IJwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }
}
