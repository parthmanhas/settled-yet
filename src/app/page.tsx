"use client";
import { Button } from "@/components/ui/button";
import { CreateGroupSheet } from "@/components/ui/create-group-sheet";
import { ExpenseSheet } from "@/components/ui/expense-sheet";
import { useEffect, useState } from "react";
import { Expenses, Groups, Transaction } from "./types";
import ViewBalances from "@/components/ui/view-balance-sheet";
import EditGroup from "@/components/ui/edit-group";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
// import { useState } from "react";

export default function Home() {

  // const [people, setPeople] = useState([]);
  const [groups, setGroups] = useState<Groups>([]);

  // useEffect(() => {
  //   let balanceUpdatedGroups = groups.map(group => ({...group, settlementBalances: calculateBalances(group.expenses)}))
  //   setGroups(balanceUpdatedGroups);
  // }, [groups]);

  return (
    <main className="max-w-[1200px] p-5 flex flex-col items-center gap-4 text-white/80 relative">
      <div className="flex flex-col gap-2 text-justify px-5 sm:px-20 md:px-40">
        <p className="text-center text-5xl">Settled yet ?</p>
        <p>Settled app is like having a financial referee for group outings—it makes sure everyone pays their fair share without turning dinner into a math exam. Just input the total, assign who ordered what (or split evenly if you’re all equally broke), and voilà! The app does the math so you can keep the peace. Some even track IOUs or let you settle up on the spot. No more awkward Venmo requests—just fairness served with a side of ease!</p>
      </div>
      {groups.map((group, index) => (
        <div key={index} className="flex flex-wrap items-center gap-4 px-5 sm:px-20 md:px-40">
          <Card className="bg-black text-white">
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Members: {group.members.length}</p>
              <p>Total Expense: {group.expenses.reduce((acc, curr) => acc + curr.amount, 0)}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <ExpenseSheet
                group={group}
                groups={groups}
                setGroups={setGroups}
              />
              <ViewBalances group={group} groups={groups} setGroups={setGroups} />
              <EditGroup group={group} groups={groups} setGroups={setGroups} />
            </CardFooter>
          </Card>
        </div>
      ))}

      <CreateGroupSheet setGroups={setGroups} groups={groups} />
      {/* <ExpenseSheet /> */}
      <Button onClick={() => toast({
        title: "Expense Added"
      })}>Toast</Button>
    </main>
  );
}
