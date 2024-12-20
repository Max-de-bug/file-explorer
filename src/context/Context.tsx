import { invoke } from "@tauri-apps/api/core";
import { createContext, useState, ReactNode, useEffect } from "react";

// Define the context's type
interface AppContextType {
  disks: string[];
  fetchDisks: () => void;
  downloads: string[];
  fetchDownloads: () => void;
}

export const AppContext = createContext<AppContextType>({
  disks: [],
  fetchDisks: () => {},
  downloads: [],
  fetchDownloads: () => {},
});

// Create a Provider component that will wrap around your app
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [disks, setDisks] = useState<string[]>([]);
  const [downloads, setDowloads] = useState<string[]>([]);
  async function fetchDisks() {
    try {
      const result = await invoke<string[]>("list_disks");
      setDisks(result || []);
    } catch (error) {
      console.error("Error fetching disks:", error);
    }
  }
  async function fetchDownloads() {
    try {
      const result = await invoke<string[]>("list_downloads");
      setDowloads(result || []);
    } catch (error) {
      console.error("Error fetching disks:", error);
    }
  }
  useEffect(() => {
    fetchDisks();
    fetchDownloads();
  }, []);

  return (
    <AppContext.Provider
      value={{ disks, fetchDisks, downloads, fetchDownloads }}
    >
      {children}
    </AppContext.Provider>
  );
};
