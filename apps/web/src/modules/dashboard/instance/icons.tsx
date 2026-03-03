import { Model, CommunicatonChannel } from "@workspace/openclaw/config";
import { Icons } from "@workspace/ui-web/icons";

export const CommunicationChannelIcon = {
  [CommunicatonChannel.TELEGRAM]: Icons.Telegram,
  [CommunicatonChannel.DISCORD]: Icons.Discord,
  [CommunicatonChannel.WHATSAPP]: Icons.Whatsapp,
} as const;

export const ModelIcon = {
  [Model.CLAUDE_HAIKU_4_5]: Icons.Claude,
  [Model.CLAUDE_OPUS_4_6]: Icons.Claude,
  [Model.CLAUDE_SONNET_4_6]: Icons.Claude,
  [Model.GPT_5_2]: Icons.OpenAI,
  [Model.GPT_4_1]: Icons.OpenAI,
  [Model.GEMINI_3_0_FLASH]: Icons.Gemini,
  [Model.GEMINI_2_5_PRO]: Icons.Gemini,
} as const;
