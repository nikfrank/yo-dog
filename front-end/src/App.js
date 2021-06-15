import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import SendMessage from './SendMessage';

const placeholderDog = 'https://static.thenounproject.com/png/61386-200.png';

const api = {
  getMessages: (username, other='')=>
    fetch('/messages?username='+username+'&other='+other)
      .then(response=> response.json()),

  postMessage: (message)=> fetch('/message', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  }).then(response=> response.json()),

  getConversations: (username)=> fetch('/conversations?username='+username)
    .then(response=> response.json()),
};

function App() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [username, setUsername] = useState('nik');
  const [nextFrom, setNextFrom] = useState('');
  const [nextTo, setNextTo] = useState('');

  const [selectedConvo, setSelectedConvo] = useState('');


  const refreshConversations = ()=> api
    .getConversations(username)
    .then(({ conversations })=> setConversations(conversations));

  const refreshMessages = ()=> api
    .getMessages(username, selectedConvo)
    .then(({ messages }) => setMessages(messages));
  

  useEffect(()=> {
    if(!selectedConvo){
      refreshConversations();
      setMessages([]);
      
    } else {
      refreshMessages(username, selectedConvo);
    }
    
  }, [username, selectedConvo]);
  
  const send = (content)=>
    api.postMessage({
      from: username, to: selectedConvo, content
    }).then(response => {
      refreshMessages(username, selectedConvo);
      setNextFrom('');
      setNextTo('');
    });
  
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
        <div className='message-container'>
          {selectedConvo ?
           messages
             .filter(msg => !selectedConvo ||
                          [msg.to, msg.from].includes(selectedConvo) )
             .map(msg=> (
               <div key={msg.id}
                    className={'message '+ (msg.from === username ? 'me':'other')}>
                 <span>{msg.content}</span>
               </div>
             )) : null
          }
        </div>
      </div>

      <SendMessage onSend={send} />
    </div>
  );
}

export default App;
