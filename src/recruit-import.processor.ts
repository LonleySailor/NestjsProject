import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';

@Processor('recruitImport')
export class RecruitImportProcessor {
    @Process()
    async handleJob(job: Job) {
        console.log(job.data);

    }
}
