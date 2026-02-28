import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle2, Clock, ListTodo } from "lucide-react";

// Mock Data for "Union National Tax"
const projects = [
  {
    id: "unt-001",
    name: "Union National Tax",
    status: "In Progress",
    tasks: [
      { id: 1, title: "Initial Consultation", status: "Done", due: "2023-10-01" },
      { id: 2, title: "Document Collection", status: "In Progress", due: "2023-10-15" },
      { id: 3, title: "Tax Filing Draft", status: "To Do", due: "2023-10-20" },
      { id: 4, title: "Client Review", status: "To Do", due: "2023-10-25" },
      { id: 5, title: "Final Submission", status: "To Do", due: "2023-10-30" },
    ]
  }
];

export default function Dashboard() {
  const activeProject = projects[0];

  const columns = [
    { id: "To Do", title: "To Do", icon: ListTodo, color: "text-slate-500" },
    { id: "In Progress", title: "In Progress", icon: Clock, color: "text-blue-600" },
    { id: "Done", title: "Done", icon: CheckCircle2, color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Chroma Flow</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-slate-900">Union National Tax</p>
              <p className="text-xs text-slate-500">Client Portal</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-medium">
              UN
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Project Board</h1>
              <p className="mt-1 text-slate-500">Manage tasks and track progress for {activeProject.name}.</p>
            </div>
            <Badge variant="outline" className="px-4 py-1.5 text-sm">
              {activeProject.status}
            </Badge>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col gap-4">
              {/* Column Header */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <col.icon className={`h-5 w-5 ${col.color}`} />
                  <h3 className="font-semibold text-slate-900">{col.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  {activeProject.tasks.filter((t) => t.status === col.id).length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-3">
                {activeProject.tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <Card key={task.id} className="group cursor-pointer border-slate-200 transition-all hover:border-blue-300 hover:shadow-md">
                      <CardHeader className="p-4">
                        <div className="flex justify-between">
                           <CardTitle className="text-sm font-medium text-slate-900">{task.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            Due {task.due}
                          </span>
                          {/* Visual indicator for priority/type could go here */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                {activeProject.tasks.filter((t) => t.status === col.id).length === 0 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 text-slate-400">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
