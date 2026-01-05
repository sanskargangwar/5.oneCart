import React, { useContext, useEffect, useRef, useState } from "react";
import ai from "../assets/ai.png";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import open from "../assets/open.mp3";

function Ai() {
  const { showSearch, setShowSearch } = useContext(shopDataContext);
  const navigate = useNavigate();

  const [activeAi, setActiveAi] = useState(false);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  const openingSound = new Audio(open);

  const speak = (message) => {
    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
        .toLowerCase()
        .trim();

      if (!transcript) {
        recognition.stop();
        return;
      }

      console.log("Heard:", transcript);

      if (transcript.includes("search") && transcript.includes("open")) {
        speak("Opening search");
        setShowSearch(true);
        navigate("/collection");
      } 
      else if (transcript.includes("search") && transcript.includes("close")) {
        speak("Closing search");
        setShowSearch(false);
      } 
      else if (
        transcript.includes("collection") ||
        transcript.includes("product")
      ) {
        speak("Opening collection page");
        navigate("/collection");
      } 
      else if (transcript.includes("about")) {
        speak("Opening about page");
        navigate("/about");
        setShowSearch(false);
      } 
      else if (transcript.includes("home")) {
        speak("Opening home page");
        navigate("/");
        setShowSearch(false);
      } 
      else if (
        transcript.includes("cart") ||
        transcript.includes("cut") ||
        transcript.includes("kaat")
      ) {
        speak("Opening your cart");
        navigate("/cart");
        setShowSearch(false);
      } 
      else if (transcript.includes("contact")) {
        speak("Opening contact page");
        navigate("/contact");
        setShowSearch(false);
      } 
      else if (transcript.includes("order")) {
        speak("Opening your orders page");
        navigate("/order");
        setShowSearch(false);
      } 
      else {
        speak("Sorry, I did not understand");
      }

      recognition.stop(); // 🔥 MOST IMPORTANT
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setActiveAi(false);
    };

    recognition.onerror = () => {
      isListeningRef.current = false;
      setActiveAi(false);
    };

    recognitionRef.current = recognition;
  }, [navigate, setShowSearch]);

  const startListening = () => {
    if (isListeningRef.current) return;

    isListeningRef.current = true;
    setActiveAi(true);
    openingSound.play();
    recognitionRef.current.start();
  };

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"
      onClick={startListening}
    >
      <img
        src={ai}
        alt="AI"
        className={`w-[100px] cursor-pointer transition-transform ${
          activeAi
            ? "translate-x-[10%] translate-y-[-10%] scale-125"
            : "scale-100"
        }`}
        style={{
          filter: activeAi
            ? "drop-shadow(0px 0px 30px #00d2fc)"
            : "drop-shadow(0px 0px 20px black)",
        }}
      />
    </div>
  );
}

export default Ai;
