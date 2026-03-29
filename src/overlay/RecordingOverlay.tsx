import { listen } from "@tauri-apps/api/event";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./RecordingOverlay.css";
import { commands } from "@/bindings";
import i18n, { syncLanguageFromSettings } from "@/i18n";
import { getLanguageDirection } from "@/lib/utils/rtl";
import { OverlayDisplay } from "../components/overlay/OverlayDisplay";
import { AccentTheme, OverlayTheme } from "../theme";

type OverlayState = "recording" | "transcribing" | "processing";

const RecordingOverlay: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [state, setState] = useState<OverlayState>("recording");
  const [levels, setLevels] = useState<number[]>(Array(16).fill(0));
  const smoothedLevelsRef = useRef<number[]>(Array(16).fill(0));
  const direction = getLanguageDirection(i18n.language);

  const [accentTheme, setAccentTheme] = useState<AccentTheme>("pink");
  const [overlayTheme, setOverlayTheme] = useState<OverlayTheme>("pill");
  const [showIcons, setShowIcons] = useState<boolean>(true);
  const [barsCentered, setBarsCentered] = useState<boolean>(false);
  const [barColor, setBarColor] = useState<string>("accent");

  useEffect(() => {
    const loadSettings = async () => {
      const result = await commands.getAppSettings();
      if (result.status === "ok" && result.data) {
        const settings = result.data;
        setAccentTheme((settings.accent_theme as AccentTheme) || "pink");
        setOverlayTheme((settings.overlay_theme as OverlayTheme) || "pill");
        setShowIcons(settings.overlay_show_icons ?? true);
        setBarsCentered(settings.overlay_bars_centered ?? false);
        setBarColor(settings.overlay_bar_color || "accent");
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const setupEventListeners = async () => {
      const unlistenShow = await listen("show-overlay", async (event) => {
        await syncLanguageFromSettings();
        const overlayState = event.payload as OverlayState;
        setState(overlayState);
        setIsVisible(true);
      });

      const unlistenHide = await listen("hide-overlay", () => {
        setIsVisible(false);
      });

      const unlistenLevel = await listen<number[]>("mic-level", (event) => {
        const newLevels = event.payload as number[];
        const smoothed = smoothedLevelsRef.current.map((prev, i) => {
          const target = newLevels[i] || 0;
          return prev * 0.7 + target * 0.3;
        });
        smoothedLevelsRef.current = smoothed;
        setLevels(smoothed.slice(0, 9));
      });

      const unlistenTheme = await listen<string>("theme-changed", (event) => {
        setAccentTheme(event.payload as AccentTheme);
      });

      const unlistenOverlayTheme = await listen<string>(
        "overlay-theme-changed",
        (event) => {
          setOverlayTheme(event.payload as OverlayTheme);
        },
      );

      const unlistenShowIcons = await listen<boolean>(
        "overlay-show-icons-changed",
        (event) => {
          setShowIcons(event.payload);
        },
      );

      const unlistenBarsCentered = await listen<boolean>(
        "overlay-bars-centered-changed",
        (event) => {
          setBarsCentered(event.payload);
        },
      );

      const unlistenBarColor = await listen<string>(
        "overlay-bar-color-changed",
        (event) => {
          setBarColor(event.payload);
        },
      );

      return () => {
        unlistenShow();
        unlistenHide();
        unlistenLevel();
        unlistenTheme();
        unlistenOverlayTheme();
        unlistenShowIcons();
        unlistenBarsCentered();
        unlistenBarColor();
      };
    };

    setupEventListeners();
  }, []);

  const handleCancel = () => {
    commands.cancelOperation();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      dir={direction}
      className={`recording-overlay-container fade-in`}
      style={{ width: 220, height: 44, overflow: "visible" }}
    >
      <OverlayDisplay
        overlayTheme={overlayTheme}
        accentTheme={accentTheme}
        levels={levels}
        state={state === "recording" ? "recording" : "transcribing"}
        showIcons={showIcons}
        scale="full"
        onCancel={handleCancel}
        animate={true}
        transcribingText={
          state === "transcribing"
            ? t("overlay.transcribing")
            : t("overlay.processing")
        }
        barsCentered={barsCentered}
        customBarColor={barColor}
      />
    </div>
  );
};

export default RecordingOverlay;
