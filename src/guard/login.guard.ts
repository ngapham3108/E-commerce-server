import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { verifyAccessToken } from 'src/utils/auth';

@Injectable()
export class LoginRequiredGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization)
      throw new UnauthorizedException('Not authorized');

    const accessToken = request.headers.authorization;

    if (!accessToken) throw new UnauthorizedException('Not authorized');

    const decoded: any = await verifyAccessToken(accessToken);

    if (!decoded) throw new UnauthorizedException('Not authorized');

    const user = await this.userService.findById(decoded.userId);

    if (!user) throw new UnauthorizedException('Not authorized');

    request.user = user;
    return request;
  }
}
