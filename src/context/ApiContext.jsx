// src/context/ApiContext.jsx
import { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiBase = "https://2b19-2405-201-3c-20a9-c5e7-9f08-d918-9800.ngrok-free.app";

  return (
    <ApiContext.Provider value={{ apiBase }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
