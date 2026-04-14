# Refactoring Assistant Model and VAD Settings

This plan refactors the Assistant form to organize model and VAD parameters logically and implements new frontend features specified in `omnivoice-frontend-spec.md`.

## User Review Required
> [!IMPORTANT]
> Please review the "Open Questions" section regarding "Voice Detection Type" and user permissions for the new `PipelineCard`.

## Proposed Changes

---

### Redux/API/Entities Layer
#### [MODIFY] `src/entities/Assistants/model/const/nonRealtimeOptions.ts`
- Add `supportsCustomUpload` flag to `TtsProviderOption` interface.
- Add `gemma4-audio` to `LLM_PROVIDERS`.
- Add `omnivoice` to `TTS_PROVIDERS` with `supportsCustomUpload: true`.
- Update `NON_REALTIME_DEFAULTS` to use `gemma4-audio` and `omnivoice`.

#### [MODIFY] `src/entities/Assistants/api/assistantsApi.ts`
- Add a new mutation `uploadTtsVoice: build.mutation<void, { id: string, file: File }>` to handle `POST /api/assistants/:id/tts-voice`.
- Invalidates the `Assistants` tag on success so that the updated `ttsVoice` field is refetched.

---

### Feature Layer (UI Components)
#### [NEW] `src/features/Assistants/ui/AssistantForm/components/PipelineCard/PipelineCard.tsx`
- A new component replacing the Pipeline Mode section from `SpeechSettingsCard`.
- Implements `non-realtime` vs `realtime` selection.
- Contains STT, LLM, and TTS comboboxes.
- Disables STT selection and shows a hint if `gemma4-audio` is selected.
- Implements custom `.wav` upload functionality for TTS providers supporting `supportsCustomUpload` (like `omnivoice`). 
- Wraps the upload logic using the new `uploadTtsVoice` mutation from RTK Query.

#### [NEW] `src/features/Assistants/ui/AssistantForm/components/VadSettingsCard/VadSettingsCard.tsx`
- A unique component to house all VAD-related parameters.
- Migrates sliders from the old `ModelParametersCard` (`turn_detection_threshold`, `turn_detection_prefix_padding_ms`, `turn_detection_silence_duration_ms`, `idle_timeout_ms`).
- Migrates advanced VAD fields from the old `SpeechSettingsCard` (`turn_detection_type`, `semantic_eagerness`).
- Uses `Combobox` instead of `Textarea` for `turn_detection_type` (options like `server_vad`) and the proposed "Voice Detection Type".

#### [MODIFY] `src/features/Assistants/ui/AssistantForm/components/ModelParametersCard/ModelParametersCard.tsx`
- Removes VAD-related sliders.
- Keeps base parameters like `Temperature`.
- Migrates the non-VAD model settings from the old `SpeechSettingsCard` (e.g. `max_response_output_tokens`, `input_audio_transcription_model`, audio formats, noise reduction type).
- Implements admin-only conditional rendering for advanced parameters migrated from `SpeechSettingsCard`.

#### [DELETE] `src/features/Assistants/ui/AssistantForm/components/SpeechSettingsCard/SpeechSettingsCard.tsx`
- This file and its module CSS will be completely deleted and replaced by `PipelineCard` and `VadSettingsCard`.

#### [MODIFY] `src/features/Assistants/ui/AssistantForm/AssistantForm.tsx`
- Update the layout grid in the right column to render the 3 updated/new components: `PipelineCard`, `ModelParametersCard`, and `VadSettingsCard`.

---

## Open Questions
> [!WARNING]
> Please clarify the following before we proceed:

1. **"Voice Detection Type" parameter**: By `VAD Type`, you mean the field `turn_detection_type` (which we will set to use a Combobox with values like `server_vad`). However, the OpenAI spec doesn't explicitly have a `Voice Detection Type` inside the turn detection object. Do you mean the parameter `input_audio_noise_reduction` (which takes `none`, `near_field`, `far_field`), or is it another parameter in the assistant model schema?
2. **Access Control**: Previously, the entire `SpeechSettingsCard` (which included Pipeline Mode) was restricted to **Admin only**. Should the new `PipelineCard` (with `gemma4-audio` and TTS uploads) also be restricted to **Admin only**, or should all users be able to configure it?
3. **Admin Visibility**: Some VAD values (sliders) were visible to all users, while others (`turn_detection_type`, `semantic_eagerness`) were hidden for non-admins. Should the `VadSettingsCard` have mixed access (where it completely renders for everyone but hides specific advanced fields), or should it be uniformly separated?

## Verification Plan
### Automated & Build Checks
- Start the application and verify no compilation errors.
- Verify TypeScript types match the updated options schema.
### Manual Verification
- Log in as admin and non-admin. Check that field visibility adheres to the rules.
- Test the `.wav` file uploading via the Pipeline component to ensure the `multipart/form-data` request correctly hits the server.
- Select `gemma4-audio` and verify that the STT configuration becomes disabled.
