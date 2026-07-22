export default function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M6 0 L7.1 4.2 L12 6 L7.1 7.8 L6 12 L4.9 7.8 L0 6 L4.9 4.2 Z" />
    </svg>
  );
}
