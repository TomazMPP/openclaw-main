export const Provider = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  GOOGLE: "google",
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];

export const Model = {
  CLAUDE_HAIKU_4_5: "claude-haiku-4-5-20251001",
  CLAUDE_OPUS_4_6: "claude-opus-4-6",
  CLAUDE_SONNET_4_6: "claude-sonnet-4-6",
  GPT_5_2: "gpt-5.2",
  GPT_4_1: "gpt-4.1",
  GEMINI_3_0_FLASH: "gemini-3-0-flash",
  GEMINI_2_5_PRO: "gemini-2.5-pro-preview-06-05",
} as const;

export type Model = (typeof Model)[keyof typeof Model];

/** Models shown to regular users. Haiku under the Opus 4.5 label. */
export const MODELS = [
  {
    id: Model.CLAUDE_HAIKU_4_5,
    provider: Provider.ANTHROPIC,
    name: "Claude Opus 4.5",
  },
  {
    id: Model.GPT_5_2,
    provider: Provider.OPENAI,
    name: "GPT 5.2",
  },
  {
    id: Model.GEMINI_3_0_FLASH,
    provider: Provider.GOOGLE,
    name: "Gemini 3.0 Flash",
  },
] as const;

/** All models — available to admins. */
export const ADMIN_MODELS = [
  {
    id: Model.CLAUDE_OPUS_4_6,
    provider: Provider.ANTHROPIC,
    name: "Claude Opus 4.6",
  },
  {
    id: Model.CLAUDE_SONNET_4_6,
    provider: Provider.ANTHROPIC,
    name: "Claude Sonnet 4.6",
  },
  {
    id: Model.CLAUDE_HAIKU_4_5,
    provider: Provider.ANTHROPIC,
    name: "Claude Haiku 4.5",
  },
  {
    id: Model.GPT_5_2,
    provider: Provider.OPENAI,
    name: "GPT 5.2",
  },
  {
    id: Model.GPT_4_1,
    provider: Provider.OPENAI,
    name: "GPT 4.1",
  },
  {
    id: Model.GEMINI_2_5_PRO,
    provider: Provider.GOOGLE,
    name: "Gemini 2.5 Pro",
  },
  {
    id: Model.GEMINI_3_0_FLASH,
    provider: Provider.GOOGLE,
    name: "Gemini 3.0 Flash",
  },
] as const;
