type SkillTagProps = {
  label: string;
  variant?: "default" | "missing";
};

export default function SkillTag({ label, variant = "default" }: SkillTagProps) {
  if (variant === "missing") {
    return (
      <span
        className="rounded-full px-3 py-1 text-sm"
        style={{ backgroundColor: "rgba(248, 81, 73, 0.15)", color: "#f85149" }}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className="rounded-full px-3 py-1 text-sm"
      style={{ backgroundColor: "rgba(88, 166, 255, 0.15)", color: "#79c0ff" }}
    >
      {label}
    </span>
  );
}
