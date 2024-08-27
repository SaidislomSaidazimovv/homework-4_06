import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ApiList from "./pages/ApiList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ApiList />} />
    </Routes>
  );
};

export default App;
