// App.js (no cliente)
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    
    axios.get('http://localhost:4000/api/ping')
      .then(response => {
        setServerStatus(response.data.message);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {serverStatus ? (
        <p>O servidor está funcionando: {serverStatus}</p>
      ) : (
        <p>Aguardando resposta do servidor...</p>
      )}
    </div>
  );
}

export default App;