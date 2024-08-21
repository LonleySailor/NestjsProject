import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RecruitService } from './recruit.service';
import { Injectable } from '@nestjs/common';


@Processor('recruitImport')
@Injectable()
export class RecruitImportProcessor extends WorkerHost {
    constructor(private readonly recruitService: RecruitService) {
        super();
    }

    async process(job: Job<any, any, string>) {
        this.recruitService.addRecriutsWithDelay(job.data);
    }
}
