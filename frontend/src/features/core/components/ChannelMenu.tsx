import { DropdownMenu, DropdownMenuItem } from "@/components/DropdownMenu";
import { IconButton } from "@/components/IconButton";
import { useState } from "react";
import {
  IoEllipsisHorizontal,
  IoPencilOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { ChangeChannelNameDialog } from "./dialogs/ChangeChannelNameDialog";
import { DeleteChannelDialog } from "./dialogs/DeleteChannelDialog";

export const ChannelMenu = (params: {
  serverId: number;
  channelId: number;
  channelName: string;
}) => {
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <ChangeChannelNameDialog
        {...params}
        open={changeDialogOpen}
        onOpenChange={(x) => setChangeDialogOpen(x)}
      />
      <DeleteChannelDialog
        {...params}
        open={deleteDialogOpen}
        onOpenChange={(x) => setDeleteDialogOpen(x)}
      />
      <DropdownMenu
        trigger={
          <IconButton icon={<IoEllipsisHorizontal />} title="Channel menu" />
        }
      >
        <DropdownMenuItem
          icon={<IoPencilOutline />}
          onSelect={(e) => setChangeDialogOpen(true)}
        >
          Change name
        </DropdownMenuItem>

        <DropdownMenuItem
          icon={<IoTrashBinOutline />}
          onSelect={(e) => setDeleteDialogOpen(true)}
        >
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenu>
    </>
  );
};
