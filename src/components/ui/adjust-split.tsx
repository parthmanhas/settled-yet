import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "./checkbox"
import { Input } from "./input";


export function AdjustSplitSheet() {

    const people = ["Test user 1", "Test user 2", "Test user 3"];

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>equally</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="text-white/80 min-h-[60vh] bg-black lg:px-40">
                <SheetHeader>
                    <SheetTitle>Adjust Split</SheetTitle>
                    <Tabs defaultValue="equally">
                        <TabsList className="grid grid-cols-3">
                            <TabsTrigger value="equally">Equally</TabsTrigger>
                            <TabsTrigger value="unequally">Unequally</TabsTrigger>
                            <TabsTrigger value="percentages">By percentages</TabsTrigger>
                        </TabsList>
                        <TabsContent value="equally" className="flex flex-col items-center justify-center mt-10">
                            {people.map((name, index) => (
                                <div key={index} className="items-top flex space-x-2 mb-5">
                                    <Checkbox id={name} />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor={name}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {name}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>
                        <TabsContent value="unequally" className="flex justify-center mt-10">
                            <div className="flex flex-col gap-4">
                                {people.map((name, index) => (
                                    <div key={index} className="flex gap-4 items-end">
                                        <p className="whitespace-nowrap">{name}</p>
                                        <Input type="number" step="0.01" min="0" placeholder="0.00" />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="percentages" className="flex justify-center">
                            <div className="flex flex-col gap-4">
                                {people.map((name, index) => (
                                    <div key={index} className="flex gap-4 items-end">
                                        <p className="whitespace-nowrap">{name}</p>
                                        <Input type="number" step="0.01" min="0" placeholder="0.00" />%
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="shares">By shares</TabsContent>
                        <TabsContent value="adjustment">By adjustment</TabsContent>
                    </Tabs>
                </SheetHeader>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button className="mt-5" type="submit">Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet >
    )
}
