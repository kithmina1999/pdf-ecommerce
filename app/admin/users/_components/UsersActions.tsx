'use client'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "../../_actions/user";


export function DeleteDropdownItem({
    id,
    disabled
}: {
    id: string;
    disabled?: boolean
}) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    return <DropdownMenuItem
        variant="destructive"
        disabled={disabled || isPending}
        onClick={() => {
            startTransition(async () => {
                await deleteUser(id)
                router.refresh()
            })
        }}>
        Delete
    </DropdownMenuItem>
}