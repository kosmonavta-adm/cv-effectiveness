import { JOB_APPLICATION_STATUS } from '@/features/job_applications/_jobApplications_utils';
import Dexie, { EntityTable } from 'dexie';

export interface JobApplication {
    id: number;
    company: string;
    jobOfferLink: string;
    statusHistory: { status: keyof typeof JOB_APPLICATION_STATUS; date: Date }[];
}

export interface Resume {
    id: number;
    name: string;
    sha256: string;
    file: ArrayBuffer;
}

export const db = new Dexie('JobApplicationDatabase') as Dexie & {
    jobApplications: EntityTable<JobApplication, 'id'>;
    resumes: EntityTable<Resume, 'id'>;
};

db.version(1).stores({
    jobApplications: '++id, company, jobOfferLink, statusHistory',
    resumes: '++id, name, sha256, file',
});
