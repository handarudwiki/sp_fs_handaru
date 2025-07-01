"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchUsers } from "@/hooks/useAuth";
import { useInviteMember } from "@/hooks/useProjects";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

const inviteSchema = z.object({
  user_id: z.string().uuid({  message: "Invalid user ID format" }),
});

interface InviteMemberFormProps {
  projectId: string;
  onSuccess?: () => void;
}

export default function InviteMemberForm({
  projectId,
  onSuccess,
}: InviteMemberFormProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: users = [], isFetching } = useSearchUsers(debouncedSearch);
  const inviteMutation = useInviteMember();

  console.log("Users:", users);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      user_id: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
    try {
      await inviteMutation.mutateAsync({
        projectId,
        user_id: values.user_id,
      });
      toast.success("Member invited successfully!");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to invite member");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Email</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Input
                      placeholder="Enter email address..."
                      {...field}
                      onChange={(e) => {
                        console.log(searchQuery, "searchQuery");
                        const value = e.target.value;
                        field.onChange(value);
                        setSearchQuery(value);
                        setOpen(!!value);
                      }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        value={searchQuery}
                        onValueChange={(value) => {
                          setSearchQuery(value);
                          field.onChange(value);
                          setOpen(!!value);
                        }}
                        placeholder="Search users..."
                      />

                      <CommandEmpty>
                        {isFetching ? "Searching..." : "No users found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {users.map((user: any) => (
                          <CommandItem
                            key={user.id}
                            value={user.email}
                            onSelect={() => {
                              field.onChange(user.id);
                              setSearchQuery(user.email);
                              setOpen(false);
                            }}
                          >
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={inviteMutation.isPending}
        >
          {inviteMutation.isPending ? "Inviting..." : "Invite Member"}
        </Button>
      </form>
    </Form>
  );
}
