import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/ui/Input';
import DayPicker from '@/ui/DayPicker';
import Button from '@/ui/Button';
import { db } from '@/lib/db';
import { Select, SelectItem } from '@/ui/Select';
import {
    JOB_APPLICATION_STATUS,
    JOB_APPLICATION_STATUS_TRANSLATION,
} from '@/features/job_applications/_jobApplications_utils';
import { useLiveQuery } from 'dexie-react-hooks';

function AddJobApplication() {
    const resumes = useLiveQuery(() => db.resumes.toArray());

    const resumeFormSchema = z.object({
        company: z.string(),
        jobOfferLink: z.string(),
        statusHistory: z.object({
            status: z.enum([
                JOB_APPLICATION_STATUS.APPLIED,
                JOB_APPLICATION_STATUS.INTERVIEW,
                JOB_APPLICATION_STATUS.REJECTED,
                JOB_APPLICATION_STATUS.OFFER,
                JOB_APPLICATION_STATUS.OFFER_ACCEPTED,
                JOB_APPLICATION_STATUS.OFFER_DECLINED,
            ]),
            date: z.date(),
        }),
        resumeId: z.string(),
        resume: z.instanceof(FileList).nullable(),
    });

    const { register, handleSubmit, control, reset } = useForm({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            company: '',
            statusHistory: {
                status: JOB_APPLICATION_STATUS.APPLIED,
                date: new Date(),
            },
            jobOfferLink: '',
            resumeId: '',
            resume: null,
        },
    });

    const handleSuccessSubmit = (formData: z.infer<typeof resumeFormSchema>) => {
        const { statusHistory, resume, ...restFormData } = formData;
        const fileReader = new FileReader();
        if (resume === null) {
            db.jobApplications.add({ ...restFormData, statusHistory: [statusHistory] });
        } else {
            fileReader.readAsArrayBuffer(resume[0]);

            fileReader.addEventListener('loadend', async (e) => {
                if (e.target === null || e.target.result === null || typeof e.target.result === 'string') return;

                const hashBuffer = await window.crypto.subtle.digest('SHA-256', e.target.result);

                const sha256 = Array.from(new Uint8Array(hashBuffer))
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');

                const resumeId = await db.resumes.add({ name: 'x', sha256, file: e.target.result });

                db.jobApplications.add({ ...restFormData, resumeId: String(resumeId), statusHistory: [statusHistory] });
            });
        }

        reset();
    };

    return (
        <form
            className="grid gap-6"
            onSubmit={handleSubmit(handleSuccessSubmit)}
        >
            <Input
                label={{ name: 'Company name', required: true }}
                {...register('company')}
            />
            <Input
                {...register('jobOfferLink')}
                label={{ name: 'Link to job offer' }}
            />

            <Controller
                control={control}
                name="statusHistory.status"
                render={({ field: { onChange, value } }) => (
                    <Select
                        onValueChange={onChange}
                        value={value}
                        label={{ name: 'Status', required: true }}
                    >
                        {Object.values(JOB_APPLICATION_STATUS).map((status) => (
                            <SelectItem
                                key={status}
                                value={status}
                            >
                                {JOB_APPLICATION_STATUS_TRANSLATION[status]}
                            </SelectItem>
                        ))}
                    </Select>
                )}
            />
            <div className="grid grid-cols-[1fr,min-content,1fr] gap-4">
                <Controller
                    control={control}
                    name="resumeId"
                    render={({ field: { onChange, value } }) => (
                        <Select
                            onValueChange={onChange}
                            value={value}
                            label={{ name: 'Already uploaded resumes', required: true }}
                        >
                            {resumes?.map((resume) => (
                                <SelectItem
                                    key={resume.id}
                                    value={String(resume.id)}
                                >
                                    {resume.name}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                />
                <div className="flex h-10 items-center self-end">
                    <hr /> or <hr />
                </div>

                <Input
                    label={{ name: 'Upload resume' }}
                    type="file"
                    {...register('resume')}
                />
            </div>

            <Controller
                control={control}
                name="statusHistory.date"
                render={({ field: { onChange, value } }) => (
                    <DayPicker
                        onSelect={onChange}
                        selected={value}
                        className="mx-auto"
                        label={{ name: 'Application date', required: true }}
                    />
                )}
            />
            <Button className="ml-auto">Add</Button>
        </form>
    );
}

export default AddJobApplication;
