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
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h2>Tasks</h2>
      <form onSubmit={createTask} style={{marginBottom:20}}>
        <div>
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:400,padding:8}} />
        </div>
        <div style={{marginTop:8}}>
          <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{width:400,height:80}} />
        </div>
        <div style={{marginTop:8}}>
          <button type="submit">Create Task</button>
        </div>
      </form>

      {loading ? <div>Loading...</div> : (
        <table border="1" cellPadding="8">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Created At</th></tr>
          </thead>
          <tbody>
            {tasks.map(t=> (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.status}</td>
                <td>{t.priority}</td>
                <td>{t.assignee || '-'}</td>
                <td>{t.created_at || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
