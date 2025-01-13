import React from 'react'

function GroupChatMessagesSection() {
  return (
    <div className='w-[32%] h-full'>
        <div className='py-4 px-3.5 border-b flex flex-col w-full'>
            <div className='flex w-full items-center flex-col py-[9px]'>
                <h1 className='text-center font-semibold text-[13px]'>Group Chats</h1>
                <p className='text-[10px]'>Your new messages from group chats will appear here.</p>
            </div>
        </div>
        {/* Messages */}
        <div className='flex-col max-h-[85%] overflow-auto'>
            {Array(10).fill("").map((_, idx) => (
                <div key={idx} className='flex px-3 py-2.5'>
                    <div className='w-10 h-10 flex flex-shrink-0 justify-center items-center rounded-full overflow-hidden bg-slate-500'>hi</div>
                    <div className='flex flex-col ms-2.5'>
                        <h1 className='text-[13px] font-medium'>Group Chat Title</h1>
                        <p className='text-[10px]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis...</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-[10px]'>9:37am</p>
                        <div className='w-6 h-6 bg-green-500 rounded-full flex justify-center items-center ms-auto'>
                            <p className='text-[10px]'>99</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default GroupChatMessagesSection