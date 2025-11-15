// components/icons/DefaultProfileAvatar.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { colors } from "../../styles/colors";

export default function DefaultProfileAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: colors.neutral[4],
      }}
    >
      <FontAwesomeIcon
        icon={faUser}
        style={{
          width: size * 0.5,
          height: size * 0.5,
          color: colors.neutral[7],
        }}
      />
    </div>
  );
}
