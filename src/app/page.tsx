"use client";
import { CreateGroupSheet } from "@/components/ui/create-group-sheet";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useStore } from "@/store/store";
import { AddExpenseSheet } from "@/components/ui/add-expense-sheet";
import ViewBalances from "@/components/ui/view-balance-sheet";
import EditGroup from "@/components/ui/edit-group";
import Image from "next/image";
import { Cross1Icon } from "@radix-ui/react-icons";
import ViewExpenseSheet from "@/components/ui/view-expense-sheet";
import { Button } from "@/components/ui/button";
import { ImproveDialog } from "@/components/ui/improve-dialog";

export default function Home() {

  const groups = useStore(state => state.groups);
  const deleteAllGroups = useStore(state => state.deleteAllGroups);
  const removeGroup = useStore(state => state.removeGroup);

  return (
    <main className="max-w-[1200px] p-5 flex flex-col items-center gap-4 text-white/80 m-auto lg:text-xl">
      <div className="flex flex-col gap-2 text-justify px-5 sm:px-20 md:px-30 mb-5">
        <p className="text-center text-5xl">Settled, yet ?</p>
        <p>Settled is alternative to splitwise, I think. If you don&apos;t, please tell me how it can be <span><ImproveDialog /></span></p>
      </div>
      {groups.map(({ id, name, members, expenses, settlementBalances }) => (
        <div key={id} className="flex flex-wrap items-center gap-4 px-5 sm:px-20 md:px-30">
          <Card className="bg-black text-white rounded-none border-white/10">
            <CardHeader className="p-0">
              <CardTitle className="relative flex items-center justify-between">
                <div className="flex-1 h-[50px] flex items-center justify-center">
                  {name}
                </div>
                <Cross1Icon className="hover:cursor-pointer absolute right-0 mr-2 p-1 box-content hover:bg-red-900 transition" onClick={() => removeGroup(id)} />
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
            <CardContent className="flex p-0 h-[100px]">
              <div className="flex-1 bg-neutral-800 flex items-center justify-center">
                <p>Members: {members.length}</p>
              </div>
              <div className="flex-1 bg-neutral-700 flex items-center justify-center">
                <p>Total Expense: {expenses.reduce((acc, curr) => acc + curr.amount, 0)}</p>
              </div>
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
