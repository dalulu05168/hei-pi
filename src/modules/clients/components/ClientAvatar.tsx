interface ClientAvatarProps {
  avatarUrl?: string;
  name: string;
  size?: "large" | "small";
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "—";
}

export function ClientAvatar({ avatarUrl, name, size = "small" }: ClientAvatarProps) {
  const sizeClassName =
    size === "large"
      ? "h-14 w-14 text-[15px]"
      : "h-8 w-8 text-[10px]";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- URLs will come from the future client data service.
      <img
        alt={`Avatar de ${name}`}
        className={`${sizeClassName} rounded-full border border-[rgba(244,196,48,0.28)] object-cover`}
        src={avatarUrl}
      />
    );
  }

  return (
    <span
      aria-label={`Avatar de ${name}`}
      className={`grid ${sizeClassName} place-items-center rounded-full border border-[rgba(244,196,48,0.28)] bg-[#241c0d] font-semibold text-[#f2d88f]`}
    >
      {getInitials(name)}
    </span>
  );
}
