import IncidentList from "@/components/IncidentList";
import QuickChecks from "@/components/QuickChecks";
import DeployNotes from "@/components/DeployNotes";
import TeamSnapshot from "@/components/TeamSnapshot";
import { deployNotes } from "@/lib/data";

export default async function HomePage() {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <IncidentList />
        <div className="space-y-6">
          <TeamSnapshot />
          <QuickChecks />
        </div>
      </section>
      <DeployNotes notes={deployNotes} />
    </>
  );
}