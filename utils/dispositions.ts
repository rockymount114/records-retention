import { IconType } from 'react-icons';
import { TbDeselect } from "react-icons/tb";
import { VscVmActive } from "react-icons/vsc";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import { RiQrScan2Line } from "react-icons/ri";
import { BiTransfer } from "react-icons/bi";

type Disposition = {
  label: DispositionLabel;
  icon: IconType;
};

export type DispositionLabel =
    | 'Active'    
    | 'DESTROYED'    
    | 'REPOSSESSED'    
    | 'SCANNED'    
    | 'TRANSFERRED';

    export const disposition: Disposition[] = [
        {
          label: 'Active',
          icon: VscVmActive ,
        },
        {
          label: 'DESTROYED',
          icon: TbDeselect ,
        },
        {
          label: 'REPOSSESSED',
          icon: RiGitRepositoryCommitsLine  ,
        },
        {
          label: 'SCANNED',
          icon: RiQrScan2Line ,
        },
        {
          label: 'TRANSFERRED',
          icon: BiTransfer ,
        },
    
      ];