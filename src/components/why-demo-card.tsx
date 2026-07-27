export function WhyDemoCard({className = ''}: {className?: string}) {
  return (
    <div className={`bg-archaeology-card border border-archaeology-border rounded-lg p-5 ${className}`}>
      <div className="flex gap-1.5 mb-4">
        <div className="size-2.5 rounded-full bg-archaeology-red" />
        <div className="size-2.5 rounded-full bg-archaeology-yellow" />
        <div className="size-2.5 rounded-full bg-archaeology-green" />
      </div>
      <p className="font-mono text-xs text-archaeology-orange mb-2">WHY does auth use JWT instead of sessions?</p>
      <div className="bg-archaeology-surface border border-archaeology-border rounded p-3 mb-3">
        <p className="text-xs text-archaeology-textDim font-mono mb-1">[commit a3f9c2e]</p>
        <p className="text-sm text-archaeology-textSecondary">Switched to JWT-based auth to support the new mobile client...</p>
      </div>
      <div className="bg-archaeology-surface border border-archaeology-border rounded p-3 mb-3">
        <p className="text-xs text-archaeology-textDim font-mono mb-1">[meeting &quot;Sprint Planning&quot; at 04:12]</p>
        <p className="text-sm text-archaeology-textSecondary italic">&quot;...we need something stateless since the mobile team can&apos;t share cookies with the web session store...&quot;</p>
      </div>
      <span className="text-xs font-mono px-2 py-1 rounded bg-archaeology-greenDim text-archaeology-green">94% confidence match</span>
    </div>
  )
}
