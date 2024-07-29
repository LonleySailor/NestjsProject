import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';


@Controller()
export class AppController {
  constructor(@InjectQueue('recruitImport') private readonly recruitImportQueue: Queue) { }
  @Post('/recruitimport')
  store(@Req() req: Request) {
    this.recruitImportQueue.add('recruitImportJob', req.body);

    return { message: 'Job added to queue' };
  }

}
