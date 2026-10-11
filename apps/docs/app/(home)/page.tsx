import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col justify-center px-6">
      <p className="mb-3 text-sm font-medium text-fd-muted-foreground">
        React Native · Expo · PDF
      </p>
      <h1 className="mb-4 text-4xl font-semibold tracking-tight">
        Build printable documents from reusable React components.
      </h1>
      <p className="mb-8 text-lg text-fd-muted-foreground">
        Source-owned PDF primitives for invoices, reports, and other documents in
        React Native apps.
      </p>
      <Link
        href="/docs"
        className="w-fit rounded-lg bg-fd-primary px-4 py-2.5 font-medium text-fd-primary-foreground"
      >
        Read the docs
      </Link>
    </div>
  );
}
