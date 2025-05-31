// Message types
export interface Message {
  id: number;
  role: string;
  message: string;
}

// Model types
export interface Model {
  id: number;
  name: string;
}

// Text formatting types
export interface FormattedSegment {
  type:
    | "text"
    | "bold"
    | "bullet"
    | "parenthetical"
    | "question"
    | "emphasis"
    | "code";
  content: string;
  key: string;
  children?: FormattedSegment[];
}

export interface TextFormatterOptions {
  bulletColor?: string;
  boldColor?: string;
  parentheticalColor?: string;
  questionColor?: string;
  emphasisColor?: string;
  codeBackgroundColor?: string;
}

// Component prop types
export interface TypewriterProps {
  text: string;
  delay: number;
  onUpdate?: () => void;
  formatterOptions?: TextFormatterOptions;
  disableAutoScroll?: boolean;
  onTypingStatusChange?: (isTyping: boolean) => void;
  onCancel?: () => void;
}

export interface ConversationDisplayProps {
  conversation: Message[];
  isLoading: boolean;
  onTypewriterUpdate?: () => void;
  className?: string;
  messageClassName?: string;
  disableTypewriterScroll?: boolean;
  onTypingStatusChange?: (isTyping: boolean) => void;
}
