"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_FORM_VALUES, state } from "@/model/client/state";
import { UserMessageEvent } from "@/model/shared/types/agentEvent";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useSnapshot } from "valtio";
import { FormValues } from "../model/shared/types/form";

export default function Chat() {
  // const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
  //   api: "/api/chat",
  //   experimental_onFunctionCall: async (message) => {return},
  // });
  const snap = useSnapshot(state);

  // Generate a map of message role to text color
  // const roleToColorMap: Record<Message["role"], string> = {
  //   system: "red",
  //   user: "black",
  //   function: "blue",
  //   assistant: "green",
  // };

  const form = useForm<FormValues>({
    resolver: zodResolver(FormValues),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
    shouldUseNativeValidation: true,
  });

  // TODO use watch with a callback to update the form state in Signia

  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // });

  function onValid(data: FormValues) {
    console.log("here");
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function handleFormChange(e: React.ChangeEvent<HTMLFormElement>) {
    console.log({ target: e.target });
  }

  function handleFocus(e: React.FocusEvent<HTMLFormElement>) {
    console.log({ target: e.target });
  }

  // function registerFocus(e: React.FocusEvent<HTMLFormElement>) {
  //   // check if target is an interactive element
  //   let eventMessage: EventMessage;
  //   if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
  //   eventMessage = {
  //       target: "form." + e.target.name,
  //       event: "focus"
  //   };
  // }}

  // function registerFocus (e: React.FormEvent<HTMLFormElement>) {

  // }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const event: UserMessageEvent = {
      id: nanoid(),
      agent: "user",
      message: state.input,
      target: "chat",
      action: "message",
    };
    state.input = "";
    state.agentEvents.push(event);
    e.preventDefault();

    const values = form.getValues();
    const zodResult = FormValues.safeParse(values);

    let validationState;
    if (zodResult.success) {
      validationState = {
        valid: true as const,
      };
    } else {
      const firstError = zodResult.error.errors[0];
      const firstErrorField = firstError.path[0];
      validationState = {
        valid: false as const,
        target: `field.${firstErrorField}`,
        error: firstError.message,
      };
    }
    getResponse(validationState);
  };

  return (
    <div className="flex">
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {/* {messages.length > 0
          ? messages.map((m: Message) => (
              <div
                key={m.id}
                className="whitespace-pre-wrap"
                style={{ color: roleToColorMap[m.role] }}
              >
                <strong>{`${m.role}: `}</strong>
                {m.content || JSON.stringify(m.function_call)}
                <br />
                <br />
              </div>
            ))
          : null} */}
        <div id="chart-goes-here"></div>
        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
            value={snap.input}
            placeholder="Say something..."
            onChange={(e) => (state.input = e.target.value)}
          />
        </form>
      </div>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValid)}
            className="space-y-8"
            onChange={handleFormChange}
            onFocus={handleFocus}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name or a pseudonym. You
                    can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="m@example.com">m@example.com</SelectItem>
                      <SelectItem value="m@google.com">m@google.com</SelectItem>
                      <SelectItem value="m@support.com">m@support.com</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage verified email addresses in your{" "}
                    <Link href="/examples/forms">email settings</Link>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations to link to them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div>
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`urls.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>URLs</FormLabel>
                      <FormDescription className={cn(index !== 0 && "sr-only")}>
                        Add links to your website, blog, or social media profiles.
                      </FormDescription>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                Add URL
              </Button>
            </div> */}
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
