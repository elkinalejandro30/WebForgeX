export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  // En modo prototipo sin login, siempre permitimos el acceso
  return children;
}
