import React from 'react';
import {
  Home,
  BookOpen,
  GraduationCap,
  Heart,
  MessageCircle,
  BookmarkCheck,
} from 'lucide-react';
import { HavahTab, Language } from '../types';
import { ThemeColors } from '../theme';

interface BottomNavProps {
  currentTab: HavahTab;
  language: Language;
  theme: ThemeColors;
  onTabSelected: (tab: HavahTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  language,
  theme,
  onTabSelected,
}) => {
  const tabs: Array<{ id: HavahTab; labelEs: string; labelEn: string; icon: React.ElementType }> = [
    { id: 'inicio', labelEs: 'Inicio', labelEn: 'Home', icon: Home },
    { id: 'biblia', labelEs: 'Biblia', labelEn: 'Bible', icon: BookOpen },
    { id: 'estudios', labelEs: 'Estudios', labelEn: 'Studies', icon: GraduationCap },
    { id: 'comunidad', labelEs: 'Comunidad', labelEn: 'Community', icon: Heart },
    { id: 'dialogo', labelEs: 'Diálogo', labelEn: 'Dialogue', icon: MessageCircle },
    { id: 'diario', labelEs: 'Diario', labelEn: 'Journal', icon: BookmarkCheck },
  ];

  return (
    <div className="bottom-nav-container">
      <nav
        className="floating-bottom-nav"
      >
        {tabs.map((tab) => {
          const isSelected = currentTab === tab.id;
          const IconComponent = tab.icon;
          const label = language === 'es' ? tab.labelEs : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => onTabSelected(tab.id)}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 sm:py-1.5 px-0.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer group active:scale-95"
              style={{
                color: isSelected ? theme.accent : theme.textMuted,
              }}
            >
              <div
                className={`flex items-center justify-center rounded-xl transition-all duration-300 w-7 sm:w-10 h-6.5 sm:h-8 ${
                  isSelected
                    ? 'btn-holographic scale-105 shadow-md'
                    : 'bg-transparent group-hover:bg-white/5'
                }`}
              >
                <IconComponent
                  className={`transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : ''}`}
                  style={{
                    color: isSelected ? '#FFFFFF' : theme.textMuted,
                  }}
                />
              </div>
              <span
                className={`mt-0.5 sm:mt-1 text-[8.5px] xs:text-[9.5px] sm:text-[10px] tracking-tight leading-tight text-center truncate max-w-full px-0.5 select-none transition-colors duration-300 ${isSelected ? 'font-bold' : 'font-medium'}`}
                style={{
                  color: isSelected ? theme.accent : theme.textMuted,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
