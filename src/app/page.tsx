import Link from "next/link";
import { NeuroGitIcon } from "@/components/neurogit-icon";
import { WhyDemoCard } from "@/components/why-demo-card";
import { GitCommitHorizontal, Presentation, FileStack, Check, X } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Connect Repo",
    body: "Link a GitHub repository. NeuroGit indexes every file, commit, and diff summary via AI.",
    icon: GitCommitHorizontal,
  },
  {
    n: "02",
    title: "Upload Meetings",
    body: "Drop in your team's meeting recordings. NeuroGit transcribes and chapterizes the discussion.",
    icon: Presentation,
  },
  {
    n: "03",
    title: "Browse Decision Records",
    body: "NeuroGit automatically links commits to the discussions that likely motivated them, and generates a Decision Record for each.",
    icon: FileStack,
  },
];

const comparison = [
  { name: "GitHub Copilot", what: true, why: false, evidence: false },
  { name: "Cursor", what: true, why: false, evidence: false },
  { name: "CodeRabbit", what: true, why: false, evidence: false },
  { name: "NeuroGit", what: true, why: true, evidence: true },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-archaeology-bg text-archaeology-text">
      <header className="sticky top-0 z-10 border-b border-archaeology-borderSubtle bg-archaeology-bg/90 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <NeuroGitIcon size={44} />
            <span className="font-display font-extrabold text-2xl tracking-wide text-white">NeuroGit</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/sign-in" className="text-sm text-archaeology-textSecondary hover:text-archaeology-text">Sign In</Link>
            <Link href="/sign-up" className="text-sm bg-archaeology-orange hover:bg-archaeology-orangeLight text-white px-4 py-2 rounded-md">
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block font-mono text-xs tracking-widest text-archaeology-orange border border-archaeology-orange rounded-full px-3 py-1 mb-6">
            CODE ARCHAEOLOGY
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            RECONSTRUCT WHY<br />YOUR CODE EXISTS
          </h1>
          <p className="text-archaeology-textSecondary text-lg mb-8">
            Every AI tool today can tell you what your code does. NeuroGit is the only one that reconstructs
            <em> why</em> — by cross-referencing your commit history with your team&apos;s actual meeting discussions.
          </p>
          <div className="flex items-center gap-4 mb-10">
            <Link href="/sign-up" className="bg-archaeology-orange hover:bg-archaeology-orangeLight text-white px-6 py-3 rounded-md font-medium">
              Get Started Free
            </Link>
          </div>
          <div className="flex gap-8">
            <div>
              <div className="font-display text-2xl font-bold">2.4M+</div>
              <div className="text-xs text-archaeology-textDim">Commits analyzed</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold">18k+</div>
              <div className="text-xs text-archaeology-textDim">Decision records</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold">340+</div>
              <div className="text-xs text-archaeology-textDim">Engineering teams</div>
            </div>
          </div>
        </div>

        <WhyDemoCard />
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-archaeology-borderSubtle">
        <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(step => (
            <div key={step.n} className="bg-archaeology-card border border-archaeology-border rounded-md p-6">
              <div className="font-mono text-archaeology-orange text-sm mb-3">{step.n}</div>
              <step.icon className="size-6 text-archaeology-orange mb-3" />
              <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-archaeology-textSecondary">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-archaeology-borderSubtle">
        <h2 className="font-display text-3xl font-bold text-center mb-12">Why NeuroGit</h2>
        <div className="bg-archaeology-card border border-archaeology-border rounded-md overflow-hidden max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-archaeology-borderSubtle font-mono text-[10px] tracking-widest text-archaeology-textDim">
            <span></span><span>WHAT</span><span>WHY</span><span>EVIDENCE</span>
          </div>
          {comparison.map(row => (
            <div key={row.name} className={`grid grid-cols-4 gap-2 px-4 py-3 border-b border-archaeology-borderSubtle last:border-0 items-center ${row.name === 'NeuroGit' ? 'bg-archaeology-orangeDim' : ''}`}>
              <span className={row.name === 'NeuroGit' ? 'text-archaeology-orange font-medium' : 'text-archaeology-text'}>{row.name}</span>
              {[row.what, row.why, row.evidence].map((v, i) => (
                <span key={i}>{v ? <Check className="size-4 text-archaeology-green" /> : <X className="size-4 text-archaeology-textDim" />}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center border-t border-archaeology-borderSubtle">
        <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-6">Stop losing institutional knowledge.</h2>
        <Link href="/sign-up" className="inline-block bg-archaeology-orange hover:bg-archaeology-orangeLight text-white px-8 py-3 rounded-md font-medium">
          Get Started Free
        </Link>
      </section>

      <footer className="border-t border-archaeology-borderSubtle py-8 text-center text-xs text-archaeology-textDim">
        © {new Date().getFullYear()} NeuroGit. Code Archaeology for engineering teams.
      </footer>
    </div>
  );
}
