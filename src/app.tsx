import { BrowserRouter, Route, Routes } from 'react-router';
import LandingPage from './pages/landing/landing.page';
import HelloPage from './pages/hello/hello.page';
import FlowPage from './pages/flow/flow.page';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hello" element={<HelloPage />} />
        <Route path="/flow" element={<FlowPage />} />
      </Routes>
    </BrowserRouter>
  );
}
