import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactNode } from 'react';

type DialogProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: ReactNode };

export const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, DialogProps>(
    ({ children, title, ...props }, ref) => (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-40 h-screen w-screen bg-neutral-800 opacity-50" />
            <DialogPrimitive.Content
                className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-12"
                {...props}
                ref={ref}
            >
                <div className="flex justify-between">
                    <DialogPrimitive.Title className="font-bold">{title}</DialogPrimitive.Title>
                    <DialogPrimitive.Close aria-label="Close">
                        <Cross2Icon className="h-5 w-5" />
                    </DialogPrimitive.Close>
                </div>
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
);

export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogTrigger = DialogPrimitive.Trigger;
