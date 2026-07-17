export interface FileItem {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  files: Record<string, string>; // path -> content
  activeFile: string; // current open file path
  archived?: boolean; // is archived indicator
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  filesUpdated?: string[];
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface TerminalLog {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'input' | 'command';
  text: string;
  timestamp: string;
}

export interface DeploymentStatus {
  state: 'idle' | 'building' | 'deploying' | 'live' | 'failed';
  url?: string;
  progress: number;
}
