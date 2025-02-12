import { IconType } from 'react-icons';
import { VscFolderActive } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";

type Status = {
  label: StatusLabel;
  icon: IconType;
};

export type StatusLabel =
    | 'Active'    
    | 'Deleted';

    export const status: Status[] = [
        {
          label: 'Active',
          icon: VscFolderActive ,
        },
        {
          label: 'Deleted',
          icon: RiDeleteBin6Line ,
        },
    
      ];