import ClientPage from './ClientPage';

export function generateStaticParams() {
    const routes = [
        'login', 'landing', 'dashboard', 'declaration', 'profile', 'entry', 
        'courses', 'colleges', 'allotment_auth', 'allotment_result', 'choice_entry', 'privacy', 'privacy_policy', 'lab'
    ];
    
    return routes.map((route) => ({
        slug: [route],
    }));
}

export default function Page() {
    return <ClientPage />;
}
