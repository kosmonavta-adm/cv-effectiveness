import { db, JobApplication } from '@/lib/db';
import Checkbox from '@/ui/Checkbox';
import { useLiveQuery } from 'dexie-react-hooks';
import { Fragment, useState } from 'react';
import Button from '@/ui/Button';
import {
    calculateResumeEffectiveness,
    JOB_APPLICATION_STATUS,
    JOB_APPLICATION_STATUS_TRANSLATION,
} from '@/features/job_applications/_jobApplications_utils';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/ui/Dialog';
import ChangeJobApplicationStatus from '@/features/job_applications/ChangeJobApplicationStatus';
import EditJobApplication from '@/features/job_applications/EditJobApplication';
import ConfirmDeleteJobApplication from '@/features/job_applications/ConfirmDeleteJobApplication';
import { useToggle } from '@/lib/hooks/useToggle';
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

const JobApplicationsList = () => {
    const jobApplications = useLiveQuery(() => db.jobApplications.toArray());

    const [selectedJobs, setSelectedJobs] = useState(new Map());
    const [isDeleteDialogOpen, toggleIsDeleteDialogOpen] = useToggle(false);
    const [isChangeStatusDialogOpen, toggleIsChangeStatusDialogOpen] = useToggle(false);
    const [isEditDialogOpen, toggleIsEditDialogOpen] = useToggle(false);

    const handleSelectJobOffer = (jobApplication: JobApplication) => {
        setSelectedJobs((prevSelectedJobs) => {
            const newSelectedJobs = new Map(prevSelectedJobs);

            if (selectedJobs.has(jobApplication.id)) {
                newSelectedJobs.delete(jobApplication.id);
            } else {
                newSelectedJobs.set(jobApplication.id, jobApplication);
            }

            return newSelectedJobs;
        });
    };

    const handleSelectAllJobOffers = () => {
        setSelectedJobs((prevSelectedJobs) => {
            const newSelectedJobs = new Map(prevSelectedJobs);

            if (newSelectedJobs.size === jobApplications?.length) {
                newSelectedJobs.clear();
            } else {
                jobApplications?.forEach((jobApplication) => newSelectedJobs.set(jobApplication.id, jobApplication));
            }

            return newSelectedJobs;
        });
    };

    if (jobApplications === undefined) return;

    return (
        <div>
            <div className="sticky top-0 flex h-12 items-center gap-8 border border-b-0 bg-neutral-100 p-4">
                {selectedJobs.size === 1 && (
                    <Fragment>
                        <Dialog
                            onOpenChange={toggleIsEditDialogOpen}
                            open={isEditDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="ghost">Edit</Button>
                            </DialogTrigger>
                            <DialogContent title="Edit job application">
                                <EditJobApplication
                                    jobApplicationToEdit={selectedJobs.values().next().value as JobApplication}
                                    onClose={toggleIsEditDialogOpen}
                                />
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={isChangeStatusDialogOpen}
                            onOpenChange={toggleIsChangeStatusDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button variant="ghost">Change status</Button>
                            </DialogTrigger>
                            <DialogContent title="Change job application status">
                                <ChangeJobApplicationStatus
                                    jobApplicationToEdit={selectedJobs.values().next().value as JobApplication}
                                    onClose={toggleIsChangeStatusDialogOpen}
                                />
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                )}
                {selectedJobs.size > 1 && (
                    <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={toggleIsDeleteDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant="ghost">Delete</Button>
                        </DialogTrigger>
                        <DialogContent title="Delete job application">
                            <ConfirmDeleteJobApplication
                                jobApplicationsToDelete={Array.from(selectedJobs.values())}
                                onClose={toggleIsDeleteDialogOpen}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            <div className="grid grid-cols-[64px,repeat(2,minmax(0,1fr)),repeat(2,256px)] grid-rows-[min-content] border">
                <div className="col-span-full grid grid-cols-subgrid border-b py-3">
                    <div className="flex items-center justify-center">
                        <Checkbox
                            onCheckedChange={handleSelectAllJobOffers}
                            checked={selectedJobs.size === jobApplications?.length}
                        />
                    </div>
                    <div className="font-bold">Company name</div>
                    <div className="font-bold">Link to job offer</div>
                    <div className="font-bold">Status</div>
                    <div className="font-bold">Date</div>
                </div>
                {jobApplications?.map((jobApplication) => (
                    <div
                        key={jobApplication.id}
                        className="col-span-full grid grid-cols-subgrid border-b py-3 last:border-b-0 hover:bg-neutral-100"
                    >
                        <div className="flex items-center justify-center">
                            <Checkbox
                                checked={selectedJobs.has(jobApplication.id)}
                                onCheckedChange={() => handleSelectJobOffer(jobApplication)}
                            />
                        </div>
                        <div>{jobApplication.company}</div>
                        <div>{jobApplication.jobOfferLink}</div>
                        <div>{JOB_APPLICATION_STATUS_TRANSLATION[jobApplication.statusHistory.at(-1)!.status]}</div>
                        <div>{formatDate(jobApplication.statusHistory.at(-1)?.date)}</div>
                    </div>
                ))}
            </div>
            <div className="mt-12 flex h-full max-h-[512px] flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Interview invitations</p>
                    <p className="text-sm text-neutral-800">Result are shown in normalized scale from 0 to 1</p>
                </div>
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        width={500}
                        height={300}
                        data={Array.from(
                            calculateResumeEffectiveness(jobApplications, JOB_APPLICATION_STATUS.INTERVIEW).values()
                        )}
                        margin={{ bottom: 16 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="normalized"
                            fill="#8884d8"
                            activeBar={
                                <Rectangle
                                    fill="pink"
                                    stroke="blue"
                                />
                            }
                        />
                        <ReferenceLine
                            x="30.10"
                            label="new cv"
                            stroke="red"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default JobApplicationsList;
