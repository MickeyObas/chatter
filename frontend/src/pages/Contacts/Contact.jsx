import searchIcon from '../../assets/images/search.png';
import profile2 from '../../assets/images/profile2.png';
import StarIconOutline from '../../assets/icons/StarIconOutline';
import { IoMdStarOutline } from "react-icons/io";
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';

function Contact() {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getContacts = async () => {
            try{
                const response = await fetchWithAuth(`${BASE_URL}/contacts/`);
                if(!response.ok){
                    console.log("Contacts could not be fetched properly.")
                }else{
                    const data = await response.json();
                    setContacts(data);
                }
            }catch(err){
                console.error(err);
            }finally{
                setLoading(false);
            }
        };

        getContacts();

    }, [])

  return (
    <div className="flex w-[80%]">
        <div className="w-[60%] flex flex-col px-3 py-4 border-e border-e-slate-300">
            <h2 className='mb-2.5'>Contacts</h2>
            <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                <img src={searchIcon} alt="" className='h-3'/>
                <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none w-full' placeholder='Search my contacts'/>
            </div>
            {/* Contacts Container */}
            <div className='flex flex-col mt-3.5 gap-y-2 overflow-y-scroll px-1 h-'>
                <div className='flex items-center py-1.5 px-2.5 bg-blue-500 text-white rounded-full'>
                    <div className="">
                        <img src={profile2} alt="Profile" className="w-10" />
                    </div>
                    <div className='flex flex-col ms-2.5'>
                        <div className='flex'>
                            <h2 className='text-sm'>Samantha Somebody</h2>
                        </div>
                        <p className='text-[10px] text-slate-200'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum blanditiis tempore ea.</p>
                    </div>
                    <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                        <IoMdStarOutline size={"20px"}/>
                    </div>
                </div>
                <div className='flex items-center py-1.5 px-2.5 rounded-full'>
                        <div className="">
                            <img src={profile2} alt="Profile" className="w-10" />
                        </div>
                        <div className='flex flex-col ms-2.5'>
                            <div className='flex'>
                                <h2 className='text-sm'>Samantha Somebody</h2>
                            </div>
                            <p className='text-[10px] text-slate-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum blanditiis tempore ea.</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                <div className='flex items-center py-1.5 px-2.5 rounded-full'>
                        <div className="">
                            <img src={profile2} alt="Profile" className="w-10" />
                        </div>
                        <div className='flex flex-col ms-2.5'>
                            <div className='flex'>
                                <h2 className='text-sm'>Samantha Somebody</h2>
                            </div>
                            <p className='text-[10px] text-slate-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum blanditiis tempore ea.</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                <div className='flex items-center py-1.5 px-2.5 rounded-full'>
                        <div className="">
                            <img src={profile2} alt="Profile" className="w-10" />
                        </div>
                        <div className='flex flex-col ms-2.5'>
                            <div className='flex'>
                                <h2 className='text-sm'>Samantha Somebody</h2>
                            </div>
                            <p className='text-[10px] text-slate-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum blanditiis tempore ea.</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                <div className='flex items-center py-1.5 px-2.5 rounded-full'>
                        <div className="">
                            <img src={profile2} alt="Profile" className="w-10" />
                        </div>
                        <div className='flex flex-col ms-2.5'>
                            <div className='flex'>
                                <h2 className='text-sm'>Samantha Somebody</h2>
                            </div>
                            <p className='text-[10px] text-slate-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum blanditiis tempore ea.</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    contacts.map((contact, idx) => (
                    <div key={idx} className='flex items-center py-1.5 px-2.5 rounded-full'>
                        <div className="">
                            <img src={profile2} alt="Profile" className="w-10" />
                        </div>
                        <div className='flex flex-col ms-2.5'>
                            <div className='flex'>
                                <h2 className='text-sm'>Samantha Somebody</h2>
                            </div>
                            <p className='text-[10px] text-slate-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum blanditiis tempore ea.</p>
                        </div>
                        <div className='w-7 h-7 border border-slate-300 rounded-full flex items-center justify-center ms-auto'>
                            <IoMdStarOutline size={"20px"}/>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>
        <div className="w-[40%] flex flex-col py-3.5 px-3.5">
        <h1 className='text-2xl text-center'>Contact Info</h1>
            <div className='flex flex-col gap-y-2 items-center mt-12'>
                <div className="">
                    <img src={profile2} alt="Profile" className="w-32" />
                </div>
                <div className='font-semibold text-xl'>Samantha Somebody</div>
                <div>@samanthasome1</div>
            </div>
            {/* Extra Tabs Container? */}
            <div className='flex flex-col gap-y-2.5 mt-5 px-4'>
                <div className='bg-slate-200 py-3 px-3 rounded-lg'>
                    <p className='text-xs'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae natus illum iusto, odio saepe iure minus nobis quas enim id.</p>
                </div>
                <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center'>
                    <div className='text-xs'>Edit Contact</div>
                </div>
                <div className='bg-slate-200 py-3 px-3 rounded-lg flex justify-center'>
                    <div className='text-xs text-red-600'>Delete Contact</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact