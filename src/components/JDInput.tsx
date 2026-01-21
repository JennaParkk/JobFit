type JDInputProps = {
  value: string;
  onChange: (next: string) => void;
};

export default function JDInput({ value, onChange }: JDInputProps) {
  return (
    <div className="rounded-lg p-5" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
      <h2 className="font-medium" style={{ color: "var(--foreground)" }}>Job Description</h2>
      <textarea
        className="mt-3 w-full resize-y rounded-md border p-3 text-sm outline-none bg-transparent"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        rows={10}
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
