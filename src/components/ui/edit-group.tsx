"use client";
import { v4 as uuidv4 } from 'uuid';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./button"
import { Input } from "./input"
import { useStore } from '@/store/store';
import { Cross1Icon } from '@radix-ui/react-icons';


export default function EditGroup({ groupId }: { groupId: string }) {

    const addMember = useStore(state => state.addMember);
    const updateGroupName = useStore(state => state.updateGroupName);
    const deleteMember = useStore(state => state.deleteMember);
    const updateMember = useStore(state => state.updateMember);
    const removeEmptyMembers = useStore(state => state.removeEmptyMembers);
    const groups = useStore(state => state.groups);
    const group = groups.find(g => g.id === groupId);

    if (!group) {
        console.error('Cannot find group');
        return;
    }

    const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const updatedMember = { id, name: e.target.value };
        updateMember(group.id, updatedMember);
    }

    const handleDeleteMemberInput = (memberId: string) => {
        deleteMember(group.id, memberId);
    }

    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateGroupName(group.id, e.target.value);
    }

    const handleAddMember = () => {
        const name = "";
        const id = uuidv4();
        const member = { id, name };
        addMember(group.id, member);
    }

    return (
        <Sheet onOpenChange={(open) => !open ? removeEmptyMembers(groupId) : null}>
            <SheetTrigger asChild>
                <Button className='sheet-button'>Edit Group</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 overflow-auto bg-black max-w-lg m-auto border-2 border-white/50">
                <SheetHeader>
                    <SheetTitle>Edit Group</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    <Input value={group.name} onChange={handleGroupNameChange} type="text" placeholder="Group Name" />
                    <div className='flex flex-col gap-4 max-h-[230px] overflow-y-auto scrollbar'>
                        {group.members.map(({ id, name }) => (
                            <div key={id} className="flex gap-2 items-center last:mb-5">
                                <Input value={name} onChange={e => handleMemberInputChange(e, id)} type="text" placeholder="Add Member Name" />
                                <Cross1Icon className='mr-2 hover:cursor-pointer' onClick={() => handleDeleteMemberInput(id)} />
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleAddMember} type="button">Add Another Member</Button>
                </div>
            </SheetContent>
        </Sheet>

    )
}
