import '../styles/globals.css'; // Uključite globalne stilove
import 'bootstrap/dist/css/bootstrap.min.css'; // Uključivanje Bootstrap CSS-a
import { SessionProvider } from 'next-auth/react';
import NavigationBar from '../components/Navbar'; // Uvozite navigacioni bar
import 'leaflet/dist/leaflet.css';


function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <NavigationBar /> {/* Dodajte navigacioni bar ovde */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
