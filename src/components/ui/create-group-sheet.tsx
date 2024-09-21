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
import React, { useState } from "react"
import { Group } from '@/app/types';
import { useStore } from '@/store/store';
import { Cross1Icon } from '@radix-ui/react-icons';

export function CreateGroupSheet() {

    const addGroup = useStore(state => state.addGroup);

    const initialiseNewGroup = { id: uuidv4(), name: '', expenses: [], members: [], settlementBalances: [] };
    const [group, setGroup] = useState<Group>(initialiseNewGroup);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (error !== '') {
            return;
        }
        if (group.name === '') {
            e.preventDefault();
            setError('Group name missing');
            return;
        }
        addGroup(group);
        setGroup(initialiseNewGroup);
    }

    const handleDeleteMemberInput = (id: string) => {
        setGroup({ ...group, members: [...group.members.filter(m => m.id !== id)] });
    }

    const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (group.members.length > 0 && group.members.filter(m => m.name === e.target.value).length > 0) {
            setError('Cannot add members with same name');
            return;
        }
        setError('');
        const updatedMember = { id, name: e.target.value };
        let members = group.members;
        members = members.map(member => member.id === id ? updatedMember : member);
        setGroup({ ...group, members });
    }

    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setGroup({ ...group, name: e.target.value });
    }

    const handleAddMember = () => {
        const name = "";
        const id = uuidv4();
        const member = { id, name };
        setGroup({ ...group, members: [...group.members, member] });
    }

    const resetForm = () => {
        setError('');
        setGroup(initialiseNewGroup);
    }

    return (
        <Sheet onOpenChange={open => !open ? resetForm() : null}>
            <SheetTrigger asChild>
                <Button>Create Group</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 max-w-lg m-auto border-2 border-white/50 overflow-auto bg-black">
                <SheetHeader className='mb-5'>
                    <SheetTitle>Create Group</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                    <div>
                        <Input value={group.name} onChange={handleGroupNameChange} type="text" placeholder="Group Name" />
                        {error && <small className='text-red-500'>{error}</small>}
                    </div>
                    <div className='flex flex-col gap-4 max-h-[170px] overflow-y-auto scrollbar'>
                        {group.members.map((member) => (
                            <div key={member.id} className="flex gap-2 items-center last:mb-5">
                                <Input value={member.name} onChange={(e) => handleMemberInputChange?.(e, member.id)} type="text" placeholder="Add Member Name" />
                                <Cross1Icon className='mr-2 hover:cursor-pointer' onClick={() => handleDeleteMemberInput(member.id)} />
                            </div>
                        ))}
                    </div>
                    <Button onClick={handleAddMember} type="button">Add Another Member</Button>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <div className='flex flex-col w-full'>
                            <Button onClick={handleSubmit} className="mt-5" type="submit">Add Group</Button>
                        </div>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
