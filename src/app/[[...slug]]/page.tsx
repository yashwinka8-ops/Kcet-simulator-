import ClientPage from './ClientPage';

export function generateStaticParams() {
    return [
        { slug: [''] }, // Try this first or maybe omit it
        { slug: ['login'] },
        { slug: ['dashboard'] },
        { slug: ['declaration'] },
        { slug: ['profile'] },
        { slug: ['entry'] },
        { slug: ['courses'] },
        { slug: ['colleges'] },
        { slug: ['submitted'] },
        { slug: ['allotted'] },
        { slug: ['waiting'] }
    ];
}

export default function Page() {
    return <ClientPage />;
}
