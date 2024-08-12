import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RecruitService } from './recruit.service';
import { WorkerHostProcessor } from 'src/worler.host';
import { Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';


@Processor('recruitImport')
@Injectable()
export class RecruitImportProcessor extends WorkerHostProcessor {
    constructor(private readonly recruitService: RecruitService) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        await this.recruitService.addRecruit(job.data);
    }
}
