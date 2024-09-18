export type Group = {
    id: string,
    name: string,
    settlementBalances: Transaction[],
    expenses: Expenses,
    members: Member[]
}

export type Member = {
    id: string,
    name: string
}

export type Transaction = {
    id: string,
    from: string;
    to: string;
    amount: number;
    settled: boolean
}

export type Expense = {
    desc: string;
    paidBy: string;
    amount: number;
    groupName: string;
}

export type Expenses = Expense[];
export type Groups = Group[];