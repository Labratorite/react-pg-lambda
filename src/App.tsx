import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LoggerProvider } from "./utils/logger";
import { ProgressProvider, useProgress } from "./utils/Progress";
import PostCrud from "./post/PostCrud";
import PostAdd from "./post/PostAdd";
import "./styles.css";

const Routing = React.memo(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProgressProvider />}>
          <Route index element={<Navigate to="/posts" />} />
          <Route path="posts" element={<PostCrud />} />
          <Route path="posts/add" element={<PostAdd />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
});

export default function App() {
  console.log("App");
  return (
    <div className="App">
      <LoggerProvider>
        <Routing />
      </LoggerProvider>
    </div>
  );
}
