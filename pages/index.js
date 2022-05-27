import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useFetch from 'hooks/useFetch';

export default function DefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  const { data } = useFetch('/api/account/admin');
  console.log(data);

  return null;
}
