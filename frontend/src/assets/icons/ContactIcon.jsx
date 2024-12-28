import { IconContext } from "react-icons/lib";

import { RiContactsLine } from "react-icons/ri";

export function ContactIcon(){
    return (
        <IconContext.Provider
            value={{color: "black", size: "20px"}}
        >
            <div>
                <RiContactsLine />
            </div>
        </IconContext.Provider>
    )
}



