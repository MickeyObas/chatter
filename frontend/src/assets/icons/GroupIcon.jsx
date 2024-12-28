import { IconContext } from "react-icons/lib";

import { RiTeamLine } from "react-icons/ri";

export function GroupIcon(){
    return (
        <IconContext.Provider
            value={{color: "black", size: "20px"}}
        >
            <div>
                <RiTeamLine />
            </div>
        </IconContext.Provider>
    )
}



