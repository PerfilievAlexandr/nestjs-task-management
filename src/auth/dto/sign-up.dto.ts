import { IsIn } from 'class-validator';

import { ERoles } from '../enums/roles.enum';

import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @IsIn([ERoles.USER, ERoles.ADMIN])
  role: ERoles;
}
