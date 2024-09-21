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
import React from "react"
import { useStore } from "@/store/store"

export default function ViewExpenseSheet({ groupId }: { groupId: string }) {

    const groups = useStore(state => state.groups);
    const group = groups.find(g => g.id === groupId);
    if (!group) {
        console.error('Cannot find group');
        return;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='sheet-button'>View Expenses</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 overflow-auto bg-black max-w-lg m-auto border-2 border-white/50">
                <SheetHeader>
                    <SheetTitle>Current Expenses</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto max-h-80 scrollbar">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Paid By</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {group.expenses.map((expense, index) =>
                                expense.amount !== 0 ?
                                    <TableRow key={index}>
                                        <TableCell>{expense.desc}</TableCell>
                                        <TableCell>{expense.paidBy.name}</TableCell>
                                        <TableCell className="text-right">{Math.abs(expense.amount)}</TableCell>
                                    </TableRow>
                                    :
                                    null
                            )}
                        </TableBody>
                    </Table>
                </div>
            </SheetContent>
        </Sheet>
    )
}