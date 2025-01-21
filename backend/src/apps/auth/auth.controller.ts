import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetIssuer, PublicRoute } from 'src/decorators';
import { AuthDto } from './auth.dto';
import { Request, Response } from 'express';
import { Users } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post('login')
  async login(@Body() dto: AuthDto, @Res() res: Response) {
    const result = await this.authService.login(dto);

    return res.status(result.status).json(result);
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const token = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'];

    const result = await this.authService.logout(token, refreshToken, issuer);

    return res.status(result.status).json(result);
  }
}
