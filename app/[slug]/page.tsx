import { CLIENTS } from '@/lib/clients';
import { notFound } from 'next/navigation';
import PortalClient from './PortalClient';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function PortalPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { token } = await searchParams;

  const client = CLIENTS[slug];

  if (!client) notFound();

  if (token !== client.token) {
    return (
      <div className="min-h-screen bg-[#080e14] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-400 text-lg font-medium mb-2">Acceso denegado</h2>
          <p className="text-[#6b8099] text-sm">Token inválido. Contactá a tu asesor de Valy Agency.</p>
        </div>
      </div>
    );
  }

  return <PortalClient client={client} />;
}