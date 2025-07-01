import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskAnalytics } from '@/hooks/useTasks';

interface TaskAnalyticsChartProps {
  projectId: string;
}

const COLORS = {
  TODO: '#8884d8',
  IN_PROGRESS: '#82ca9d',
  DONE: '#ffc658',
};

export default function TaskAnalyticsChart({ projectId }: TaskAnalyticsChartProps) {
  const { data: analytics, isLoading } = useTaskAnalytics(projectId);

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  const barData = [
    { name: 'To Do', value: analytics.todo, fill: COLORS.TODO },
    { name: 'In Progress', value: analytics.inProgress, fill: COLORS.IN_PROGRESS },
    { name: 'Done', value: analytics.done, fill: COLORS.DONE },
  ];

  const pieData = barData.filter(item => item.value > 0);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
          <CardDescription>Number of tasks by status</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Task completion ratio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}