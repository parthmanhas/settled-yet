"use client";
import { v4 as uuidv4 } from 'uuid';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetClose,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./button"
import { Input } from "./input"
import { Group, Groups } from "@/app/types"
import { Dispatch, SetStateAction, useState } from "react"
import { Cross1Icon } from "@radix-ui/react-icons"


export default function EditGroup({ group, groups, setGroups }: { group: Group, groups: Groups, setGroups: Dispatch<SetStateAction<Groups>> }) {

    const [updatedGroup, setupdatedGroup] = useState<Group>(group);

    const handleSubmit = () => {
        if (updatedGroup.members.length < 2 || !Object.keys(updatedGroup).includes('name')) {
            console.error('Cannot add group due to low members or name of group not included');
            return;
        }
        const updatedGroups = [...groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)];
        setGroups(updatedGroups);
    }

    const handleDeleteMemberInput = (id: string) => {
        // setMemberInput([...memberInput.filter(inputId => inputId !== id)]);
        // setupdatedGroup(Object.fromEntries(Object.entries(group).filter(([inputId, value]) => inputId !== id)));
    }

    const handleMemberInputChange = (e, id: string) => {
        const updatedMember = { id, name: e.target.value };
        let members = updatedGroup.members;
        members = members.map(member => member.id === id ? updatedMember : member);
        setupdatedGroup({ ...updatedGroup, members });
    }

    const renderMemberInput = (id: string, memberName: string) => (
        <div key={id} className="flex gap-2 items-center">
            <Input value={memberName} onChange={(e) => handleMemberInputChange(e, id)} type="text" placeholder="Add Member Name" />
            <Cross1Icon onClick={() => handleDeleteMemberInput(id)} />
        </div>
    );

    const handleGroupNameChange = e => {
        setupdatedGroup({ ...updatedGroup, name: e.target.value });
    }

    const handleAddMember = (e) => {
        const name = e.target.value;
        const id = uuidv4();
        const member = { id, name };
        // setMemberInput([...memberInput, id])
        setupdatedGroup({ ...updatedGroup, members: [...updatedGroup.members, member] });
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Edit Group</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 sm:px-20 lg:px-40 overflow-auto bg-black">
                <SheetHeader>
                    <SheetTitle>Edit Group</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    <Input value={updatedGroup.name} onChange={handleGroupNameChange} type="text" placeholder="Group Name" />
                    <div className='flex flex-col gap-4 max-h-[250px] overflow-y-auto'>
                        {/* {memberInput.map((id) => <div key={id}>{renderMemberInput(id)}</div>)} */}
                        {updatedGroup.members.map((member) => (
                            renderMemberInput(member.id, member.name)
                        ))}
                    </div>
                    <Button onClick={handleAddMember} type="button">Add Another Member</Button>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <div className='flex flex-col w-full'>
                            {/* <Button disabled={memberInput.length > 2} onClick={handleSubmit} className="mt-5" type="submit">Save Group</Button> */}
                            <Button onClick={handleSubmit} className="mt-5" type="submit">Save Group</Button>
                            {/* {memberInput.length < 2 && <p className='text-red-600 text-center'>Minimum members should be 2</p>} */}
                            {Object.keys(updatedGroup).length <= 2 && <p className='text-red-600 text-center'>Minimum members should be 2</p>}
                        </div>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>

    )
}
