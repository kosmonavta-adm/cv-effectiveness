import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {};

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(({ ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className="h-4 w-4 border border-neutral-800"
        {...props}
    >
        <CheckboxPrimitive.Indicator>
            <CheckIcon />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));

export default Checkbox;
