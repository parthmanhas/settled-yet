import { Group, Groups } from "@/app/types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "./checkbox"
import React, { Dispatch, SetStateAction } from "react"
import { useStore } from "@/store/store"
import { CheckedState } from "@radix-ui/react-checkbox"

export default function ViewBalances({ groupId }: { groupId: string }) {

    const updateGroup = useStore(state => state.updateGroup);
    const groups = useStore(state => state.groups);
    const group = groups.find(g => g.id === groupId);
    if (!group) {
        console.error('Cannot find group');
        return;
    }

    const handleCheckboxChange = (e: CheckedState, balanceId: string) => {
        const settled = e as boolean;
        const updateGroupWithSettlementBalance: Group = { ...group, settlementBalances: [...group.settlementBalances.map(b => b.id === balanceId ? { ...b, settled } : b)] };
        updateGroup(updateGroupWithSettlementBalance);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='sheet-button'>View Balances</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 overflow-auto bg-black max-w-lg m-auto border-2 border-white/50">
                <SheetHeader>
                    <SheetTitle>Current Balance</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto max-h-80 scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Settled?</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {group.settlementBalances.map((balance, index) => (
                                <TableRow key={index}>
                                    <TableCell><Checkbox className="border-2 border-white/50" checked={balance.settled} onCheckedChange={(e) => handleCheckboxChange(e, balance.id)} /></TableCell>
                                    <TableCell className={`${balance.settled ? "line-through text-green-500" : ""}`}>{balance.from}</TableCell>
                                    <TableCell className={`${balance.settled ? "line-through text-green-500" : ""}`}>{balance.to}</TableCell>
                                    <TableCell className={`text-right ${balance.settled ? "line-through text-green-500" : ""}`}>{Math.abs(balance.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </SheetContent>
        </Sheet>
    )
}