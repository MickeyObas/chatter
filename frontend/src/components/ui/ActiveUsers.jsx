import profile from '../../assets/images/profile.png';

function ActiveUser(){
    return (
        <div>
            <img src={profile} alt="" className='h-7'/>
        </div>
    )
}

export default function ActiveUsers(){
    return (
        <div className='flex self-start flex-col mt-6 h-[20%]'>
            <h1 className='text-[13px] font-semibold'>Active</h1>
            <div className='flex mt-4 gap-x-3'>
                {Array(7).fill('_').map((user, idx) => (
                    <ActiveUser key={idx}/>
                ))}
            </div>
            <hr className='mt-7'/>
        </div>
    )
}