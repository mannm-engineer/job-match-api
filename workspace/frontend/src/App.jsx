import React, {useState, useEffect} from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API || '/api'

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
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">AI Task Hub</h2>
        <nav className="space-y-2 text-sm text-gray-600">
          <div className="px-3 py-2 rounded hover:bg-gray-50">Dashboard</div>
          <div className="px-3 py-2 rounded bg-gray-100 font-medium">Tasks</div>
          <div className="px-3 py-2 rounded hover:bg-gray-50">Agents</div>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-sm text-gray-500">Create and manage tasks for your AI agents</p>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Create task</h3>
              <form onSubmit={createTask} className="space-y-3">
                <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
                <textarea className="w-full p-2 border rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
              </form>
            </div>
          </div>

          <div className="col-span-3">
            <div className="flex gap-4">
              <div className="flex-1 bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">To do</h4>
                <div className="space-y-3">
                  {tasks.filter(t=>t.status==='todo').map(t=> (
                    <div key={t.id} className="p-3 border rounded hover:shadow-sm">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">In progress</h4>
                <div className="space-y-3">
                  {tasks.filter(t=>t.status==='in-progress').map(t=> (
                    <div key={t.id} className="p-3 border rounded hover:shadow-sm">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Blocked</h4>
                <div className="space-y-3">
                  {tasks.filter(t=>t.status==='blocked').map(t=> (
                    <div key={t.id} className="p-3 border rounded hover:shadow-sm">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Done</h4>
                <div className="space-y-3">
                  {tasks.filter(t=>t.status==='done').map(t=> (
                    <div key={t.id} className="p-3 border rounded bg-gray-50">
                      <div className="font-medium line-through">{t.title}</div>
                      <div className="text-sm text-gray-500">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
