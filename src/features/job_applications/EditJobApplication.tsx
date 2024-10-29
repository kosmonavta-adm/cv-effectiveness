import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { db, JobApplication } from '@/lib/db';

type EditJobApplicationProps = {
    jobApplicationToEdit: JobApplication;
    onClose: () => void;
};

function EditJobApplication({ jobApplicationToEdit, onClose: handleClose }: EditJobApplicationProps) {
    const resumeFormSchema = z.object({
        company: z.string(),
        jobOfferLink: z.string(),
    });

    const { register, handleSubmit } = useForm({
        resolver: zodResolver(resumeFormSchema),
        defaultValues: {
            company: '',
            jobOfferLink: '',
        },
    });

    const handleSuccessSubmit = (formData: z.infer<typeof resumeFormSchema>) => {
        db.jobApplications.update(jobApplicationToEdit.id, { ...formData });
        handleClose();
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

            <div className="ml-auto flex gap-4">
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button>Save</Button>
            </div>
        </form>
    );
}

export default EditJobApplication;
