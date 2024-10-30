import Label from '@/ui/Label';
import { ComponentPropsWithoutRef, forwardRef, ReactNode, useId } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
    label?: {
        name: ReactNode;
        required?: boolean;
    };
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => {
    const id = useId();
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <Label
                    required={label?.required ?? false}
                    htmlFor={id}
                >
                    {label.name}
                </Label>
            )}
            <input
                ref={ref}
                id={id}
                className="inset-0 m-auto flex h-10 w-full items-center justify-between border border-neutral-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50"
                {...props}
            />
        </div>
    );
});

export default Input;
