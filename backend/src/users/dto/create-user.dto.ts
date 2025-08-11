import { IsString, IsNotEmpty, MaxLength, IsUUID, IsOptional, IsEnum } from 'class-validator';

enum Role {
    ADMIN = 'ADMIN',
    MOD = 'MODE',
    USER = 'USER',
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsUUID()
    employeeId: string;

    @IsString()
    @IsOptional()
    refreshToken: string;
}