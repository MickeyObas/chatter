import { IconContext } from "react-icons/lib";

import { IoNotificationsOutline } from "react-icons/io5";

export function NotificationIcon(){
    return (
        <IconContext.Provider
            value={{color: "black", size: "20px"}}
        >
            <div>
                <IoNotificationsOutline />
            </div>
        </IconContext.Provider>
    )
}



