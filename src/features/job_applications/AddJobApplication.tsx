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

function AddJobApplication() {
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
    });

    const { register, handleSubmit, control } = useForm({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            company: '',
            statusHistory: {
                status: JOB_APPLICATION_STATUS.APPLIED,
                date: new Date(),
            },
            jobOfferLink: '',
        },
    });

    const handleSuccessSubmit = (formData: z.infer<typeof resumeFormSchema>) => {
        const { statusHistory, ...restFormData } = formData;
        db.jobApplications.add({ ...restFormData, statusHistory: [statusHistory] });
    };

    return (
        <form
            className="grid gap-6"
            onSubmit={handleSubmit(handleSuccessSubmit)}
        >
            <Input
                label="Company name"
                {...register('company')}
            />
            <Input
                {...register('jobOfferLink')}
                label="Link to job offer"
            />

            <Controller
                control={control}
                name="statusHistory.status"
                render={({ field: { onChange, value } }) => (
                    <Select
                        onValueChange={onChange}
                        value={value}
                        label={{ name: 'Status' }}
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
            <Controller
                control={control}
                name="statusHistory.date"
                render={({ field: { onChange, value } }) => (
                    <DayPicker
                        onSelect={onChange}
                        selected={value}
                        className="mx-auto"
                    />
                )}
            />
            <Button className="ml-auto">Add</Button>
        </form>
    );
}

export default AddJobApplication;
