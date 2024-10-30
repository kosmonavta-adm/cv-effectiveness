import Label from '@/ui/Label';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { DayPicker as ReactDayPicker } from 'react-day-picker';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

type DayPickerProps = ComponentPropsWithoutRef<typeof ReactDayPicker> & {
    label?: {
        name: ReactNode;
        required?: boolean;
    };
};

const DayPicker = ({ label, ...props }: DayPickerProps) => {
    return (
        <div className="flex w-fit flex-col gap-2">
            {label && <Label required={label?.required ?? false}>{label.name}</Label>}
            <ReactDayPicker
                mode="single"
                classNames={{
                    months: 'grid relative w-fit border border-neutral-300 p-4',
                    month: 'grid gap-2',
                    month_caption: 'flex justify-center',
                    caption_label: 'font-medium',
                    nav: 'absolute h-6 flex justify-between inset-4 items-center',
                    button_previous: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    button_next: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    weekdays: 'grid grid-cols-7',
                    weekday: 'flex items-center justify-center font-medium',
                    weeks: 'flex flex-col gap-1',
                    week: 'grid grid-cols-7 gap-1',
                    day: 'flex items-center justify-center',
                    day_button:
                        'flex aria-disabled:cursor-default p-1 cursor-pointer aria-selected:hover:bg-opacity-80',
                    selected: 'bg-blue-400 [&>*]:text-white',
                    outside: 'day-outside opacity-50 aria-selected:bg-accent/50 aria-selected:opacity-30',
                    disabled: '[&>*]:text-neutral-100',
                    hidden: 'invisible',
                }}
                components={{
                    Chevron: ({ ...props }) =>
                        props.orientation === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />,
                }}
                {...props}
            />
        </div>
    );
};

export default DayPicker;
