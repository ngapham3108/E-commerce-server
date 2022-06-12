import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginRequiredGuard } from 'src/guard/login.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.register(body, res);
  }

  @Post('login')
  logIn(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.userService.logIn(dto, res);
  }

  @Get('logout')
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshtoken', { path: '/user/refresh_token' });
    return res.json({ msg: 'Logged out' });
  }

  @Get('info')
  @UseGuards(LoginRequiredGuard)
  getUser(@Req() req: any) {
    return { user: req.user };
  }

  @Get('refresh_token')
  refreshToken(@Req() req: Request) {
    return this.userService.refreshToken(req);
  }
}
