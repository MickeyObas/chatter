import profile2 from '../../assets/images/profile2.png';
import v_dots from '../../assets/images/v-dots2.png';
import { useNavigate } from 'react-router-dom';
import { fetchCSRFToken } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function InboxHeader(){
    const navigate = useNavigate();
        const { user } = useAuth();
        console.log(user);

    const handleClick = async () => {
        try {
            const csrfToken = await fetchCSRFToken();
            const response = await fetch('http://localhost:8000/api/users/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "X-CSRFToken": csrfToken
                }
            });
            if(!response.ok){
                const detail = await response.json();
                console.log(detail);
            }else{
                const data = await response.json();
                console.log(data);
            }
        }catch(err){
            console.error(err);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/logout/', {
                credentials: 'include',
            });

            if(!response.ok){
                console.log("Whoopsy Daisy")
            }else{
                const data = await response.json();
                console.log(data);
                navigate('/login');
            }
        } catch(err){
            console.error(err);
        }
    }

    return (
        <div className='flex flex-col'>
            <div className='py-4 px-3.5 border-b flex items-center'>
                <div>
                    <img src={profile2} alt="" className='h-10'/>
                </div>
                <div className='flex flex-col'>
                    <div className='flex'>
                        <div className='flex flex-col ms-3.5'>
                            <h2 className='text-sm font-semibold'>{user ? user['first_name'] : 'Noname'}</h2>
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
                    <button className='border border-slate-300 text-[11px] py-1.5 px-2.5 rounded-lg' onClick={handleLogout}>Archive</button>
                    <button className='text-white text-[11px] py-1.5 px-2.5 rounded-lg bg-blue-700' onClick={handleClick}>View Profile</button>
                    <img src={v_dots} alt="" className='h-4'/>
                </div>
            </div>
        </div>
    )
}