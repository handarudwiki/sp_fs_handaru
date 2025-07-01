"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { Task } from "@/types";
import CreateTaskForm from "./CreateTaskForm";
import { pusher } from "@/lib/pusher";

interface KanbanBoardProps {
  projectId: string;
}

const columns = [
  { id: "TODO", title: "To Do", color: "bg-gray-100" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
  { id: "DONE", title: "Done", color: "bg-green-100" },
];

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<string>("TODO");

  const { data: tasksData, refetch } = useTasks({ projectId });

  const updateTaskMutation = useUpdateTask();

  const tasks = tasksData?.data || [];

  console.log("Tasks:", tasks[0]);

  // Real-time updates
  useEffect(() => {
    const channel = pusher.subscribe(`project-${projectId}`);

    channel.bind("task-updated", () => {
      refetch();
    });

    channel.bind("task-created", () => {
      refetch();
    });

    return () => {
      pusher.unsubscribe(`project-${projectId}`);
    };
  }, [projectId, refetch]);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = draggableId;
    const newStatus = destination.droppableId;

    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        status: newStatus as Task["status"],
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };
  console.log(tasks)

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{column.title}</h3>
                <Dialog
                  open={isCreateOpen && createTaskStatus === column.id}
                  onOpenChange={(open) => {
                    setIsCreateOpen(open);
                    if (open) setCreateTaskStatus(column.id);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <CreateTaskForm
                      projectId={projectId}
                      defaultStatus={column.id}
                      onSuccess={() => setIsCreateOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => {
                  const columnTasks = getTasksByStatus(column.id);

                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 p-2 rounded-lg min-h-[200px] ${
                        snapshot.isDraggingOver ? "bg-muted/50" : ""
                      }`}
                    >
                      {columnTasks.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tasks
                        </p>
                      )}

                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-grab ${
                                snapshot.isDragging ? "shadow-lg rotate-2" : ""
                              }`}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">
                                  {task.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                {task.description && (
                               <div className="flex justify-between">
                                   <p className="text-xs text-muted-foreground mb-2">
                                    {task.description} 
                                  </p>
                                  <p>{task.assigned?.email}</p>

                               </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
