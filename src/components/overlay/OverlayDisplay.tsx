import React from "react";
import { AudioBars } from "./AudioBars";
import { MicrophoneIcon, TranscriptionIcon, CancelIcon } from "../icons";
import { AccentTheme, OverlayTheme, getThemeColors } from "@/theme";

export interface OverlayDisplayProps {
  overlayTheme: OverlayTheme;
  accentTheme: AccentTheme;
  levels: number[];
  state?: "recording" | "transcribing";
  showIcons?: boolean;
  scale?: "preview" | "full";
  onCancel?: () => void;
  animate?: boolean;
  transcribingText?: string;
  className?: string;
  barsCentered?: boolean;
  customBarCount?: number;
  customBarSize?: number;
  customBarColor?: string;
}

const THEME_CONFIG = {
  pill: {
    preview: { iconSize: 14, barCount: 5, barWidth: 4, gap: 3, maxHeight: 14 },
    full: { iconSize: 20, barCount: 9, barWidth: 5, gap: 3, maxHeight: 20 },
  },
  minimal: {
    preview: { iconSize: 14, barCount: 5, barWidth: 4, gap: 3, maxHeight: 14 },
    full: { iconSize: 20, barCount: 9, barWidth: 5, gap: 3, maxHeight: 20 },
  },
  glassmorphism: {
    preview: { iconSize: 14, barCount: 5, barWidth: 4, gap: 3, maxHeight: 14 },
    full: { iconSize: 20, barCount: 9, barWidth: 5, gap: 3, maxHeight: 20 },
  },
};

export const OverlayDisplay: React.FC<OverlayDisplayProps> = ({
  overlayTheme,
  accentTheme,
  levels,
  state = "recording",
  showIcons = true,
  scale = "full",
  onCancel,
  animate = true,
  transcribingText = "Transcribing...",
  className = "",
  barsCentered = false,
  customBarCount,
  customBarSize,
  customBarColor,
}) => {
  const themeColors = getThemeColors(accentTheme);
  const config = THEME_CONFIG[overlayTheme][scale];

  const barCount = customBarCount ?? config.barCount;
  const barWidth = customBarSize ?? config.barWidth;
  const barColor =
    customBarColor === "accent" || !customBarColor
      ? themeColors.light
      : customBarColor;

  const Icon = state === "recording" ? MicrophoneIcon : TranscriptionIcon;

  if (overlayTheme === "pill") {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: scale === "preview" ? "4px" : "8px",
          padding: scale === "preview" ? "4px 6px" : "6px 10px",
          background: "#000000cc",
          borderRadius: "18px",
        }}
      >
        {showIcons && (
          <Icon
            width={config.iconSize}
            height={config.iconSize}
            color={themeColors.primary}
          />
        )}

        {state === "recording" ? (
          <AudioBars
            levels={levels}
            barCount={barCount}
            barWidth={barWidth}
            gap={config.gap}
            maxHeight={config.maxHeight}
            color={barColor}
            animate={animate}
            centered={barsCentered}
          />
        ) : (
          <span
            style={{
              color: "white",
              fontSize: scale === "preview" ? "10px" : "12px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {transcribingText}
          </span>
        )}

        {showIcons && state === "recording" && onCancel && scale === "full" && (
          <div
            onClick={onCancel}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition:
                "background-color 150ms ease-out, transform 100ms ease-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${themeColors.primary}33`;
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CancelIcon color={themeColors.primary} />
          </div>
        )}
      </div>
    );
  }

  if (overlayTheme === "minimal") {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: scale === "preview" ? "4px" : "8px",
          padding: scale === "preview" ? "4px 6px" : "6px 10px",
          background: "#00000099",
          borderRadius: "18px",
        }}
      >
        {showIcons && (
          <Icon
            width={config.iconSize}
            height={config.iconSize}
            color={themeColors.primary}
          />
        )}

        {state === "recording" ? (
          <AudioBars
            levels={levels}
            barCount={barCount}
            barWidth={barWidth}
            gap={config.gap}
            maxHeight={config.maxHeight}
            color={barColor}
            animate={animate}
            centered={barsCentered}
          />
        ) : (
          <span
            style={{
              color: "white",
              fontSize: scale === "preview" ? "10px" : "12px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {transcribingText}
          </span>
        )}
        {showIcons && state === "recording" && onCancel && scale === "full" && (
          <div
            onClick={onCancel}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition:
                "background-color 150ms ease-out, transform 100ms ease-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${themeColors.primary}33`;
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CancelIcon color={themeColors.primary} />
          </div>
        )}
      </div>
    );
  }

  if (overlayTheme === "glassmorphism") {
    return (
      <div
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: scale === "preview" ? "4px" : "8px",
          padding: scale === "preview" ? "4px 6px" : "6px 10px",
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "18px",
          border:
            scale === "preview" ? "none" : `1px solid ${themeColors.primary}40`,
          boxShadow:
            scale === "preview"
              ? "none"
              : `0 4px 20px ${themeColors.primary}20`,
        }}
      >
        {showIcons && (
          <Icon
            width={config.iconSize}
            height={config.iconSize}
            color={themeColors.primary}
          />
        )}

        {state === "recording" ? (
          <AudioBars
            levels={levels}
            barCount={barCount}
            barWidth={barWidth}
            gap={config.gap}
            maxHeight={config.maxHeight}
            color={barColor}
            animate={animate}
            centered={barsCentered}
          />
        ) : (
          <span
            style={{
              color: "white",
              fontSize: scale === "preview" ? "10px" : "12px",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {transcribingText}
          </span>
        )}

        {showIcons && state === "recording" && onCancel && scale === "full" && (
          <div
            onClick={onCancel}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition:
                "background-color 150ms ease-out, transform 100ms ease-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${themeColors.primary}33`;
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CancelIcon color={themeColors.primary} />
          </div>
        )}
      </div>
    );
  }

  return null;
};
