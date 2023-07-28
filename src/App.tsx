import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LoggerProvider } from "./utils/logger";
import PostCrud from "./post/PostCrud";
import "./styles.css";

const PlaygroundBase = React.memo(() => {
  //const logger = useLogger();
  //logger.write({ component: "PlaygroundBase", message: "RENDER" });
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PostCrud />} />
        <Route path="/post" element={<PostCrud />}>
          <Route path=":postId" element={<PostCrud />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
});

export default function App() {
  // logger.info("App", "RE-RENDER");
  console.log("App");
  return (
    <div className="App">
      <LoggerProvider>
        <PlaygroundBase />
      </LoggerProvider>
    </div>
  );
}
