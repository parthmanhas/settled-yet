"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "./checkbox"
import { Dispatch, SetStateAction, useState } from "react"
import { ArrowLeft } from "lucide-react";
import { Group } from "@/app/types";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

export function WhoPaidSheet({ group, paidBy, setPaidBy }: { group: Group, paidBy: string, setPaidBy: Dispatch<SetStateAction<string>> }) {

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>{paidBy}</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] bg-black px-5 sm:px-20 lg:px-40">
                <SheetHeader>
                    <SheetTitle className="mb-5">Who paid ?</SheetTitle>
                </SheetHeader>
                <RadioGroup defaultValue={paidBy} onValueChange={value => setPaidBy(value)}>
                    {
                        group.members.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2">
                                <RadioGroupItem className="text-white" value={member.name} id={member.name} />
                                <Label htmlFor={member.name}>{member.name}</Label>
                            </div>
                        ))
                    }
                </RadioGroup>
                <SheetFooter className="flex flex-row justify-center">
                    <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
