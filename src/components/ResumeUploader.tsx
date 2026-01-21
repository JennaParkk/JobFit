type ResumeUploaderProps = {
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function ResumeUploader({ file, onChange }: ResumeUploaderProps) {
  return (
    <div className="rounded-lg p-5" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
      <h2 className="font-medium" style={{ color: "var(--foreground)" }}>Resume (PDF)</h2>

      <input
        className="mt-3 block w-full text-sm"
        style={{ color: "var(--foreground)" }}
        type="file"
        accept="application/pdf"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />

      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        {file ? `Selected: ${file.name}` : "No file selected yet."}
      </p>
    </div>
  );
}
