import profile2 from '../../assets/images/profile2.png';
import PropTypes from 'prop-types';
import { getProfilePicture, formatDatetime} from '../../utils';

export default function InboxMessage({ message, ownerIsSender, user}){

    if(!ownerIsSender){
        return (
        <div className='flex w-[70%] items-center'>
            <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden self-start">
                <img src={getProfilePicture(user.profile_picture)} alt="Profile" className="w-full h-full object-cover"/>
            </div>
            <div className='flex flex-col ms-3 w-full max-w-[100%]'>
                <div className='flex justify-between text-xs items-center w-[85%]'>
                    <h2>{user.name}</h2>
                    <h2 className='text-[10px]'>{formatDatetime(message.created_at)}</h2>
                </div>
                <div className='mt-1.5 bg-slate-100 p-4 rounded-lg w-fit'>
                    <p className='text-[11px]'>{message.content}</p>
                </div>
            </div>
        </div>
    )}else{
        return (
            <div className='flex w-[100%] items-center justify-end'>
                <div className='flex flex-col ms-3 max-w-[70%]'>
                    <div className='flex text-xs min-w-[120px] justify-end'>
                        {/* <h2 className='font-semibold'>You</h2> */}
                        <h2 className='text-[10px]'>{formatDatetime(message.created_at)}</h2>
                    </div>
                    <div className='mt-1.5 bg-blue-600 p-4 rounded-lg text-white w-fit max-w-full self-end'>
                        <p className='text-[11px]'>{message.content}</p>
                    </div>
                </div>
            </div>
        )
    }
}

InboxMessage.propTypes = {
    ownerIsSender: PropTypes.bool,
    message: PropTypes.any,
    user: PropTypes.any
}