import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import styles from "./App.module.scss";
import DiskList from "./components/Dashboard/DiskList";
import Navbar from "./components/NavBar/NavBar";
import { Sidebar } from "./components/SideBar/SideBar";
import { AppProvider } from "./context/Context";
import Dowloads from "./components/Dashboard/Dowloads";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navbar />
        <div className={styles.flexContainer}>
          <Sidebar />
          <div className={styles.dashboard}>
            <Routes>
              <Route path="/" element={<DiskList />} />
              <Route path="/Dashboard/Downloads" element={<Dowloads />} />{" "}
              {/* Updated path */}
            </Routes>
          </div>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
