import React, { useState, useEffect, useMemo } from 'react';

const SendMessage = ({ onSend=()=>0 })=>{
  const [nextContent, setNextContent] = useState('');
  const [waiting, setWaiting] = useState(false);
  
  return (
    <div className='send-message'>
      <textarea
        disabled={waiting}
        value={nextContent}
        onChange={e=> setNextContent(e.target.value)}
      />
      <div className='button-container'>
        <button
          disabled={waiting}
          onClick={()=> {
            setWaiting(true);
            onSend(nextContent).then(()=> {
              setWaiting(false);
              setNextContent('');
            })
          }}>
          Send
        </button>
      </div>
    </div>

  );
};

export default SendMessage;
