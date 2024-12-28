import { IconContext } from "react-icons/lib";

import { IoHomeOutline } from "react-icons/io5";
import { RiContactsLine } from "react-icons/ri";

export function HomeIcon(){
    return (
        <IconContext.Provider
            value={{color: "black", size: "20px"}}
        >
            <div>
                <IoHomeOutline />
            </div>
        </IconContext.Provider>
    )
}



