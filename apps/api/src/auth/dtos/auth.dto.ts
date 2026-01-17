import { IsEmail, IsString, MinLength, Matches, IsEnum } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name!: string;

  @IsEnum(['PATIENT', 'DOCTOR', 'FRONTDESK', 'ADMIN'])
  role!: 'PATIENT' | 'DOCTOR' | 'FRONTDESK' | 'ADMIN';
}

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}
