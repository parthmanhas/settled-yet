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
import { Dispatch, SetStateAction } from "react"

export default function ViewBalances({ group, groups, setGroups }: { group: Group, groups: Groups, setGroups: Dispatch<SetStateAction<Groups>> }) {

    const handleCheckboxChange = (e, balanceId: string) => {
        const settled = e;
        const updateGroupWithSettlementBalance: Group = { ...group, settlementBalances: [...group.settlementBalances.map(b => b.id === balanceId ? { ...b, settled } : b)] };
        setGroups([...groups.map(g => g.id === updateGroupWithSettlementBalance.id ? updateGroupWithSettlementBalance : g)]);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>View Balances</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 sm:px-20 lg:px-40 overflow-auto bg-black">
                <SheetHeader>
                    <SheetTitle>Current Balance</SheetTitle>
                </SheetHeader>
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
            </SheetContent>
        </Sheet>
    )
}