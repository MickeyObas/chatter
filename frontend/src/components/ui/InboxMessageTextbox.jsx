import options from '../../assets/images/options.png';
import smile from '../../assets/images/smile.png';

export default function InboxMessageTextbox(){
    return (
        <div className='px-3.5 mt-auto'>
            <div className='border-[1.5px] flex flex-col rounded-lg'>
                <textarea name="" id="" className='border-none rounded-lg w-full resize-none outline-none p-2 text-[11px]' placeholder='Send a message'  rows={1}></textarea>
                <div className='flex items-center justify-end gap-x-2 me-3 mb-2.5'>
                    <img src={smile} alt="" className='h-4'/>
                    <img src={options} alt="" className='h-4'/>
                    <button className='text-white text-[11px] py-2 px-4 rounded-lg bg-blue-700 flex items-center justify-center'>Send</button>
                </div>
            </div>
        </div>
    )
}