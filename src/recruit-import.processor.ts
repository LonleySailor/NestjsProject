import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';


@Processor('recruitImport')
export class RecruitImportProcessor extends WorkerHost {

    async process(job: Job<any, any, string>): Promise<any> {
        console.log('Job data:', job.data);
    }
}
