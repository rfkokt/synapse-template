import { Button } from '@synapse/ui-kit';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold text-neutral-200">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-900">Halaman Tidak Ditemukan</h2>
        <p className="text-neutral-500 max-w-md">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Button variant="primary" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
