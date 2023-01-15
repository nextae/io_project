import { DropdownMenu, DropdownMenuItem } from "@/components/DropdownMenu";
import { IconButton } from "@/components/IconButton";
import { useState } from "react";
import {
  IoEllipsisHorizontal,
  IoPencilOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { ChangeMemberRoleDialog } from "./dialogs/ChangeMemberRoleDialog";
import { DeleteMemberDialog } from "./dialogs/DeleteMemberDialog";

export const MemberMenu = (params: {
  serverId: number;
  userId: number;
    memberName: string;
}) => {
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <ChangeMemberRoleDialog
        {...params}
        open={changeDialogOpen}
        onOpenChange={(x) => setChangeDialogOpen(x)}
      />
      <DeleteMemberDialog
        {...params}
        open={deleteDialogOpen}
        onOpenChange={(x) => setDeleteDialogOpen(x)}
      />
      <DropdownMenu
        trigger={
          <IconButton icon={<IoEllipsisHorizontal />} title="Member menu" />
        }
      >
        <DropdownMenuItem
          icon={<IoPencilOutline />}
          onSelect={(e) => setChangeDialogOpen(true)}
        >
          Change role
        </DropdownMenuItem>

        <DropdownMenuItem
          icon={<IoTrashBinOutline />}
          onSelect={(e) => setDeleteDialogOpen(true)}
        >
          <span>Kick member</span>
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  );
};
