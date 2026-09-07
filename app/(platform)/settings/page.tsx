import { AppearanceSettings } from "@/components/layout/AppearanceSettings";

export default function SettingsPage() {
  return (
    <>
      <section className="smp-page-hero">
        <span className="smp-page-hero__eyebrow">Workspace</span>
        <h2 className="smp-page-hero__title">Settings</h2>
        <p className="smp-page-hero__lede">
          Campus configuration, roles, and platform preferences.
        </p>
      </section>

      <AppearanceSettings />
    </>
  );
}
