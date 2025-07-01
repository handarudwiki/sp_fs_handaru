'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateTask } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { useSearchUsers } from '@/hooks/useAuth';
import { User } from '@/types';

const taskSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  assigneeId: z.string().uuid(), 
});

interface CreateTaskFormProps {
  projectId: string;
  defaultStatus?: string;
  onSuccess?: () => void;
}

export default function CreateTaskForm({ 
  projectId, 
  defaultStatus = 'TODO', 
  onSuccess 
}: CreateTaskFormProps) {
  const createTaskMutation = useCreateTask();
  
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '', // Default to no assignee
      status: defaultStatus as any,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    console.log('Form Values:', values);
    try {
      await createTaskMutation.mutateAsync({
        title: values.title,
        description: values.description,
        project_id: projectId,
        assigned_id: values.assigneeId,
      });
      toast.success('Task created successfully!');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };
  
  const users =  useSearchUsers('all');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter task description" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign Task" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.data?.map((user:User) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={createTaskMutation.isPending}
        >
          {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </Form>
  );
}