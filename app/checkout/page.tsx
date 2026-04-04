import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';
import { authOptions } from '@/lib/auth';

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/checkout');
  }

  return <CheckoutPageClient />;
}
