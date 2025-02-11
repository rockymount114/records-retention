'use server'

import { profileSchema } from "./schema";
import db from "./db";
import { clerkClient, currentUser} from '@clerk/nextjs/server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



const getAuthUser = async() => {
    const user = await currentUser()
    if (!user) throw new Error('User not found')
    if (!user.privateMetadata?.hasProfile) redirect('/profile/create')
    return user;
}

const renderError = (error:unknown):{message:string} => {

    return { message: error instanceof Error ? error.message: 'Something went wrong'} 

}

export const createProfileAction = async (prevState: any, formData: FormData) => {

    try {
        const user = await currentUser();
        if (!user) throw new Error('User not found')        

        const rawData = Object.fromEntries(formData)
        const validatedFields = profileSchema.parse(rawData)
        await db.profile.create({
            data: {
                clerkId: user?.id,
                email:user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ... validatedFields,

            }
        })      
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true
            },
        }, 
    )
        
    }

    catch (error) {
        return renderError(error) 
        revalidatePath('/')
    }
    redirect('/')
  };



export const fethchProfileImage = async () => {
    const user = await currentUser()
    if (!user) return null;

    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        },
        select: {
            profileImage: true
        }
    })
    return profile?.profileImage;
  }

export const fetchProfile = async () => {
    const user = await getAuthUser()
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        }
    })
    console.log("clerkId")
    if (!profile) redirect('/profile/create')
    return profile;
  }


// 81
export const updateProfileAction = async (
    prevState: any, 
    formData: FormData) => {
    const user = await getAuthUser()
    
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = profileSchema.parse(rawData);

        await db.profile.update({
            where: {
                clerkId: user.id
            },
            data: {
                ...validatedFields
            }
        })
    }
    catch (error) {
        return renderError(error) 
    }
    return { message: 'Profile updated successfully'}
}