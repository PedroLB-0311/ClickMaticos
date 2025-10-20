import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [positions, setPositions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const mousePointerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isRecording) {
        setPositions((prev) => [...prev, { x: event.clientX, y: event.clientY }]);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isRecording]);

  const startRecording = () => {
    setPositions([]);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    saveToFile();
  };

  const saveToFile = () => {
    const textData = positions.map((pos) => `${pos.x},${pos.y}`).join("\n");
    const blob = new Blob([textData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mouse_positions.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFileContent(e.target.result);
        setIsFileSelected(true);
      };
      reader.readAsText(file);
    }
  };

  const handleFileInputChange = (event) => {
    handleFileSelect(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFileSelect(event.dataTransfer.files[0]);
    }
  };

  const executeFile = () => {
    const lines = selectedFileContent.split("\n");
    let index = 0;
    const moveMouse = () => {
      if (index < lines.length) {
        const [x, y] = lines[index].split(",").map(Number);
        if (mousePointerRef.current) {
          mousePointerRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
        index++;
        setTimeout(moveMouse, 100);
      }
    };
    moveMouse();
  };

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0b0016] text-white font-sans"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* --- Fundo animado --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-purple-800/40 animate-gradient"></div>

      {/* --- Partículas flutuantes --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          ></div>
        ))}
      </div>

      {/* --- Painel principal --- */}
      <div
        className={`relative z-10 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(180,90,255,0.4)] flex flex-col items-center w-[90%] max-w-md transition-transform duration-500 ${
          isDragging ? "scale-105 border-purple-400/60 shadow-purple-500/50" : "hover:scale-[1.02]"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent tracking-wide drop-shadow-[0_0_10px_rgba(200,120,255,0.5)]">
        ClickMaticós
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`px-6 py-2 rounded-xl font-semibold tracking-wide transition-all duration-300 ${
              isRecording
                ? "bg-purple-400/30 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:brightness-125 active:scale-95 shadow-[0_0_15px_rgba(160,100,255,0.4)]"
            }`}
          >
            Iniciar Gravação
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`px-6 py-2 rounded-xl font-semibold tracking-wide transition-all duration-300 ${
              !isRecording
                ? "bg-pink-400/30 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-600 to-purple-700 hover:brightness-125 active:scale-95 shadow-[0_0_15px_rgba(255,100,200,0.4)]"
            }`}
          >
            Parar Gravação
          </button>
        </div>

        {/* --- Área de upload futurista --- */}
        <div
          className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-6 text-center transition-all duration-500 ${
            isDragging
              ? "border-purple-400/70 bg-purple-800/20 shadow-[0_0_30px_rgba(180,90,255,0.4)]"
              : "border-white/30 hover:border-purple-400/50 hover:bg-white/5"
          }`}
        >
          <input
            id="fileInput"
            type="file"
            accept=".txt"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center justify-center gap-3 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-[0_0_25px_rgba(160,100,255,0.5)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v9m0-9l-3 3m3-3l3 3M12 3v9"
                />
              </svg>
            </div>
            <p className="text-sm text-purple-200">
              Clique ou arraste um arquivo <span className="font-bold">.txt</span> aqui
            </p>
          </label>
        </div>

        <button
          onClick={executeFile}
          disabled={!isFileSelected}
          className={`mt-6 px-6 py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 ${
            !isFileSelected
              ? "bg-purple-400/30 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-700 hover:brightness-125 active:scale-95 shadow-[0_0_15px_rgba(120,90,255,0.4)]"
          }`}
        >
          Executar Arquivo
        </button>

        {selectedFileContent && (
          <div className="w-full mt-6 bg-white/10 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-purple-100 border border-white/10 shadow-inner shadow-purple-900/20">
            <h3 className="font-semibold mb-2 text-purple-200">
              Conteúdo do Arquivo:
            </h3>
            <pre className="whitespace-pre-wrap">{selectedFileContent}</pre>
          </div>
        )}
      </div>

      {/* --- Ponteiro visual --- */}
      <div
        ref={mousePointerRef}
        className="absolute top-0 left-0 w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-400 shadow-[0_0_15px_rgba(200,100,255,0.8)] transition-transform duration-100 ease-linear pointer-events-none z-50"
      ></div>

      {/* --- Animações extras --- */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 12s ease infinite;
        }
      `}</style>
    </div>
  );
}
