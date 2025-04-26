import { useLoader } from '../context/LoaderContext';

export default function GlobalLoader() {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-70">
      <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
