import React, {useState, useEffect} from 'react'
import axios from 'axios'

const API = process.env.REACT_APP_API || '/api'

const containerStyle = {
  fontFamily: 'Inter, Arial, sans-serif',
  padding: 24,
  maxWidth: 1000,
  margin: '0 auto'
}
const card = { background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', padding:16, borderRadius:8 }
const input = { width: '100%', padding:10, borderRadius:6, border:'1px solid #e5e7eb' }
const button = { background:'#2563eb', color:'#fff', padding:'10px 14px', border:'none', borderRadius:6, cursor:'pointer' }

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
    <div style={containerStyle}>
      <h1 style={{marginBottom:8}}>Task Manager</h1>
      <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:20}}>
        <div style={card}>
          <h3 style={{marginTop:0}}>Create Task</h3>
          <form onSubmit={createTask}>
            <div style={{marginBottom:10}}>
              <input style={input} placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div style={{marginBottom:10}}>
              <textarea style={{...input, height:100}} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <div>
              <button style={button} type="submit">Create task</button>
            </div>
          </form>
        </div>

        <div style={card}>
          <h3 style={{marginTop:0}}>Tasks</h3>
          {loading ? <div>Loading...</div> : (
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f8fafc', textAlign:'left'}}>
                    <th style={{padding:10}}>ID</th>
                    <th style={{padding:10}}>Title</th>
                    <th style={{padding:10}}>Status</th>
                    <th style={{padding:10}}>Priority</th>
                    <th style={{padding:10}}>Assignee</th>
                    <th style={{padding:10}}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t=> (
                    <tr key={t.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                      <td style={{padding:10}}>{t.id}</td>
                      <td style={{padding:10}}>{t.title}</td>
                      <td style={{padding:10}}>{t.status}</td>
                      <td style={{padding:10}}>{t.priority}</td>
                      <td style={{padding:10}}>{t.assignee || '-'}</td>
                      <td style={{padding:10}}>{t.created_at || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
