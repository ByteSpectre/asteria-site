export default function AdminLoading() {
  return (
    <div className="animate-pulse p-8 sm:p-10">
      <div className="h-3 w-28 bg-ink/10" />
      <div className="mt-5 h-8 w-56 max-w-full bg-ink/12" />
      <div className="mt-8 space-y-3">
        <div className="h-14 bg-ink/8" />
        <div className="h-14 bg-ink/8" />
        <div className="h-14 bg-ink/8" />
        <div className="h-14 bg-ink/8" />
      </div>
    </div>
  );
}
