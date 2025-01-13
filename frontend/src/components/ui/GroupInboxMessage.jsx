import React from 'react'
import { getProfilePicture, formatDatetime } from '../../utils'

export default function GroupInboxMessage({ message, ownerIsSender, user}){

    if(!ownerIsSender){
        return (
        <div className='flex w-[70%] items-center'>
            <div className="w-10 h-10 flex justify-center items-center rounded-full overflow-hidden self-start">
                <img src={getProfilePicture(message?.sender?.profile_picture)} alt="Profile" className="w-full h-full object-cover"/>
            </div>
            <div className='flex flex-col ms-3 w-full max-w-[100%]'>
                <div className='flex justify-between text-xs items-center'>
                    <h2>{message?.sender?.name.split(' ')[0]}</h2>
                    <h2 className='text-[10px]'>{formatDatetime(message?.created_at)}</h2>
                </div>
                <div className='mt-1.5 bg-slate-100 p-4 rounded-lg w-fit'>
                    <p className='text-[11px]'>{message?.content}</p>
                </div>
            </div>
        </div>
    )}else{
        return (
            <div className='flex w-[100%] items-center justify-end'>
                <div className='flex flex-col ms-3 max-w-[70%]'>
                    <div className='flex justify-between text-xs items-center min-w-[120px]'>
                        <h2 className='font-semibold'>You</h2>
                        <h2 className='text-[10px]'>{formatDatetime(message?.created_at)}</h2>
                    </div>
                    <div className='mt-1.5 bg-blue-600 p-4 rounded-lg text-white w-fit max-w-full self-end'>
                        <p className='text-[11px]'>{message.content}</p>
                    </div>
                </div>
            </div>
        )
    }
}
