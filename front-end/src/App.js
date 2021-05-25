import React, { useState, useEffect } from 'react';
import './App.css';

const api = {
  getMessages: ()=> fetch('/messages')
    .then(response=> response.json()),

  postMessage: (message)=> fetch('/message', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  }).then(response=> response.json()),
};

function App() {
  const [messages, setMessages] = useState([]);

  const refresh = ()=> api
    .getMessages()
    .then(({ messages }) => setMessages(messages));
  
  useEffect(()=>{
    refresh();
  }, []);

  const [nextFrom, setNextFrom] = useState('');
  const [nextTo, setNextTo] = useState('');
  const [nextContent, setNextContent] = useState('');

  const send = ()=>{
    api.postMessage({
      from: nextFrom, to: nextTo, content: nextContent
    }).then(response => {
      refresh();
      setNextFrom('');
      setNextTo('');
      setNextContent('');
    });
  };
  
  return (
    <div className="App">
      <div className='messages'>
        {
          messages.map(msg=> (
            <div key={msg.id}>
              <span>{msg.from} to {msg.to}</span>
              <span>{msg.content}</span>
            </div>
          ))
        }
      </div>
      
      <div className='send-message'>
        <label>
          from
          <input
            value={nextFrom}
            onChange={e=> setNextFrom(e.target.value)}
          />
        </label>
        <label>
          to
          <input
            value={nextTo}
            onChange={e=> setNextTo(e.target.value)}
          />
        </label>
        <label>
          content
          <input
            value={nextContent}
            onChange={e=> setNextContent(e.target.value)}
          />
        </label>
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default App;
