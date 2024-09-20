import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { WhoPaidSheet } from "./who-paid-sheet"
import { Expense, Expenses, Group, Groups, Member, Transaction } from "@/app/types"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from '@/store/store';

const getMembersTotalPaid = (expenses: Expense[]) => {
    const totalAmountPaid: { [id: string]: { member: Member, totalPaid: number } } = {};
    expenses.forEach(expense => {
        if (!totalAmountPaid[expense.paidBy.id]) {
            totalAmountPaid[expense.paidBy.id] = {
                member: expense.paidBy,
                totalPaid: expense.amount
            }
        } else {
            totalAmountPaid[expense.paidBy.id].totalPaid += expense.amount;
        }
    })
    return Object.values(totalAmountPaid);
}

const calculateBalances = (members: Member[], expenses: Expenses): Transaction[] => {

    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const perPersonShare = total / members.length;

    let balances = getMembersTotalPaid(expenses);
    balances = balances.map(balance => ({
        ...balance,
        totalPaid: balance.totalPaid - perPersonShare
    }))

    const debtors: { member: Member, totalPaid: number }[] = [];
    const creditors: { member: Member, totalPaid: number }[] = [];

    balances.forEach(balance => {
        if (balance.totalPaid > 0) {
            creditors.push(balance);
        } else if (balance.totalPaid < 0) {
            debtors.push(balance);
        }
    });

    const transactions: Transaction[] = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // Pay the minimum between what debtor owes and what creditor is owed
        let amountToPay = Math.min(Math.abs(debtor.totalPaid), creditor.totalPaid);

        transactions.push({
            id: uuidv4(),
            from: debtor.member.name,
            to: creditor.member.name,
            amount: parseFloat(amountToPay.toFixed(2)),
            settled: false
        });

        // Adjust balances after the transaction
        debtor.totalPaid -= amountToPay;
        creditor.totalPaid -= amountToPay;

        // Move to next debtor or creditor if they are settled
        if (debtor.totalPaid === 0) i++;
        if (creditor.totalPaid === 0) j++;

    }
    return transactions;
}

export function AddExpenseSheet({ groupId }: { groupId: string }) {

    const updateGroup = useStore(state => state.updateGroup);
    const groups = useStore(state => state.groups);
    const group = groups.find(g => g.id === groupId);
    if (!group) {
        console.error('Cannot find group');
        return;
    }

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [paidBy, setPaidBy] = useState<Member>();
    const [error, setError] = useState('');
    const { toast } = useToast();

    const handleSaveChanges = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        if (!paidBy) {
            e.preventDefault();
            setError('Select paid by');
            return;
        }
        setError('');
        const updatedExpenses: Expense[] = [...group.expenses, ...group.members.map(m => m.id === paidBy.id ? { groupName: group.name, amount, desc: description, paidBy } : { groupName: group.name, amount: 0, desc: description, paidBy: m })];
        // const updatedExpenses: Expense[] = [...group.expenses, { groupName: group.name, amount, desc: description, paidBy }];
        const settlementBalances = calculateBalances(group.members, updatedExpenses);
        const updatedGroup: Group = { ...group, expenses: updatedExpenses, settlementBalances };
        updateGroup(updatedGroup);
        setDescription('');
        setAmount(0);
        setPaidBy(undefined);
        toast({
            title: "Expense Added"
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='sheet-button'>Add Expense</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] px-5 bg-black  max-w-lg m-auto border-2 border-white/50">
                <SheetHeader className='mb-5'>
                    <SheetTitle>Add Expense</SheetTitle>
                </SheetHeader>
                <div className="flex gap-4 items-center">
                    <p>Group Name: {group.name}</p>
                </div>
                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <Input onChange={e => setDescription(e.target.value)} value={description} type="text" className="col-span-3" placeholder="Enter Description" />
                    </div>
                    <div>
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
