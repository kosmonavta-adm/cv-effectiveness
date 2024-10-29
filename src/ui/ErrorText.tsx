import { ReactNode } from 'react';

const ErrorText = ({ children }: { children: ReactNode }) => {
    return <p className="text-sm text-red-400">{children}</p>;
};

export default ErrorText;
