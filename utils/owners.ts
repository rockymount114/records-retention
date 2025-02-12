import { IconType } from 'react-icons';
import { MdCabin } from 'react-icons/md';

import { TbCaravan, TbTent, TbBuildingCottage } from 'react-icons/tb';

import { GiWoodCabin, GiMushroomHouse } from 'react-icons/gi';
import { PiWarehouse, PiLighthouse, PiVan } from 'react-icons/pi';

import { GoContainer } from 'react-icons/go';
import {
    MdBusiness,
    MdLocationCity  ,
    MdEngineering,
    MdAttachMoney  ,
    MdLocalFireDepartment ,
    MdHome,
    MdPeople,
    MdLocalPolice    ,
    MdPublic,
    MdWater,
    MdBuild, //spanner
    MdOutlinePark , //park
    
  } from 'react-icons/md';

type Owner = {
  label: OwnerLabel;
  icon: IconType;
};

export type OwnerLabel =
    | 'Business & Collections Services/Cashiers'
    | 'Business & Collections Services/Collections'
    | 'Central Services/Administration'
    | 'City Clerk/No Division'
    | 'City Manager/No Division'
    | 'City Managers Office/Downtown'
    | 'Community & Business Development/Administration'
    | 'Community Development/Housing'
    | 'Development Services/Administration'
    | 'Development Services/Community Code'
    | 'Development Services/Inspections'
    | 'Engineering/Bus and Transit'
    | 'Engineering/Drafting'
    | 'Finance/Accounting'
    | 'Finance/Administration'
    | 'Finance/Print Shop'
    | 'Finance/Purchasing'
    | 'Finance/Utilities'
    | 'Fire/Administration'
    | 'Housing/Housing Code'
    | 'Human Relations/Administration'
    | 'Owners'
    | 'Parks and Recreations/Administration'
    | 'Personnel/Administration'
    | 'Personnel/Benefits'
    | 'Personnel/Employee Health'
    | 'Police/Administration'
    | 'Police/Animal Control'
    | 'Police/Investigations'
    | 'Police/No Division'
    | 'Police/Patrol Services'
    | 'Police/Special Operations'
    | 'Police/Support Services'
    | 'Public Works/Administration'
    | 'Public Works/Engineering'
    | 'Public Works/Fleet Maintenance'
    | 'Public Works/Streets'
    | 'Utilities/Administration'
    | 'Water/Administration'
    | 'Water/Wastewater'
    | 'Water/Water Sewer';

    export const owners: Owner[] = [
        {
          label: 'Business & Collections Services/Cashiers',
          icon: MdBusiness,
        },
        {
          label: 'Business & Collections Services/Collections',
          icon: MdBusiness,
        },
        {
          label: 'Central Services/Administration',
          icon: MdLocationCity  ,
        },
        {
          label: 'City Clerk/No Division',
          icon: MdLocationCity  ,
        },
        {
          label: 'City Manager/No Division',
          icon: MdLocationCity  ,
        },
        {
          label: 'City Managers Office/Downtown',
          icon: MdLocationCity  ,
        },
        {
          label: 'Community & Business Development/Administration',
          icon: MdBusiness,
        },
        {
          label: 'Community Development/Housing',
          icon: MdHome,
        },
        {
          label: 'Development Services/Administration',
          icon: MdEngineering,
        },
        {
          label: 'Development Services/Community Code',
          icon: MdEngineering,
        },
        {
          label: 'Development Services/Inspections',
          icon: MdEngineering,
        },
        {
          label: 'Engineering/Bus and Transit',
          icon: MdBuild,
        },
        {
          label: 'Engineering/Drafting',
          icon: MdBuild,
        },
        {
          label: 'Finance/Accounting',
          icon: MdAttachMoney  ,
        },
        {
          label: 'Finance/Administration',
          icon: MdAttachMoney  ,
        },
        {
          label: 'Finance/Print Shop',
          icon: MdAttachMoney  ,
        },
        {
          label: 'Finance/Purchasing',
          icon: MdAttachMoney  ,
        },
        {
          label: 'Finance/Utilities',
          icon: MdAttachMoney  ,
        },
        {
          label: 'Fire/Administration',
          icon: MdLocalFireDepartment ,
        },
        {
          label: 'Housing/Housing Code',
          icon: MdHome,
        },
        {
          label: 'Human Relations/Administration',
          icon: MdPeople,
        },
        {
          label: 'Owners',
          icon: MdPeople,
        },
        {
          label: 'Parks and Recreations/Administration',
          icon: MdOutlinePark,
        },
        {
          label: 'Personnel/Administration',
          icon: MdPeople,
        },
        {
          label: 'Personnel/Benefits',
          icon: MdPeople,
        },
        {
          label: 'Personnel/Employee Health',
          icon: MdPeople,
        },
        {
          label: 'Police/Administration',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Police/Animal Control',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Police/Investigations',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Police/No Division',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Police/Patrol Services',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Police/Special Operations',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Police/Support Services',
          icon: MdLocalPolice    ,
        },
        {
          label: 'Public Works/Administration',
          icon: MdPublic,
        },
        {
          label: 'Public Works/Engineering',
          icon: MdPublic,
        },
        {
          label: 'Public Works/Fleet Maintenance',
          icon: MdPublic,
        },
        {
          label: 'Public Works/Streets',
          icon: MdPublic,
        },
        {
          label: 'Utilities/Administration',
          icon: MdWater,
        },
        {
          label: 'Water/Administration',
          icon: MdWater,
        },
        {
          label: 'Water/Wastewater',
          icon: MdWater,
        },
        {
          label: 'Water/Water Sewer',
          icon: MdWater,
        },
      ];