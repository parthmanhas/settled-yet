
"use client";
import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
import { Textarea } from "./textarea"
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./input";
import { submitForm } from "@/actions";

export function ImproveDialog() {

    const [submitting, setSubmitting] = useState(false);

    const [formSubmitted, setFormSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {

        setFormSubmitted(true);
        setSubmitting(true);
        if (!e.target.checkValidity()) {
            return
        }

        e.preventDefault();
        const form = new FormData(e.target)
        const success = await submitForm(form);
        setSubmitting(false);
        if (!success) {
            toast({
                variant: "destructive",
                title: "Error sending Message, please try again !"
            })
        }

        if (success && formSubmitted) {
            toast({
                title: "Message Sent Successfully !"
            })
        }
    }

    return (
        <Dialog onOpenChange={(open) => !open ? setFormSubmitted(false) : null}>
            <DialogTrigger className="underline">improved</DialogTrigger>
            <DialogContent className="max-w-[300px] sm:max-w-[425px] bg-black text-white">
                <DialogHeader>
                    <DialogTitle>How can I improve ?</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Input className={formSubmitted ? "invalid:border-red-500" : ""} name="name" type="text" placeholder="Name" required />
                    <Input className={formSubmitted ? "invalid:border-red-500" : ""} name="email" type="email" placeholder="Email" required />
                    <Textarea className={formSubmitted ? "invalid:border-red-500 min-h-[200px]" : "min-h-[200px]"} name="message" placeholder="help me improve" required />
                    <Button disabled={submitting} type="submit">{submitting ? <LoaderIcon className='animate-spin' /> : <>Submit</>}</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}