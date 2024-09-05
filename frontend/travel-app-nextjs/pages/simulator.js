import dynamic from 'next/dynamic';

// Dinamički uvoz Simulator komponente sa isključenim SSR (server-side rendering)
const Simulator = dynamic(() => import('../components/SimulatorComponent'), {
  ssr: false, 
});

export default Simulator;
