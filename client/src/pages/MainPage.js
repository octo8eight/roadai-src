import "./styles/MainPage.css";
import { React, useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainPage() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState(null);

  // Sending data to server
  const callBackAPI = async () => {
    toast.info("Generating roadmap.", { theme: "dark" });
    const response = await fetch("http://localhost:3001/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ openai_key: openAIKey, prompt: prompt }),
    });
    const body = await response.json();

    // Error handling
    if (response.status !== 200) {
      toast.error(`${body.msg}`, { theme: "dark" });
    } else if (response.status === 200) {
      setAnswer(`${body.id}`);
    }
  };

  useEffect(() => {}, []);

  // Button handle
  const submitHandle = async (e) => {
    e.preventDefault();
    console.log(openAIKey, prompt);
    await callBackAPI();
  };

  return (
    <div className="MainPage">
      <div className="mainContainer">
        <div className="mainText">
          <h1>Road.AI</h1>
        </div>
        <div className="openaikey">
          <input
            className="openaikey_input"
            type="text"
            placeholder="OpenAI API Key"
            onChange={(e) => setOpenAIKey(e.target.value)}
          />
        </div>
        <div className="prompt">
          <input
            className="prompt_input"
            type="text"
            placeholder="Prompt"
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div className="submitButton">
          <button className="submitButton_button" onClick={submitHandle}>
            Submit
          </button>
        </div>
        {answer ? (
          <a href={`https://roadai.vercel.app/map/${answer}`}>Roadmap</a>
        ) : null}
      </div>
      <ToastContainer />
    </div>
  );
}

export default MainPage;
