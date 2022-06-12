import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { verifyAccessToken } from 'src/utils/auth';

@Injectable()
export class AdminRequiredGuard implements CanActivate {
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

    if (user.role !== 1) {
      throw new UnauthorizedException('Admin resource access denied');
    }

    request.user = user;
    return request;
  }
}
