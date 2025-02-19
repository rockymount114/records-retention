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
  
      // Calculate reviewDate based on retention period
      const today = new Date();
      const retentionYears = validatedFields.retention ? parseInt(validatedFields.retention.toString(), 10) : 0;
      const reviewDate = new Date(today.getFullYear() + retentionYears, today.getMonth(), today.getDate());
  
      // Check if owner ID is valid
      const ownerId = parseInt(validatedFields.owner, 10);
      if (isNaN(ownerId)) {
        throw new Error('Invalid owner ID');
      }
  
      // Get the profile for the current user
      const profile = await db.profile.findUnique({
        where: { clerkId: user.id }
      });
      
      if (!profile) {
        throw new Error('Profile not found');
      }
  
      // Create the record with proper relations but without User model
      await db.record.create({
        data: {
          site: validatedFields.site,
          userId: 1, // Keeping this as required by schema, but can be a default value
          locationId: parseInt(validatedFields.location, 10),
          ownerId: ownerId,
          boxId: parseInt(validatedFields.box, 10),
          status: "ACTIVE",
          disposition: validatedFields.disposition,
          retention: retentionYears,
          content: validatedFields.content,
          reviewDate: reviewDate,
          deleteDate: retentionYears 
            ? new Date(Date.now() + retentionYears * 365 * 24 * 60 * 60 * 1000)
            : null,
          profileId: user.id // Using the clerk ID as profile ID
        }
      });
  
      revalidatePath('/records');
      return { message: 'Record created successfully' };
    } catch (error) {
      console.error("Error creating record:", error);
      return renderError(error);
    }
  };