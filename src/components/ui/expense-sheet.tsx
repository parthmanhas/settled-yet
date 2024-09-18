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
import { WhoPaidSheet } from "./who-paid-sheet"
import { Expense, Expenses, Group, Groups, Transaction } from "@/app/types"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateGroupSheet } from "./create-group-sheet"
import ViewBalances from "./view-balance-sheet"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "./toast"

type ExpenseSheetProps = {
    group: Group;
    groups: Groups;
    setGroups: Dispatch<SetStateAction<Groups>>;
}

const calculateBalances = (expenses: Expenses): Transaction[] => {
    const people = new Set();
    expenses.forEach(expense => people.add(expense.paidBy));
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const average = total / people.size;

    const debtors: any = [];
    const creditors: any = [];

    expenses.forEach(expense => {
        const balance = average - expense.amount;
        if (balance > 0) {
            creditors.push({ person: expense.paidBy, amount: balance });
        } else {
            debtors.push({ person: expense.paidBy, amount: balance });
        }
    })

    const transactions: Transaction[] = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // Pay the minimum between what debtor owes and what creditor is owed
        const amountToPay = Math.min(debtor.amount, creditor.amount);

        transactions.push({
            id: uuidv4(),
            from: debtor.person,
            to: creditor.person,
            amount: parseFloat(amountToPay.toFixed(2)),
            settled: false
        });

        // Adjust balances after the transaction
        debtor.amount -= amountToPay;
        creditor.amount -= amountToPay;

        // Move to next debtor or creditor if they are settled
        if (debtor.amount === 0) i++;
        if (creditor.amount === 0) j++;

    }
    return transactions;
}

export function ExpenseSheet({ group, groups, setGroups }: ExpenseSheetProps) {

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [paidBy, setPaidBy] = useState('Select');
    const [error, setError] = useState('');
    const { toast } = useToast();

    const handleSaveChanges = (e) => {
        if (description === '') {
            e.preventDefault();
            setError('Description is missing');
            return;
        }
        if (amount <= 0) {
            e.preventDefault();
            setError('Amount should be > 0');
            return;
        }
        if (paidBy === 'Select') {
            e.preventDefault();
            setError('Select paid by');
            return;
        }
        setError('');
        const updatedExpenses: Expense[] = [...group.expenses, { groupName: group.name, amount, desc: description, paidBy }];
        const settlementBalances = calculateBalances(updatedExpenses);
        const updatedGroup: Group = { ...group, expenses: updatedExpenses, settlementBalances };
        setGroups([...groups.map(g => g.id === updatedGroup.id ? updatedGroup : g)]);
        setDescription('');
        setAmount(0);
        setPaidBy('Select');
        toast({
            title: "Expense Added"
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>Add Expense</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 sm:px-20 lg:px-40 bg-black">
                <SheetHeader>
                    <SheetTitle>Add Expense</SheetTitle>
                </SheetHeader>
                <div className="flex gap-4 items-center">
                    <p>Group Name: {group.name}</p>
                </div>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input onChange={e => setDescription(e.target.value)} value={description} type="text" className="col-span-3" placeholder="Enter Description" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input onChange={e => setAmount(parseFloat(e.target.value))} value={amount} type="number" step="0.01" className="col-span-3" placeholder="0.00" />
                    </div>
                    <div className="flex gap-4 items-center">
                        <p>Paid By</p>
                        <WhoPaidSheet paidBy={paidBy} setPaidBy={setPaidBy} group={group} />
                    </div>
                </div>
                <div className="flex flex-col my-5 items-center">
                    <Button onClick={handleSaveChanges} type="submit">Save changes</Button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </SheetContent>
        </Sheet>
    )
}
