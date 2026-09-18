export default function OverviewPage() {
  return (
    <>
      <section className="smp-page-hero">
        <span className="smp-page-hero__eyebrow">Good afternoon</span>
        <h2 className="smp-page-hero__title">Campus is calm. Systems are ready.</h2>
        <p className="smp-page-hero__lede">
          Schola gives your school a precise operating surface — people, classes,
          attendance, and finance in one quiet workspace.
        </p>
        <Button>Get Started</Button>
      </section>

      <section className="smp-page-panel" aria-labelledby="foundation-heading">
        <span className="smp-page-panel__accent">Foundation ready</span>
        <h3 id="foundation-heading" className="smp-page-panel__title">
          Navigation, state, and design tokens are in place.
        </h3>
        <p className="smp-page-panel__body">
          The shell uses a centralized design system — Apple blue on a cool
          light canvas, true black in dark mode — with Zustand for sidebar and
          page meta, and Lucide for a single icon language. Next modules can
          plug into this layout without reinventing structure.
        </p>
      </section>
    </>
  );
}
