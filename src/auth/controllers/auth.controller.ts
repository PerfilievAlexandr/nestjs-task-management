import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { Roles } from '../decorators/roles.decorator';
import { ERoles } from '../enums/roles.enum';
import { RolesGuard } from '../guards/roles.guard';
import { User } from '../entity/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: SignUpDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/get-users')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(ERoles.ADMIN)
  getUsers(): Promise<User[]> {
    return this.authService.getUsers();
  }
}
