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


// Create record
  export const createRecordAction = async (
    prevState: any,
    formData: FormData
  ): Promise<{ message: string }> => {
    let user;
    try {
      user = await getAuthUser();
    } catch (error) {
      return { message: 'Authentication failed' };
    }
  
    try {
      // Convert form data to an object
      const rawData = Object.fromEntries(formData.entries());
      console.log('Raw Form Data:', rawData);


  
      // Validate input using Zod
      const validatedFields = validateWithZodSchema(recordSchema, rawData);
      console.log('Validated Fields:', validatedFields);
  
      // Generate review and delete dates based on retention
      const today = new Date();
      const retentionYears = validatedFields.retention || 0;
      const reviewDate = new Date(
        today.getFullYear() + Number(retentionYears),
        today.getMonth(),
        today.getDate()
      );
      const deleteDate = retentionYears
        ? new Date(Date.now() + Number(retentionYears) * 365 * 24 * 60 * 60 * 1000)
        : null;
  
      // Fetch user profile
      const profile = await db.profile.findUnique({
        where: { clerkId: user.id },
      });
  
      if (!profile || !profile.clerkId) {
        throw new Error('Profile not found or clerkId is missing');
      }
      // console.log('Profile:', profile);
  
      // Convert string IDs to numbers for Prisma
      const boxId = parseInt(validatedFields.boxId, 10);
      const locationId = parseInt(validatedFields.locationId, 10);
      const ownerId = parseInt(validatedFields.ownerId, 10);
  
      // Prepare data for Prisma
      const data = {
        site: validatedFields.siteId, // Using string directly as per schema
        boxId: boxId,
        locationId: locationId,
        ownerId: ownerId,
        disposition: validatedFields.disposition,
        status: validatedFields.status,
        retention: retentionYears, // Ensure this is a number
        content: validatedFields.content || null,
        reviewDate,
        deleteDate,
        profileId: profile.clerkId, // Use clerkId not id
      };
      console.log('Data to Prisma:', data);
  
      // Insert record into the database
      const record = await db.record.create({ data });
      console.log('Created record:', record);
  
      // Revalidate the cache for /records page
      revalidatePath('/records');
      return { message: 'Record created successfully' };
    } catch (error) {
      console.error('Error creating record:', error);
      return { message: `Failed to create record: ${error.message}` };
    }
  };