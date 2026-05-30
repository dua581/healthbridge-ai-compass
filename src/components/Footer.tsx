export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-6 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        <p>Data inspired by WHO Global Health Statistics &amp; Kaggle Health Datasets</p>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
            SDG 3 · Good Health
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-secondary-foreground">
            Vision 2030 | Vision 2035
          </span>
        </div>
      </div>
    </footer>
  );
}