import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Express } from 'express';
import { AdminRequiredGuard } from 'src/guard/admin.guard';
import { DestroyDto } from './dtos/destroy.dto';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('')
  @UseGuards(AdminRequiredGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }

  @Post('destroy')
  @UseGuards(AdminRequiredGuard)
  delete(@Body() dto: DestroyDto) {
    return this.uploadService.delete(dto);
  }
}
