import { ComponentPropsWithoutRef } from 'react';

type LabelProps = ComponentPropsWithoutRef<'label'>;

function Label({ children, ...props }: LabelProps) {
    return (
        <label
            className="text-neutral-900"
            {...props}
        >
            {children}
        </label>
    );
}

export default Label;
