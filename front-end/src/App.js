import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const placeholderDog = 'https://static.thenounproject.com/png/61386-200.png';

const api = {
  getMessages: (username)=> fetch('/messages?username='+username)
    .then(response=> response.json()),

  postMessage: (message)=> fetch('/message', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  }).then(response=> response.json()),
};

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('nik');
  const [nextFrom, setNextFrom] = useState('');
  const [nextTo, setNextTo] = useState('');
  const [nextContent, setNextContent] = useState('');

  const [selectedConvo, setSelectedConvo] = useState('');

  const conversations = useMemo(()=> [
    ...(new Set(
      messages.filter(({ from, to })=> (
        from === username || to === username
      )).map(({ from, to }) => (
        from === username ? to : from
      ))
    ))
  ], [messages, username]);

  const refresh = ()=> api
    .getMessages(username)
    .then(({ messages }) => setMessages(messages));
  
  useEffect(()=>{
    refresh();
  }, []);

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
      <div className='search'>
        <ul>
          {
            conversations.map(other=> (
              <li key={other}
                  className={other === selectedConvo ? 'selected' : ''}
                  onClick={()=> (
                    other !== selectedConvo ?
                    setSelectedConvo(other):
                    setSelectedConvo('')
                  )}>
                <span>{other}</span>
                <img src={placeholderDog} />
              </li>
            ))
          }
        </ul>
      </div>

      <div className='messages'>
        {
          messages
            .filter(msg => !selectedConvo ||
                         [msg.to, msg.from].includes(selectedConvo) )
            .map(msg=> (
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
