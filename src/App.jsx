import HandleRedirect from "./containers/HandleRedirect";
import HomeContainer from "./containers/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomeContainer/>}/>
        <Route exact path="/:shortId" element={<HandleRedirect/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
