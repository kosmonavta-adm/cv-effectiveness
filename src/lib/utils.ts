import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';
import { DateArg, format } from 'date-fns';

export const cxTw = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const formatDate = (date: DateArg<Date> | undefined) => {
    if (date === undefined) return;

    return format(date, 'dd.MM.yyyy');
};
