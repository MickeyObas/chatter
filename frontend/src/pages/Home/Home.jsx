import blackbeardPic from '../../assets/images/blackbeard.jpg';

export default function Home(){
    return (
        <div className='w-full h-screen flex items-center justify-center bg-blue-200 overflow-hidden'>
            <img src={blackbeardPic} className='max-h-full scale-125'/>
        </div>
    )
}