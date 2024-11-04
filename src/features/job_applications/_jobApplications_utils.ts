import { JobApplication } from '@/lib/db';
import { format } from 'date-fns';

export const JOB_APPLICATION_STATUS = {
    APPLIED: 'APPLIED',
    INTERVIEW: 'INTERVIEW',
    REJECTED: 'REJECTED',
    OFFER: 'OFFER',
    OFFER_ACCEPTED: 'OFFER_ACCEPTED',
    OFFER_DECLINED: 'OFFER_DECLINED',
} as const;

export const JOB_APPLICATION_STATUS_TRANSLATION = {
    APPLIED: 'Applied',
    INTERVIEW: 'Interview',
    REJECTED: 'Rejected',
    OFFER: 'Offer',
    OFFER_ACCEPTED: 'Offer accepted',
    OFFER_DECLINED: 'Offer declined',
};

const calculateMinMaxNormalization = ({ score, min, max }: { score: number; min: number; max: number }) =>
    ((score - min) / (max - min)).toFixed(2);

export const calculateResumeEffectiveness = (
    jobApplications: JobApplication[],
    status:
        | typeof JOB_APPLICATION_STATUS.INTERVIEW
        | typeof JOB_APPLICATION_STATUS.OFFER
        | typeof JOB_APPLICATION_STATUS.REJECTED
) => {
    const data = jobApplications.reduce(
        (result, currentJobApplication) => {
            const foundStatusEntry = currentJobApplication.statusHistory.find((entry) => entry.status === status);

            if (foundStatusEntry === undefined) {
                return result;
            }

            const formatedDate = format(foundStatusEntry.date, 'dd.MM');
            const foundResultEntry = result.data.get(formatedDate);

            if (foundResultEntry) {
                const newCount = (foundResultEntry.count += 1);

                result.data.set(formatedDate, {
                    ...foundResultEntry,
                    count: newCount,
                });
            } else {
                result.data.set(formatedDate, {
                    name: formatedDate,
                    count: 1,
                });
            }

            result.min = Math.min(result.data.get(formatedDate).count, result.min);
            result.max = Math.max(result.data.get(formatedDate).count, result.max);

            return result;
        },
        { min: 0, max: 0, data: new Map() }
    );

    const normalizedData = Array.from(data.data.values()).reduce((result, currentItem) => {
        result.push({
            name: currentItem.name,
            normalized: calculateMinMaxNormalization({ score: currentItem.count, min: data.min, max: data.max }),
        });

        return result;
    }, []);

    return normalizedData;
};
