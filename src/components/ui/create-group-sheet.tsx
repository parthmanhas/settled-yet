"use client";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Dispatch, SetStateAction, useState } from "react"
import { Cross1Icon } from "@radix-ui/react-icons";
import { Group, Groups } from '@/app/types';

export function CreateGroupSheet({ setGroups, groups }: { setGroups: Dispatch<SetStateAction<Groups>>, groups: Groups }) {

    const initialiseNewGroup = { id: uuidv4(), name: '', expenses: [], members: [], settlementBalances: [] };
    const [group, setGroup] = useState<Group>(initialiseNewGroup);
    // const [memberInput, setMemberInput] = useState<string[]>([]);
    const [error, setError] = useState('');
    const handleSubmit = (e) => {
        if(!group.name) {
            setError('Group name missing');
            e.preventDefault();
            return;
        }
        if(group.members.length < 2) {
            setError('Group members need to be atleast 2');
            e.preventDefault();
            return;
        }
        setError('');
        setGroups([...groups, group]);
        setGroup(initialiseNewGroup);
    }

    const handleDeleteMemberInput = (id: string) => {
        // setMemberInput([...memberInput.filter(inputId => inputId !== id)]);
        // setGroup(Object.fromEntries(Object.entries(group).filter(([inputId, value]) => inputId !== id)));
        setGroup({ ...group, members: [...group.members.filter(m => m.id !== id)] });
    }

    const handleMemberInputChange = (e, id: string) => {
        const updatedMember = { id, name: e.target.value };
        let members = group.members;
        members = members.map(member => member.id === id ? updatedMember : member);
        setGroup({ ...group, members });
    }

    const handleGroupNameChange = e => {
        setGroup({ ...group, name: e.target.value });
    }

    const renderMemberInput = (id: string, memberName: string) => (
        <div className="flex gap-2 items-center">
            <Input value={memberName} onChange={(e) => handleMemberInputChange(e, id)} type="text" placeholder="Add Member Name" />
            <Cross1Icon onClick={() => handleDeleteMemberInput(id)} />
        </div>
    );


    const handleAddMember = (e) => {
        const name = e.target.value;
        const id = uuidv4();
        const member = { id, name };
        setGroup({ ...group, members: [...group.members, member] });
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Create Group</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 sm:px-20 md:px-40 overflow-auto bg-black">
                <SheetHeader>
                    <SheetTitle>Add Member</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    <Input value={group.name} onChange={handleGroupNameChange} type="text" placeholder="Group Name" />
                    <div className='flex flex-col gap-4 max-h-[250px] overflow-y-auto'>
                        {/* {memberInput.map((id) => <div key={id}>{renderMemberInput(id)}</div>)} */}
                        {group.members.map((member) => (
                            <div key={member.id}>{renderMemberInput(member.id, member.name)}</div>
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
                            {error && <p className='text-red-600 text-center'>{error}</p>}
                        </div>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
