import { Model } from 'mongoose';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response, Request } from 'express';
import {
  comparePassword,
  createAccessToken,
  createRefreshAccessToken,
  generatePassword,
  verifyRefreshAccessToken,
} from 'src/utils/auth';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(dto: CreateUserDto, res: Response) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new ForbiddenException('Email already exists');
    }

    const hashPassword = await generatePassword(password);

    const newUser = new this.userModel({ ...dto, password: hashPassword });
    const saveUser = await newUser.save();

    const accessToken = await createAccessToken(saveUser._id.toString());
    const refreshAccessToken = await createRefreshAccessToken(
      saveUser._id.toString(),
    );

    res.cookie('refreshtoken', refreshAccessToken, {
      httpOnly: true,
      path: '/user/refresh_token',
    });

    return {
      accessToken,
    };
  }

  async logIn(dto: LoginUserDto, res: Response) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new ForbiddenException('Incorect email or password');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new ForbiddenException('Incorect email or password');
    }

    const accessToken = await createAccessToken(user._id._id.toString());
    const refreshAccessToken = await createRefreshAccessToken(
      user._id.toString(),
    );

    res.cookie('refreshtoken', refreshAccessToken, {
      httpOnly: true,
      path: '/user/refresh_token',
    });
    return { accessToken };
  }

  async refreshToken(req: Request) {
    const token = req.cookies.refreshtoken;

    if (!token) {
      throw new ForbiddenException('Invalid credential');
    }

    const decode: any = await verifyRefreshAccessToken(token);

    if (!decode) {
      throw new ForbiddenException('Invalid credential');
    }

    const accessToken = await createAccessToken(decode.userId);

    return { accessToken };
  }

  async findById(userId: string) {
    return this.userModel.findById(userId);
  }
}
