import { Link } from 'react-router-dom';
import { PageTemplate } from '../components/PageTemplate';
export function NotFoundPage() { return <PageTemplate title="Page not found"><p>The requested page is unavailable.</p><Link to="/">Return home</Link></PageTemplate>; }
