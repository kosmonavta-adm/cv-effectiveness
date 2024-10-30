import JobApplicationsList from '@/features/job_applications/JobApplicationsList';
import AddJobApplication from './features/job_applications/AddJobApplication';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/Dialog';
import Button from '@/ui/Button';
import UploadResume from '@/features/job_applications/UploadResume';

function App() {
    return (
        <main className="m-24 grid">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-8 ml-auto">Add job application</Button>
                </DialogTrigger>
                <DialogContent title="Add job application">
                    <AddJobApplication />
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="mb-8 ml-auto">Upload resume</Button>
                </DialogTrigger>
                <DialogContent title="Upload resume">
                    <UploadResume />
                </DialogContent>
            </Dialog>
            <JobApplicationsList />
        </main>
    );
}

export default App;
