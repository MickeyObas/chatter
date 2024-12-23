import logo from '../../assets/images/logo.png';
import checklist from '../../assets/images/checklist.png';
import profile from '../../assets/images/profile.png';
import profile2 from '../../assets/images/profile2.png';
import settings from '../../assets/images/settings.png';
import notification from '../../assets/images/notification.png';
import search from '../../assets/images/search.png';
import v_dots from '../../assets/images/v-dots2.png';
import write from '../../assets/images/write.png';
import options from '../../assets/images/options.png';
import smile from '../../assets/images/smile.png';

export default function Home(){
    return (
        <div className='bg-white grid grid-cols-1 md:grid-cols-12 h-screen overflow-hidden'>
            {/* Sidebar */}
            <div className='col-span-2 border border-e-slate-200 py-4 px-3.5 h-full'>
                <div className='flex flex-col h-full'>
                    <div className='flex items-center'>
                        <img src={logo} alt="logo" className='h-6 me-2'/>
                        <h1 className='text-lg font-bold'>Chatter</h1>
                    </div>
                    <div className='flex flex-col mt-6 gap-y-4 px-2 text-[12px] font-semibold h-full'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={checklist} alt="" className='h-4'/>
                                <h2 className='ms-2'>Link Title</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>99</div>
                        </div>
                        <div className='mt-auto flex flex-col gap-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <img src={notification} alt="" className='h-4'/>
                                    <h2 className='ms-2'>Notifications</h2>
                                </div>
                                <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>
                                99
                                </div>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <img src={settings} alt="" className='h-4'/>
                                    <h2 className='ms-2'>Settings</h2>
                                </div>
                                <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>
                                99
                                </div>
                            </div>
                            <div className='flex border-[1.5px] border-slate-200 p-2 rounded-md mt-3'>
                                <img src={profile} alt="" className='h-7'/>
                                <div className='flex flex-col text-[11px] ms-2.5'>
                                    <h2>Mickey Brave</h2>
                                    <h3>@mickey</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Messages Section */}
            <div className='h-screen col-span-3 border-e border-e-slate-300 py-4 px-5'>
                <div className='flex flex-col items-center h-full'>
                    <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                        <img src={search} alt="" className='h-3'/>
                        <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none' placeholder='Search'/>
                    </div>
                    <div className='flex self-start flex-col mt-6'>
                        <h1 className='text-[13px] font-semibold'>Active</h1>
                        <div className='flex mt-4 gap-x-3'>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                            <div>
                                <img src={profile} alt="" className='h-7'/>
                            </div>
                        </div>
                        <hr className='mt-7'/>
                    </div>
                    <div className='flex flex-col mt-6 self-start w-full h-full'>
                        <div className='flex items-center w-full mb-3'>
                            <h1 className='text-[13px] font-semibold'>Messages</h1>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700 ms-2'>99</div>
                            <div className='p-1.5 border rounded-lg flex items-center justify-center ms-auto'>
                                <img src={write} alt="" className='h-4'/>
                            </div>
                        </div>
                        {/* Messages Container */}
                        <div className='messages-container flex flex-col h-[65%] overflow-y-scroll gap-y-3'>
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
                        </div>
                    </div>
                </div>
            </div>
            {/* Message DM  */}
            <div className='h-screen col-span-7 pt-1 pb-4'>
                <div className='flex flex-col h-full'>
                    <div className='flex flex-col'>
                        <div className='py-4 px-3.5 border-b flex items-center'>
                            <div>
                                <img src={profile2} alt="" className='h-10'/>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex'>
                                    <div className='flex flex-col ms-3.5'>
                                        <h2 className='text-sm font-semibold'>Samantha Somebody</h2>
                                        <h3 className='text-[11px]'>@samanthasome1</h3>
                                    </div>
                                    <div>
                                        <div className='rounded-full bg-white border-[1.5px] border-slate-300 flex items-center justify-center text-[10px] px-1 text-slate-700 ms-2 gap-x-2'>
                                            <div className='bg-green-600 w-1.5 h-1.5 rounded-full'></div>
                                            <h2>Online</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='ms-auto flex gap-x-2'>
                                <button className='border border-slate-300 text-[11px] py-1.5 px-2.5 rounded-lg'>Archive</button>
                                <button className='text-white text-[11px] py-1.5 px-2.5 rounded-lg bg-blue-700'>View Profile</button>
                                <img src={v_dots} alt="" className='h-4'/>
                            </div>
                        </div>
                    </div>
                    {/* Chat Container */}
                    <div className='flex flex-col p-4 gap-y-3.5 overflow-y-scroll mb-2'>
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
                                    <p className='text-[11px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur porro assumenda sunt fuga ducimus velit sint aut, nemo blanditiis qui voluptates quod expedita eum ipsum, rerum ullam dicta neque eos.</p>
                                </div>
                            </div>
                        </div>
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
                    </div>
                    {/* Chat Textbox */}
                    <div className='px-3.5 mt-auto'>
                        <div className='border-[1.5px] flex flex-col rounded-lg'>
                            <textarea name="" id="" className='border-none rounded-lg w-full resize-none outline-none p-2 text-[11px]' placeholder='Send a message'></textarea>
                            <div className='flex items-center justify-end gap-x-2 me-3 mb-2.5'>
                                <img src={smile} alt="" className='h-4'/>
                                <img src={options} alt="" className='h-4'/>
                                <button className='text-white text-[11px] py-2 px-4 rounded-lg bg-blue-700 flex items-center justify-center'>Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}