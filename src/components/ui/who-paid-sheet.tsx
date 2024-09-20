"use client";

import { Button } from "@/components/ui/button"
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
import { Group, Member } from "@/app/types";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

export function WhoPaidSheet({ group, paidBy, setPaidBy }: { group: Group, paidBy: Member | undefined, setPaidBy: Dispatch<SetStateAction<Member | undefined>> }) {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>{paidBy?.name || 'Select'}</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] bg-black px-5 max-w-lg m-auto border-2 border-white/50">
                <SheetHeader>
                    <SheetTitle className="mb-5 text-3xl">Who paid ?</SheetTitle>
                </SheetHeader>
                <RadioGroup defaultValue={paidBy?.id} onValueChange={id => setPaidBy(group.members.find(m => m.id === id))}>
                    {
                        group.members.length > 0 ?
                        group.members.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2">
                                <RadioGroupItem className="text-white border2 border-white/50 flex" value={member.id} id={member.id} />
                                <Label className="text-2xl" htmlFor={member.id}>{member.name}</Label>
                            </div>
                        )) :
                        "No members added "
                    }
                </RadioGroup>
                <SheetFooter className="flex flex-row justify-center">
                    <SheetClose asChild>
                        {group.members.length > 0 ? <Button type="submit">Save changes</Button> : null}
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
