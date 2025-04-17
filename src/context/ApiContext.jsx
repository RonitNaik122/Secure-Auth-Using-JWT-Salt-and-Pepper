// src/context/ApiContext.jsx
import { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiBase = "https://3e5f-2409-4080-db1-89e1-8090-b5cc-f200-4376.ngrok-free.app";

  return (
    <ApiContext.Provider value={{ apiBase }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
