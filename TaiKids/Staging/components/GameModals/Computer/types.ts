
import { EndingHistoryItem } from '../../../game/data/endingData';
import { Gender } from '../NamePicker';

export type AppType = 'DESKTOP' | 'QQ' | 'SYSTEM' | 'ALBUM' | 'BROWSER';

export interface BaseAppProps {
    onCloseApp: () => void;
}

export interface DesktopAppProps {
    onOpenApp: (app: AppType) => void;
    currentWeek: number;
}

export interface QQAppProps extends BaseAppProps {
    currentWeek: number;
    gender: Gender;
    chatHistory: Record<string, { choiceIndex: number, timestamp: number }>;
    onChatReply: (scenarioId: string, replyIndex: number, closenessDelta: number) => void;
}

export interface SystemAppProps extends BaseAppProps {
    volume: number;
    isMuted: boolean;
    onVolumeChange: (vol: number) => void;
    onToggleMute: () => void;
}

export interface SettingsAppProps extends SystemAppProps {}

export interface AlbumAppProps extends BaseAppProps {
    endingHistory: EndingHistoryItem[];
}
