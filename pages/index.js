import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [positions, setPositions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const mousePointerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isRecording) {
        setPositions((prev) => [...prev, { x: event.clientX, y: event.clientY }]);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
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
    const textData = positions
      .map(pos => `${pos.x},${pos.y}`)
      .join('\n');

    const blob = new Blob([textData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mouse_positions.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFileContent(e.target.result);
        setIsFileSelected(true);
      };
      reader.readAsText(file);
    }
  };

  const executeFile = () => {
    const lines = selectedFileContent.split('\n');
    let index = 0;

    const moveMouse = () => {
      if (index < lines.length) {
        const [x, y] = lines[index].split(',').map(Number);
        
        // Mover o ponteiro do mouse visual
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
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <button onClick={startRecording} disabled={isRecording}>
        Iniciar Gravação
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Parar Gravação
      </button>
      <input type="file" accept=".txt" onChange={handleFileSelect} />
      <button onClick={executeFile} disabled={!isFileSelected}>
        Executar Arquivo
      </button>
      {selectedFileContent && (
        <div>
          <h3>Conteúdo do Arquivo Selecionado:</h3>
          <pre>{selectedFileContent}</pre>
        </div>
      )}
    </div>
  );
}