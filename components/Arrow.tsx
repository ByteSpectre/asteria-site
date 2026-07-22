export default function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 12h17M14 5.5 20.5 12 14 18.5" />
    </svg>
  );
}
