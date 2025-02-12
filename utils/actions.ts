'use server'

import { profileSchema, validateWithZodSchema } from "./schemas";
import db from "./db";
import { auth, clerkClient, currentUser} from '@clerk/nextjs/server';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { imageSchema, recordSchema } from "./schemas";
import { uploadImage } from "./supabase";

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
        const validatedFields = validateWithZodSchema(profileSchema, rawData);
        await db.profile.create({
            data: {
                clerkId: user?.id,
                email:user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ... validatedFields,

            }
        }) ;     
        (await clerkClient()).users.updateUserMetadata(user.id, {
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
  };

export const fetchProfile = async () => {
    const user = await getAuthUser()
    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id
        }
    })

    if (!profile) redirect('/profile/create')
    return profile;
  };


// // 81
export const updateProfileAction = async (prevState: any, formData: FormData) => {
    const user = await getAuthUser()    
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);

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
};


export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
      const image = formData.get('image') as File;
      const validatedFields = validateWithZodSchema(imageSchema, { image });
      const fullPath = await uploadImage(validatedFields.image);
      await db.profile.update({
        where: {
          clerkId: user.id,
        },
        data: {
          profileImage: fullPath,
        },
      });
      (await clerkClient()).users.updateUserMetadata(user.id, {
        privateMetadata: {
          hasProfile: true,
        },
      });
  
      return { message: 'Profile image updated successfully' };
    } catch (error) {
      return renderError(error);
    }
  };



  export const createRecordAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
      const rawData = Object.fromEntries(formData);
      const validatedFields = validateWithZodSchema(recordSchema, rawData);
      return {message: 'Record created successfully'}
    } catch (error) {
      return renderError(error);
    }
    redirect('/');
  };