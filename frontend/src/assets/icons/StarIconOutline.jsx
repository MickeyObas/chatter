import { IoMdStarOutline } from "react-icons/io";
import { IconContext } from "react-icons/lib";


function StarIconOutline({size}) {
  return (
     <IconContext.Provider
        value={{color: "black", size: {size}}}
    >
        <div>
            <IoMdStarOutline />
        </div>
    </IconContext.Provider>
  )
}

export default StarIconOutline