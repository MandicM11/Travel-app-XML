// pages/index.js
import Link from 'next/link';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the App</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/register">Register</Link>
                    </li>
                    <li>
                        <Link href="/login">Login</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;
