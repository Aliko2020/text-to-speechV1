import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import Dashboard from "./components/dashboard/MainDashboard";

function App() {
  toast.success("Welcome to the Dashboard!");

  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
