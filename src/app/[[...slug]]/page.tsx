import ClientPage from './ClientPage';

export const dynamicParams = false;

export function generateStaticParams() {
    return [
        { slug: undefined as any },   // root path "/"
        { slug: ['login'] },
        { slug: ['dashboard'] },
        { slug: ['declaration'] },
        { slug: ['profile'] },
        { slug: ['entry'] },
        { slug: ['courses'] },
        { slug: ['colleges'] },
        { slug: ['allotment_auth'] },
        { slug: ['allotment_result'] },
        { slug: ['choice_entry'] },
        { slug: ['payment'] },
        { slug: ['payment_receipt'] },
        { slug: ['payment_success'] },
        { slug: ['privacy'] },
    ];
}

export default function Page() {
    return <ClientPage />;
}
