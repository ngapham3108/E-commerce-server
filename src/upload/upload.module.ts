import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { FirebaseModule } from 'nestjs-firebase';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    FirebaseModule.forRootAsync({
      useFactory: (configService: ConfigService<any>) => ({
        googleApplicationCredential: `${__dirname}/../../firebaseCredential.json`,
        storageBucket: configService.get('STORAGEBUCKET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
