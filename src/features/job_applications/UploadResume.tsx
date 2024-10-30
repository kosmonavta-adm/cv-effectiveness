import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Input from '@/ui/Input';
import Button from '@/ui/Button';
import { db } from '@/lib/db';

type EditJobApplicationProps = {
    onClose: () => void;
};

function UploadResume({ onClose: handleClose }: EditJobApplicationProps) {
    const uploadResumeSchema = z.object({
        resume: z.instanceof(FileList).nullable(),
        name: z.string(),
    });

    const { register, handleSubmit } = useForm({
        resolver: zodResolver(uploadResumeSchema),
        defaultValues: {
            name: '',
            resume: null,
        },
    });

    const handleSuccessSubmit = (formData: z.infer<typeof uploadResumeSchema>) => {
        const fileReader = new FileReader();
        if (formData.resume === null) return;
        fileReader.readAsArrayBuffer(formData.resume[0]);

        fileReader.addEventListener('loadend', async (e) => {
            if (e.target === null || e.target.result === null || typeof e.target.result === 'string') return;

            const hashBuffer = await window.crypto.subtle.digest('SHA-256', e.target.result);

            const sha256 = Array.from(new Uint8Array(hashBuffer))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');

            db.resumes.add({ name: formData.name, sha256, file: e.target.result });
        });
    };

    return (
        <form
            className="grid gap-6"
            onSubmit={handleSubmit(handleSuccessSubmit)}
        >
            <Input
                label={{ name: 'Name', required: true }}
                {...register('name')}
            />
            <Input
                label={{ name: 'Resume', required: true }}
                type="file"
                {...register('resume')}
            />

            <div className="ml-auto flex gap-4">
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button>Upload</Button>
            </div>
        </form>
    );
}

export default UploadResume;
