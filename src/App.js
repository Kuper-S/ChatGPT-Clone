import { useState ,useEffect} from 'react';
import './App.css';
import "./normal.css"
// import ChatMessage from "./components/ChatMessage"
import Icon from "./assets/icon.png"
import Avatar from "./assets/xxsAva.png"
// use effect run once when the app component loads

function App() {
  useEffect(() => {
    getEngiens()
        
     }, []); 
  const [models, setModels] = useState([]);
  const [currentModel,setCurrentModel] = useState("ada");
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "Hello, I am an AI , How can I help you?"
  },
  {
    user: "me",
    message: "I want to use ChatGPT today"
  }
]);

  const getEngiens = async () => {
    const response = await fetch("http://localhost:3001/models");
    const data = await response.json();
    setModels(data.models);
  }

// make the clear button
function clearChat() {
  setChatLog([]);
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    let chatLogNew = [...chatLog, {user: "me", message: `${input}`}];
     
     setInput("");
     setChatLog(chatLogNew);
    const messages = chatLogNew.map((message) => message.message).join("");

    const response = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify({
        message: messages,
        currentModel
      }),
    });
    
    const data = await response.json();
     setChatLog([...chatLogNew, {user: "gpt", message: `${data.message}`}]);
    console.log(data.message);
  }
  return (
    <div className="App">
    <aside className="sidemenu">
      <div className="side-menu-button" onClick={clearChat}>
      <span className="side-menu-icon">+</span>
        New Chat
      </div>
      <div className="modles">
        <select onChange={(e) => setCurrentModel(e.target.value)}>
          {models.map((model, index) => (
            <option key={model.id} value={model.id}>{model.id}</option>
          ))}
          
        </select>
      </div>
    </aside>
    <section className="chatbox">
    <div className ="chat-log">
      {chatLog.map((message, index) => (
        <ChatMessage key={index} message={message}/>
      ))}
    </div>
      <div className="chat-input-holder">
      <form onSubmit={handleSubmit}>

      
          <input 
          className="chat-input-textarea" 
          placeholder ="Let`s Start Chatting"
          rows="1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
           >

          </input>
        </form>
        </div>
    </section>
    </div>
  );
}

export default App;

function ChatMessage({message}) {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
        <div className="chat-message-center">
          <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
          {message.user === "gpt" && <img src={Icon} alt="user-avatar"/>}
          </div>
          <div className="message">
            {message.message}
          </div>
        </div>
      </div>
  )
}