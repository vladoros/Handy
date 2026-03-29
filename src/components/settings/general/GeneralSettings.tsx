import React from "react";
import { useTranslation } from "react-i18next";
import { type } from "@tauri-apps/plugin-os";
import { MicrophoneSelector } from "../MicrophoneSelector";
import { ShortcutInput } from "../ShortcutInput";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { SettingContainer } from "../../ui/SettingContainer";
import { OutputDeviceSelector } from "../OutputDeviceSelector";
import { PushToTalk } from "../PushToTalk";
import { AudioFeedback } from "../AudioFeedback";
import { ToggleSwitch } from "../../ui/ToggleSwitch";
import { useSettings } from "../../../hooks/useSettings";
import { VolumeSlider } from "../VolumeSlider";
import { MuteWhileRecording } from "../MuteWhileRecording";
import { ModelSettingsCard } from "./ModelSettingsCard";

export const GeneralSettings: React.FC = () => {
  const { t } = useTranslation();
  const { audioFeedbackEnabled, getSetting, updateSetting, isUpdating } =
    useSettings();
  const pushToTalk = getSetting("push_to_talk");
  const doubleTapEnabled = getSetting("double_tap_enabled") ?? false;
  const doubleTapDelay = getSetting("double_tap_delay_ms") ?? 500;
  const isLinux = type() === "linux";

  const handleDoubleTapChange = async (enabled: boolean) => {
    await updateSetting("double_tap_enabled", enabled);
  };

  const handleDelayChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      await updateSetting("double_tap_delay_ms", value);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <SettingsGroup title={t("settings.general.title")}>
        <ShortcutInput shortcutId="transcribe" grouped={true} />
        <PushToTalk descriptionMode="tooltip" grouped={true} />

        {/* Double-Tap Toggle */}
        <ToggleSwitch
          label={t("settings.general.doubleTap.label")}
          description={t("settings.general.doubleTap.description")}
          checked={doubleTapEnabled}
          onChange={handleDoubleTapChange}
          disabled={isUpdating("double_tap_enabled")}
          grouped={true}
        />

        {/* Double-Tap Delay */}
        {doubleTapEnabled && (
          <SettingContainer
            title={t("settings.general.doubleTap.delay.label")}
            description={t("settings.general.doubleTap.delay.description")}
            descriptionMode="tooltip"
            grouped={true}
          >
            <input
              type="number"
              min={100}
              max={1999}
              value={doubleTapDelay}
              onChange={handleDelayChange}
              className="w-20 px-2 py-1 rounded border border-mid-gray/30 text-sm"
            />
          </SettingContainer>
        )}

        {/* Cancel shortcut is hidden with push-to-talk (release key cancels) and on Linux (dynamic shortcut instability) */}
        {!isLinux && !pushToTalk && (
          <ShortcutInput shortcutId="cancel" grouped={true} />
        )}
      </SettingsGroup>
      <ModelSettingsCard />
      <SettingsGroup title={t("settings.sound.title")}>
        <MicrophoneSelector descriptionMode="tooltip" grouped={true} />
        <MuteWhileRecording descriptionMode="tooltip" grouped={true} />
        <AudioFeedback descriptionMode="tooltip" grouped={true} />
        <OutputDeviceSelector
          descriptionMode="tooltip"
          grouped={true}
          disabled={!audioFeedbackEnabled}
        />
        <VolumeSlider disabled={!audioFeedbackEnabled} />
      </SettingsGroup>
    </div>
  );
};
