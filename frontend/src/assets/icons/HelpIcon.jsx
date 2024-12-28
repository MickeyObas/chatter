import { IconContext } from "react-icons/lib";
import { IoMdHelpCircleOutline } from "react-icons/io";

export function HelpIcon(){
    return (
        <IconContext.Provider
            value={{color: "black", size: "20px"}}
        >
            <div>
                <IoMdHelpCircleOutline />
            </div>
        </IconContext.Provider>
    )
}