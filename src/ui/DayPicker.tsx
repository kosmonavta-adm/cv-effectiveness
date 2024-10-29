import { DayPicker as ReactDayPicker } from 'react-day-picker';

const DayPicker = ({ ...props }) => {
    return (
        <ReactDayPicker
            mode="single"
            classNames={{
                months: 'grid relative w-fit',
                month: 'grid gap-2',
                month_caption: 'flex justify-center',
                caption_label: 'font-medium',
                nav: 'absolute h-6 flex justify-between w-full items-center',
                button_previous: 'left-0 absolute',
                button_next: 'right-0 absolute',
                weekdays: 'grid grid-cols-7',
                weekday: 'flex items-center justify-center font-medium',
                weeks: 'flex flex-col gap-1',
                week: 'grid grid-cols-7 gap-1',
                day: 'flex items-center justify-center',
                day_button: 'flex aria-disabled:cursor-default p-1 cursor-pointer aria-selected:hover:bg-opacity-80',
                selected: 'bg-blue-400 [&>*]:text-white',
                outside: 'day-outside opacity-50 aria-selected:bg-accent/50 aria-selected:opacity-30',
                disabled: '[&>*]:text-neutral-100',
                hidden: 'invisible',
            }}
            {...props}
        />
    );
};

export default DayPicker;
