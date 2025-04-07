// src/context/ApiContext.jsx
import { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const apiBase = "https://c1fd-2405-201-3c-20a9-9d73-d42e-c812-890f.ngrok-free.app";

  return (
    <ApiContext.Provider value={{ apiBase }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
