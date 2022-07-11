import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniquesuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = uniquesuffix + ext;
          callback(null, filename);
        },
      }),
    }),
  )
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('fileeeeeeeeeeeee=====', file);
    return file;
  }
  @Get(':path')
  seeUploadedFile(@Param('path') file, @Res() res) {
    return res.sendFile(file, { root: 'uploads' });
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
