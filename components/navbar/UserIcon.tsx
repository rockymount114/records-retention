import React from 'react'
import { LuUser } from 'react-icons/lu';
import { fethchProfileImage } from '@/utils/actions';


async function UserIcon () {
  const profileImage = await fethchProfileImage()
  if (profileImage) {
    return (
      <img src={profileImage} alt='profile image' className='w-6 h-6 rounded-full' />
    )
  }

  return <LuUser className='w-6 h-6 bg-primary rounded-full text-white' />;
}

export default UserIcon