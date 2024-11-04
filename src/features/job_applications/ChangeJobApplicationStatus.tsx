import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/ui/Button';
import { db, JobApplication } from '@/lib/db';
import { Select, SelectItem } from '@/ui/Select';
import {
    JOB_APPLICATION_STATUS,
    JOB_APPLICATION_STATUS_TRANSLATION,
} from '@/features/job_applications/_jobApplications_utils';
import DayPicker from '@/ui/DayPicker';

type EditJobApplicationStatusProps = {
    jobApplicationToEdit: JobApplication;
    onClose: () => void;
};

function ChangeJobApplicationStatus({ jobApplicationToEdit, onClose: handleClose }: EditJobApplicationStatusProps) {
    const resumeFormSchema = z.object({
        status: z.enum([
            JOB_APPLICATION_STATUS.APPLIED,
            JOB_APPLICATION_STATUS.INTERVIEW,
            JOB_APPLICATION_STATUS.REJECTED,
            JOB_APPLICATION_STATUS.OFFER,
            JOB_APPLICATION_STATUS.OFFER_ACCEPTED,
            JOB_APPLICATION_STATUS.OFFER_DECLINED,
        ]),
        date: z.date(),
    });

    const { handleSubmit, control } = useForm({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            status: JOB_APPLICATION_STATUS.APPLIED,
            date: new Date(),
        },
    });

    const handleSuccessSubmit = (formData: z.infer<typeof resumeFormSchema>) => {
        db.jobApplications.update(jobApplicationToEdit.id, {
            statusHistory: [...jobApplicationToEdit.statusHistory, formData],
        });

        handleClose();
    };

    return (
        <form
            className="grid gap-6"
            onSubmit={handleSubmit(handleSuccessSubmit)}
        >
            <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                    <Select
                        onValueChange={onChange}
                        value={value}
                    >
                        {Object.values(JOB_APPLICATION_STATUS)
                            .filter((status) =>
                                jobApplicationToEdit.statusHistory.every((statusEntry) => statusEntry.status !== status)
                            )
                            .map((status) => (
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
                name="date"
                render={({ field: { onChange, value } }) => (
                    <DayPicker
                        onSelect={onChange}
                        selected={value}
                        className="mx-auto"
                        label={{ name: 'Application date', required: true }}
                        disabled={{ before: jobApplicationToEdit.statusHistory.at(-1)!.date }}
                    />
                )}
            />

            <div className="ml-auto flex gap-4">
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button>Update</Button>
            </div>
        </form>
    );
}

export default ChangeJobApplicationStatus;
