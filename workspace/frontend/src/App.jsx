import React, {useState, useEffect} from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API || '/api'

const columns = [
  { key: 'todo', label: 'To do', dot: 'bg-slate-400' },
  { key: 'in-progress', label: 'In progress', dot: 'bg-blue-500' },
  { key: 'blocked', label: 'Blocked', dot: 'bg-amber-500' },
  { key: 'done', label: 'Done', dot: 'bg-emerald-500' },
]

function priorityTone(priority = 'normal') {
  if (priority === 'high') return 'bg-rose-50 text-rose-700 ring-rose-200'
  if (priority === 'low') return 'bg-slate-100 text-slate-600 ring-slate-200'
  return 'bg-blue-50 text-blue-700 ring-blue-200'
}

function TaskCard({ task }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${priorityTone(task.priority)}`}>
          {task.priority || 'normal'}
        </span>
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-slate-500">
        {task.description || 'No description yet.'}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{task.assignee || 'Unassigned'}</span>
        <span>#{task.id}</span>
      </div>
    </div>
  )
}

function Column({ label, dot, tasks }) {
  return (
    <div className="min-w-[280px] flex-1 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-3">
      <div className="mb-4 flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-8 text-center text-sm text-slate-400">
            No tasks yet
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}

export default function App(){
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchTasks() }, [])

  async function fetchTasks(){
    setLoading(true)
    try{
      const r = await axios.get('/tasks')
      setTasks(r.data.results)
    }catch(e){
      console.error(e)
    }finally{setLoading(false)}
  }

  async function createTask(e){
    e.preventDefault()
    if(!title) return
    try{
      await axios.post('/tasks', {title, description})
      setTitle('')
      setDescription('')
      fetchTasks()
    }catch(e){console.error(e)}
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white/90 px-6 py-8 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">AI</div>
            <div>
              <h2 className="text-lg font-semibold">AI Task Hub</h2>
              <p className="text-sm text-slate-500">Ops for your agents</p>
            </div>
          </div>

          <nav className="space-y-1.5 text-sm">
            <div className="rounded-2xl px-4 py-3 text-slate-500">Overview</div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white shadow-sm">Tasks</div>
            <div className="rounded-2xl px-4 py-3 text-slate-500">Agents</div>
            <div className="rounded-2xl px-4 py-3 text-slate-500">Runs</div>
          </nav>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-lg">
            <p className="text-sm font-medium">System status</p>
            <p className="mt-2 text-3xl font-semibold">Healthy</p>
            <p className="mt-2 text-sm text-slate-200">Task board ready for agent coordination.</p>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-blue-600">Workspace</p>
              <h1 className="text-2xl font-semibold tracking-tight">Task management</h1>
              <p className="mt-1 text-sm text-slate-500">Create, track, and organize work for your AI agents.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">Filter</button>
              <button className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm">New task</button>
            </div>
          </header>

          <section className="mb-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-lg font-semibold">Create task</h3>
                <p className="mt-1 text-sm text-slate-500">Add a task for an agent to pick up.</p>
              </div>

              <form onSubmit={createTask} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                    placeholder="e.g. Review application matches"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                    placeholder="Add context, acceptance criteria, or notes"
                    value={description}
                    onChange={e=>setDescription(e.target.value)}
                  />
                </div>
                <button className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  Create task
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <h3 className="text-lg font-semibold">Board</h3>
                  <p className="text-sm text-slate-500">{loading ? 'Loading tasks…' : `${tasks.length} tasks total`}</p>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {columns.map(column => (
                  <Column
                    key={column.key}
                    label={column.label}
                    dot={column.dot}
                    tasks={tasks.filter(task => task.status === column.key)}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
