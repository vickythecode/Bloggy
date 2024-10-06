import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {Navigate} from "react-router-dom";
import Editor from "./Editor";

export default function CreatePost() {
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
   const response = await fetch('https://bloggy-97fr.onrender.com/post', {
    method: 'POST',
    body: data,
    credentials: 'include',
    headers: {
      'Access-Control-Allow-Origin': 'https://bloggy-1-frontend.onrender.com', // Explicitly allow your frontend
      'Access-Control-Allow-Credentials': 'true', // Allow credentials if necessary
      },
    });

    if (response.ok) {
      setRedirect(true);
    }else{
      alert("Something went wrong")
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="createNewPost">
       <form onSubmit={createNewPost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{marginTop:'5px'}}>Create post</button>
    </form>
    </div>
  );
} 
