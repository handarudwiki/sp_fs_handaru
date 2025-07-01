'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';

const projectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
});

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const createProjectMutation = useCreateProject();
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      await createProjectMutation.mutateAsync(values);
      toast.success('Project created successfully!');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}