import { Dispatch, SetStateAction, useState } from 'react';

export const useToggle = (initState: boolean): [boolean, () => void, Dispatch<SetStateAction<boolean>>] => {
    const [toggle, setToggle] = useState(initState);

    const handleToggle = () => setToggle((prevToggle) => !prevToggle);

    return [toggle, handleToggle, setToggle];
};
