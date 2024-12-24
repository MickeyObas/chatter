import profile from '../../assets/images/profile.png';


export default function ChatMessage(){
    return (
        <div className='flex flex-col p-1'>
            <div className='flex text-[11px] items-center'>
                <div>
                    <img src={profile} alt="" className='h-9'/>
                </div>
                <div className='flex flex-col ms-2'>
                    <h3 className='font-medium leading-3'>Mickey Brave</h3>
                    <h3>@mickey</h3>
                </div>
                <div className='ms-auto'>5min ago</div>
            </div>
            <div className='mt-2.5 ps-5'>
                <p className='text-[11px] leading-4 message-content-display'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum perferendis reprehenderit recusandae error consectetur doloribus. Quibusdam odio fuga, voluptatum doloribus aspernatur, voluptate molestias nulla aperiam, repudiandae dignissimos nostrum! Culpa, quam.</p>
            </div>
        </div>
    )
}