import "./App.css";
import HomePage from "./HomePage";
import { Route, Routes } from "react-router-dom";
import TestPage from "./TestPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
