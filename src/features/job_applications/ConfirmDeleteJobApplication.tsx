import Button from '@/ui/Button';
import { db, JobApplication } from '@/lib/db';

type ConfirmDeleteJobApplication = {
    jobApplicationsToDelete: JobApplication[];
    onClose: () => void;
};

function ConfirmDeleteJobApplication({ jobApplicationsToDelete, onClose: handleClose }: ConfirmDeleteJobApplication) {
    const handleDeleteJobApplication = () => {
        const ids = jobApplicationsToDelete.map(({ id }) => id);
        db.jobApplications.bulkDelete(ids);
        handleClose();
    };

    return (
        <div className="grid gap-6">
            <p>Are you sure you want to permanently delete this job application?</p>

            <div className="ml-auto flex gap-4">
                <Button
                    variant="secondary"
                    className="ml-auto"
                    onClick={handleClose}
                >
                    No
                </Button>
                <Button
                    onClick={handleDeleteJobApplication}
                    className="ml-auto"
                >
                    Yes
                </Button>
            </div>
        </div>
    );
}

export default ConfirmDeleteJobApplication;
