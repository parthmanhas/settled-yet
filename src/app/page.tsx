"use client";
import { CreateGroupSheet } from "@/components/ui/create-group-sheet";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useStore } from "@/store/store";
import { AddExpenseSheet } from "@/components/ui/add-expense-sheet";
import ViewBalances from "@/components/ui/view-balance-sheet";
import EditGroup from "@/components/ui/edit-group";
import Image from "next/image";
import { Cross1Icon } from "@radix-ui/react-icons";
import ViewExpenseSheet from "@/components/ui/view-expense-sheet";
import { Button } from "@/components/ui/button";

export default function Home() {

  const groups = useStore(state => state.groups);
  const deleteAllGroups = useStore(state => state.deleteAllGroups);
  const removeGroup = useStore(state => state.removeGroup);

  return (
    <main className="max-w-[1200px] p-5 flex flex-col items-center gap-4 text-white/80 m-auto lg:text-xl">
      <div className="flex flex-col gap-2 text-justify px-5 sm:px-20 md:px-30">
        <p className="text-center text-5xl">Settled, yet ?</p>
        <p>Settled is alternative to splitwise, I think. If you don't, please tell me how it can be improved</p>
      </div>
      {groups.map(({ id, name, members, expenses, settlementBalances }, index) => (
        <div key={id} className="flex flex-wrap items-center gap-4 px-5 sm:px-20 md:px-30">
          <Card className="bg-black text-white rounded-none border-white/10">
            <CardHeader>
              <CardTitle className="relative flex justify-between">
                {name}
                <Cross1Icon className="hover:cursor-pointer" onClick={() => removeGroup(id)} />
                {
                  (
                    (settlementBalances.length > 0 && settlementBalances.every(balance => balance.settled))
                    ||
                    (expenses.length > 0 && settlementBalances.length === 0)
                  )
                  &&
                  <Image className="absolute top-0 right-5 -rotate-12" src="/settled.png" alt="" width={100} height={100} />
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Members: {members.length}</p>
              <p>Total Expense: {expenses.reduce((acc, curr) => acc + curr.amount, 0)}</p>
            </CardContent>
            <CardFooter className="flex flex-wrap p-0">
              <AddExpenseSheet groupId={id} />
              <ViewExpenseSheet groupId={id} />
              <ViewBalances groupId={id} />
              <EditGroup groupId={id} />
            </CardFooter>
          </Card>
        </div>
      ))}

      <CreateGroupSheet />
      {groups.length > 1 && <Button onClick={() => deleteAllGroups()}>Delete All Groups</Button>}
    </main>
  );
}
