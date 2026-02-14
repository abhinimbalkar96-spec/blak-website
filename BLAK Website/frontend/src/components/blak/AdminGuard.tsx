import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });

  const isLoading = actorFetching || isCheckingAdmin || loginStatus === 'logging-in';

  if (!identity) {
    return (
      <div className="min-h-screen bg-white py-24 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-6">Admin Access Required</h1>
          <p className="text-gray-600 mb-8">
            Please log in with your admin credentials to access this page.
          </p>
          <button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="bg-black text-white px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white py-24 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-6">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You do not have permission to access this page. Admin privileges are required.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
