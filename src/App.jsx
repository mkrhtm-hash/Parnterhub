import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { DataGate } from './components/ui/DataState';
import Home from './pages/Home';

const Services = lazy(() => import('./pages/Services'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const BrokerMatch = lazy(() => import('./pages/BrokerMatch'));
const BrokerPartners = lazy(() => import('./pages/BrokerPartners'));
const RegulationGuide = lazy(() => import('./pages/RegulationGuide'));
const About = lazy(() => import('./pages/About'));
const Book = lazy(() => import('./pages/Book'));
const Legal = lazy(() => import('./pages/Legal'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="broker-match" element={<DataGate><BrokerMatch /></DataGate>} />
        <Route path="partners" element={<DataGate><BrokerPartners /></DataGate>} />
        <Route path="regulation" element={<DataGate><RegulationGuide /></DataGate>} />
        <Route path="about" element={<DataGate><About /></DataGate>} />
        <Route path="book" element={<DataGate><Book /></DataGate>} />
        <Route path="privacy" element={<DataGate><Legal page="privacy" /></DataGate>} />
        <Route path="terms" element={<DataGate><Legal page="terms" /></DataGate>} />
        <Route path="risk-disclosure" element={<DataGate><Legal page="risk" /></DataGate>} />
        <Route path="cookies" element={<DataGate><Legal page="cookies" /></DataGate>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
