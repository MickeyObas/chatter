import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SidebarLink({
    title="Link Title",
    Icon,
    path,
    notificationCount=99,
}){

    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname == path;

    return (
        <a       
            className={`flex items-center justify-between rounded-lg py-2.5 px-1 cursor-pointer ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'} `}
            onClick={() => navigate(path)}
            >
            <div className='flex items-center'
            >
                <Icon />
                <h2 className='ms-2 text-[13px]'>{title}</h2>
            </div>
            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>{notificationCount}</div>
        </a>
    )
}


SidebarLink.propTypes = {
    title: PropTypes.string,
    Icon: PropTypes.any,
    notificationCount: PropTypes.number,
    path: PropTypes.string
}