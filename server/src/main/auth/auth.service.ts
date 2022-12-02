import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomIntByLength } from 'src/core/commonFuncs';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordInput, SignInInput, SignUpInput } from './auth.entity';

const {
  APP_JWT_TOKEN_KEY,
  APP_JWT_TOKEN_EXPIRES_IN,
  APP_LIMIT_BCRYPT_ROUNDS: rounds,
} = process.env;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async signIn(input: SignInInput) {
    const { Login, Password, Expires = Number(APP_JWT_TOKEN_EXPIRES_IN), Service_Id } = input;
    const usersModel = this.prisma.users;
    const userSectionsModel = this.prisma.userSections;

    const findUser = await usersModel.findFirst({
      where: { OR: [{ UserName: Login }, { Email: Login }] },
      include: { Role: true },
    });
    if (!findUser) {
      throw new Error('ERROR_SIGN_IN_FAILED');
    }

    const isMatch = bcrypt.compareSync(Password, findUser.Password);
    if (!isMatch) {
      throw new Error('ERROR_SIGN_IN_FAILED');
    }

    if (!findUser.IsAdministrator) {
      throw new Error('ERROR_SIGN_IN_NOT_ADMIN');
    }

    const accessToken = this.jwt.sign(findUser, {
      secret: APP_JWT_TOKEN_KEY,
      expiresIn: Expires,
    });

    await userSectionsModel.upsert({
      where: { Service_Id },
      create: { User_Ref: findUser.Id, Section_Id: accessToken, Service_Id },
      update: { User_Ref: findUser.Id, Section_Id: accessToken },
    });

    return {
      Data: {
        User: findUser,
        AccessToken: accessToken,
      },
    };
  }

  async signUp(input: SignUpInput) {
    const { UserName, Email, Password } = input;
    const usersModel = this.prisma.users;
    const rolesModel = this.prisma.roles;

    const findUser = await usersModel.findFirst({ where: { OR: [{ UserName }, { Email }] } });
    if (findUser) {
      throw new Error('ERROR_SIGN_UP_EXISTED');
    }

    const findRole = await rolesModel.upsert({
      where: { Name: 'Member' },
      update: {},
      create: { Name: 'Member' },
    });
    const hashPassword = bcrypt.hashSync(Password, Number(rounds));

    const createdUser = await usersModel.create({
      data: {
        Role_Ref: findRole.Id,
        UserName,
        Email,
        Password: hashPassword,
      },
    });

    return { Data: createdUser, InsertId: createdUser.Id };
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const { Email } = input;
    const usersModel = this.prisma.users;
    const findUser = await usersModel.findFirst({ where: { Email } });
    if (!findUser) {
      throw new Error('ERROR_FORGOT_PASSWORD_NOT_FOUND');
    }

    const resetToken = this.jwt.sign(randomIntByLength(6), {
      secret: APP_JWT_TOKEN_KEY,
      expiresIn: Number(APP_JWT_TOKEN_EXPIRES_IN),
    });
    await usersModel.update({
      where: { Id: findUser.Id },
      data: { ResetPasswordToken: resetToken },
    });

    return { Data: findUser, RowsAffected: 1 };
  }
}
