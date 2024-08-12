import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RecruitImportProcessor } from './recruitMongoModel/recruit-import.processor';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitsModule } from './recruitMongoModel/recruits.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ConfigModule.forRoot({ isGlobal: true }),

    RecruitsModule,
  ],
  controllers: [],
  providers: [],

})
export class AppModule { }

