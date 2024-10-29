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

type EditJobApplicationStatusProps = {
    jobApplicationsToEdit: JobApplication[];
    onClose: () => void;
};

function ChangeJobApplicationStatus({ jobApplicationsToEdit, onClose: handleClose }: EditJobApplicationStatusProps) {
    const resumeFormSchema = z.object({
        status: z.enum([
            JOB_APPLICATION_STATUS.APPLIED,
            JOB_APPLICATION_STATUS.INTERVIEW,
            JOB_APPLICATION_STATUS.REJECTED,
            JOB_APPLICATION_STATUS.OFFER,
            JOB_APPLICATION_STATUS.OFFER_ACCEPTED,
            JOB_APPLICATION_STATUS.OFFER_DECLINED,
        ]),
    });

    const { handleSubmit, control } = useForm({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            status: JOB_APPLICATION_STATUS.APPLIED,
        },
    });

    const handleSuccessSubmit = (formData: z.infer<typeof resumeFormSchema>) => {
        const aplicationsToUpdate = jobApplicationsToEdit.map((jobApplicationsToEdit) => ({
            key: jobApplicationsToEdit.id,
            changes: {
                statusHistory: [
                    ...jobApplicationsToEdit.statusHistory,
                    {
                        status: formData.status,
                        date: new Date(),
                    },
                ],
            },
        }));

        db.jobApplications.bulkUpdate(aplicationsToUpdate);

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
