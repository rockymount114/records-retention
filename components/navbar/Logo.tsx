import Link from 'next/link';
import { GiBookshelf } from "react-icons/gi";
import { Button } from '../ui/button';


function Logo() {
  return (
    // <Button size='icon' asChild>
    //   <Link href='/'>
    //     <GiBookshelf  className='w-10 h-10' />  
         
    //   </Link>      
    // </Button>

    <div className='flex'>
      <Link href='/'>
        <div className='flex items-center gap-2'>
          {/* <GiBookshelf className='w-10 h-10 text-blue-900' /> */}
          <img src="/logo.png" alt="logo" width={70} height={30}/>          
          <span className='hidden lg:block text-lg font-bold text-blue-900'>City of Rocky Mount - Records Retention</span>
        </div>
      </Link>
    </div>
    
  );
}

export default Logo;