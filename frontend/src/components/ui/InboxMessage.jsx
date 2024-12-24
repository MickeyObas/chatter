import profile2 from '../../assets/images/profile2.png';

export default function InboxMessage({ userIsSender }){

    if(!userIsSender){
        return (
        <div className='flex w-[70%]'>
            <div className="">
                <img src={profile2} alt="Profile" className="w-32" />
            </div>
            <div className='flex flex-col ms-3'>
                <div className='flex justify-between text-xs items-center'>
                    <h2>Samantha Somebody</h2>
                    <h2 className='text-[10px]'>Thursday 11:41am</h2>
                </div>
                <div className='mt-1.5 bg-slate-100 p-4 rounded-lg'>
                    <p className='text-[11px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, consequuntur earum ut, culpa commodi omnis at labore necessitatibus sunt, maiores incidunt consectetur ullam ipsum accusamus obcaecati est repudiandae nisi fugit!</p>
                </div>
            </div>
        </div>
    )}else{
        return (
            <div className='flex w-[70%] self-end'>
                <div className='flex flex-col ms-3'>
                    <div className='flex justify-between text-xs items-center'>
                        <h2 className='font-semibold'>You</h2>
                        <h2 className='text-[10px]'>Thursday 11:41am</h2>
                    </div>
                    <div className='mt-1.5 bg-blue-600 p-4 rounded-lg text-white'>
                        <p className='text-[11px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, consequuntur earum ut, culpa commodi omnis at labore necessitatibus sunt, maiores incidunt consectetur ullam ipsum accusamus obcaecati est repudiandae nisi fugit!</p>
                    </div>
                </div>
            </div>
        )
    }
}
