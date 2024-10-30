import { ComponentPropsWithoutRef } from 'react';

type LabelProps = ComponentPropsWithoutRef<'label'> & { required: boolean };

function Label({ children, required, ...props }: LabelProps) {
    return (
        <label
            className="text-neutral-900"
            {...props}
        >
            {required && <span className="text-sm text-red-600">* </span>}
            {children}
        </label>
    );
}

export default Label;
