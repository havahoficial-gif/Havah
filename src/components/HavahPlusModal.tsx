import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Users,
  Building2,
  Server,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  Check,
} from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';
import { triggerHaptic } from '../utils/haptics';

interface HavahPlusModalProps {
  isOpen: boolean;
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

export const HavahPlusModal: React.FC<HavahPlusModalProps> = ({
  isOpen,
  language,
  theme,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'stewardship' | 'log'>('stewardship');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<'social' | 'sustainability' | 'both'>('both');
  const [donationConfirmed, setDonationConfirmed] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLogExpanded, setIsLogExpanded] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSelectTier = (amount: number) => {
    triggerHaptic('light');
    setSelectedTier(amount);
    setCustomAmount('');
  };

  const handleConfirmSupport = () => {
    triggerHaptic('success');
    setDonationConfirmed(true);
  };

  const handleReset = () => {
    setDonationConfirmed(false);
    setSelectedTier(null);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in ${
        theme.isDark ? 'bg-black/80' : 'bg-sky-950/20'
      }`}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-5 sm:p-7 border shadow-2xl transition-all max-h-[92vh] flex flex-col relative overflow-hidden backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
          color: theme.text,
        }}
      >
        {/* Ambient Subtle Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        {/* Modal Container */}
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between pb-3 border-b mb-3 shrink-0"
            style={{ borderColor: theme.cardBorder }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs border shrink-0"
                style={{
                  backgroundColor: theme.accentBg,
                  borderColor: theme.accentBorder,
                }}
              >
                <Heart className="w-5 h-5 fill-current" style={{ color: theme.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: theme.accentBg,
                      color: theme.accent,
                      borderColor: theme.accentBorder,
                    }}
                  >
                    {language === 'es' ? 'Mayordomía Abierta' : 'Open Stewardship'}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    {language === 'es' ? 'Nuestro compromiso' : 'Our commitment'}
                  </span>
                </div>
                <h3 className="font-serif-scripture font-bold text-base sm:text-lg mt-0.5 leading-tight" style={{ color: theme.text }}>
                  {language === 'es' ? 'Causas Sociales e Impacto Comunitario' : 'Social Causes & Community Impact'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
              style={{ color: theme.textMuted }}
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            className="grid grid-cols-2 p-1 rounded-2xl border mb-3 shrink-0 liquid-glass-subtle"
            style={{ borderColor: theme.cardBorder, backgroundColor: theme.cardVariant }}
          >
            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('stewardship');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'stewardship' ? 'shadow-sm scale-101' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: activeTab === 'stewardship' ? theme.accentBg : 'transparent',
                color: activeTab === 'stewardship' ? theme.accent : theme.textMuted,
              }}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Mayordomía y Aporte' : 'Stewardship & Gift'}</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('log');
              }}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'log' ? 'shadow-sm scale-101' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: activeTab === 'log' ? theme.accentBg : 'transparent',
                color: activeTab === 'log' ? theme.accent : theme.textMuted,
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Bitácora de Impacto' : 'Verified Impact Log'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block ml-0.5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 overscroll-contain">
            {donationConfirmed ? (
              /* Success / Thank You Screen */
              <div className="py-6 text-center space-y-4 animate-fade-in">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-xl border"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                  }}
                >
                  <Award className="w-8 h-8 fill-current" style={{ color: theme.accent }} />
                </div>

                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="font-serif-scripture font-bold text-xl sm:text-2xl" style={{ color: theme.text }}>
                    {language === 'es' ? '¡Gracias por sembrar amor!' : 'Thank you for sowing love!'}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    {language === 'es'
                      ? 'Tu generosidad sostiene directamente a familias vulnerables y preserva este santuario libre de publicidad comercial. Que Dios multiplique con creces cada semilla de paz en tu hogar.'
                      : 'Your generosity directly sustains vulnerable families and keeps this sanctuary free of ads. May God multiply every seed of peace in your home.'}
                  </p>
                </div>

                <div
                  className="p-4 rounded-2xl border text-left space-y-2 liquid-glass-subtle max-w-md mx-auto"
                  style={{ borderColor: theme.cardBorder }}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span style={{ color: theme.textMuted }}>
                      {language === 'es' ? 'Destino de los fondos:' : 'Funds Allocation:'}
                    </span>
                    <span style={{ color: theme.accent }}>
                      {selectedCause === 'social'
                        ? (language === 'es' ? '100% Causas Sociales' : '100% Social Causes')
                        : selectedCause === 'sustainability'
                        ? (language === 'es' ? '100% Sostenibilidad HAVAH' : '100% HAVAH Upkeep')
                        : (language === 'es' ? '65% Social • 35% Sostenibilidad' : '65% Social • 35% Upkeep')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span style={{ color: theme.textMuted }}>
                      {language === 'es' ? 'Aporte seleccionado:' : 'Selected gift:'}
                    </span>
                    <span className="font-mono text-sm" style={{ color: theme.text }}>
                      ${selectedTier || customAmount || '10'} USD
                    </span>
                  </div>
                  <p className="text-[11px] italic pt-1 border-t border-black/5 dark:border-white/5" style={{ color: theme.textMuted }}>
                    {language === 'es'
                      ? '2 Corintios 9:7: «Cada uno dé como propuso en su corazón, no con tristeza ni por obligación, porque Dios ama al dador alegre.»'
                      : '2 Corinthians 9:7: «Each of you should give what you have decided in your heart to give... for God loves a cheerful giver.»'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setActiveTab('log');
                      setDonationConfirmed(false);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    style={{
                      backgroundColor: theme.accentBg,
                      borderColor: theme.accentBorder,
                      color: theme.accent,
                    }}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Ver Bitácora de Impacto' : 'View Impact Log'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                      color: theme.textMuted,
                    }}
                  >
                    {language === 'es' ? 'Volver al reporte' : 'Back to report'}
                  </button>
                </div>
              </div>
            ) : activeTab === 'log' ? (
              /* TAB 2: Bitácora de Impacto y Entregas (Historial Verificado) */
              <div className="space-y-4 animate-fade-in">
                {/* Header Banner */}
                <div
                  className="p-4 rounded-2xl border liquid-glass-subtle space-y-1.5"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 text-emerald-500">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === 'es' ? 'Plan de Transparencia' : 'Transparency Plan'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {language === 'es' ? 'Próximamente' : 'Coming soon'}
                    </span>
                  </div>
                  <h4 className="font-serif-scripture font-bold text-base sm:text-lg" style={{ color: theme.text }}>
                    {language === 'es'
                      ? 'Bitácora de Impacto (se publicará cuando haya aportes)'
                      : 'Impact Log (to be published once contributions exist)'}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                    {language === 'es'
                      ? 'Cuando HAVAH reciba aportes, aquí publicaremos cuánto se recibió y en qué se usó. Hoy todavía no se ha recibido ni gestionado ningún fondo.'
                      : 'Once HAVAH receives contributions, we will publish here how much was received and how it was used. To date, no funds have been received or managed.'}
                  </p>
                </div>

                {/* Timeline Entries */}
                <div className="space-y-3.5">
                  {/* Entry 1: Octubre 2026 */}
                  <div
                    className="p-4 rounded-2xl border liquid-glass space-y-3 relative overflow-hidden transition-all shadow-sm"
                    style={{
                      backgroundColor: theme.cardVariant,
                      borderColor: theme.cardBorder,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-xs font-bold" style={{ color: theme.text }}>
                            {language === 'es'
                              ? 'Plan inicial (ejemplo)'
                              : 'Initial plan (example)'}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium" style={{ color: theme.textSecondary }}>
                          {language === 'es'
                            ? 'Plan: cuando existan aportes, se repartirían entre ayuda social y mantenimiento de la app.'
                            : 'Plan: once contributions exist, they would be split between social aid and app upkeep.'}
                        </p>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {language === 'es' ? 'Plan' : 'Plan'}
                      </span>
                    </div>

                    {/* Breakdown Pill */}
                    <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300 text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {language === 'es'
                          ? 'Desglose previsto: 65% Social / 35% Servidores'
                          : 'Planned breakdown: 65% Social / 35% Servers'}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        PREVISTO
                      </span>
                    </div>

                    {/* Nota de Mayordomía */}
                    <div
                      className="p-3.5 rounded-xl border space-y-1.5 bg-black/5 dark:bg-white/5"
                      style={{ borderColor: theme.cardBorder }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: theme.accent }}>
                        {language === 'es' ? 'Nota de Mayordomía:' : 'Stewardship Note:'}
                      </span>
                      <p className="font-serif-scripture italic text-xs sm:text-[13px] leading-relaxed" style={{ color: theme.text }}>
                        {language === 'es'
                          ? '«Iniciamos este camino con cuentas claras ante Dios y la comunidad. Cada aporte de este mes se está destinando a consolidar un refugio digital libre de anuncios y a preparar las primeras entregas de apoyo directo.»'
                          : '«We begin this journey with clear accounts before God and our community. Every gift this month consolidates an ad-free digital sanctuary and prepares the first direct support deliveries.»'}
                      </p>
                    </div>

                    {/* Concrete Deliveries Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/5 space-y-0.5">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                          {language === 'es' ? '🥖 65% Despensa y Alimentos' : '🥖 65% Family Food Baskets'}
                        </span>
                        <p className="text-[10px]" style={{ color: theme.textMuted }}>
                          {language === 'es'
                            ? 'Armado de kits de granos, aceite y nutrición básica para madres cabeza de hogar.'
                            : 'Grains, pantry staples, and basic nutrition boxes for single mothers.'}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl border border-amber-500/15 bg-amber-500/5 space-y-0.5">
                        <span className="font-bold text-amber-600 dark:text-amber-400 block">
                          {language === 'es' ? '⚡ 35% Servidores y Voz' : '⚡ 35% Cloud Infrastructure'}
                        </span>
                        <p className="text-[10px]" style={{ color: theme.textMuted }}>
                          {language === 'es'
                            ? 'Mantenimiento del servidor cloud sin rastreo de datos comerciales ni anuncios.'
                            : 'Cloud servers maintained strictly with zero tracking or commercial advertisers.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Entry 2: Próximo Corte de Auditoría Pública */}
                  <div
                    className="p-4 rounded-2xl border liquid-glass space-y-2.5"
                    style={{
                      backgroundColor: theme.accentBg,
                      borderColor: theme.accentBorder,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold" style={{ color: theme.text }}>
                          {language === 'es'
                            ? 'Próximo Corte de Auditoría Pública:'
                            : 'Next Public Audit Cut-off:'}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                        31 de Octubre, 2026
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                      {language === 'es'
                        ? 'Este espacio se actualizará automáticamente cada fin de mes con los comprobantes, reportes de soporte técnico y el impacto acumulado.'
                        : 'This space updates automatically at the end of every month with receipts, technical support reports, and cumulative impact.'}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] border-t border-black/5 dark:border-white/5">
                      <span className="text-[10px] italic" style={{ color: theme.textMuted }}>
                        {language === 'es' ? 'Auditoría ciudadana y comunitaria 100% abierta' : '100% open community public audit'}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        {language === 'es' ? 'Sin letra chica' : 'No fine print'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back to giving button */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveTab('stewardship');
                  }}
                  className="w-full py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 hover:scale-101"
                  style={{
                    backgroundColor: theme.cardVariant,
                    borderColor: theme.cardBorder,
                    color: theme.accent,
                  }}
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'es' ? 'Sembrar en las Causas Sociales de HAVAH' : 'Sow in HAVAH Social Causes'}</span>
                </button>
              </div>
            ) : (
              /* TAB 1: Mayordomía & Aporte */
              <>
                {/* 1. Biblical Anchor & Sacred Intent */}
                <div
                  className="p-4 rounded-2xl border liquid-glass-subtle space-y-1.5"
                  style={{
                    backgroundColor: theme.accentBg,
                    borderColor: theme.accentBorder,
                  }}
                >
                  <p className="font-serif-scripture italic text-xs sm:text-sm font-medium leading-relaxed" style={{ color: theme.text }}>
                    {language === 'es'
                      ? '«Procurando hacer las cosas con honradez y transparencia, no solo ante el Señor sino también delante de las personas.»'
                      : '«Having regard for honorable things, not only in the sight of the Lord, but also in the sight of men.»'}
                  </p>
                  <span className="text-[10px] font-bold tracking-wider uppercase block" style={{ color: theme.accent }}>
                    2 Corintios 8:21 • Mayordomía Bíblica
                  </span>
                </div>

                {/* Fe en Construcción */}
                <div className="space-y-4 py-8 text-center animate-fade-in">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-amber-500/10 mb-2">
                    <Sparkles className="w-8 h-8" style={{ color: theme.accent }} />
                  </div>
                  <h4 className="font-serif-scripture font-bold text-lg" style={{ color: theme.text }}>
                    {language === 'es' ? 'Fe en Construcción' : 'Faith Under Construction'}
                  </h4>
                  <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: theme.textSecondary }}>
                    {language === 'es' 
                      ? 'HAVAH es un sueño que apenas comienza a respirar. Estamos sembrando los cimientos de nuestra misión colectiva y te invitamos a unirte en oración. Mientras nuestra comunidad crece orgánicamente, nos preparamos juntos para los primeros pasos de impacto social que daremos por Su gracia.' 
                      : 'HAVAH is a dream just beginning to breathe. We are laying the foundations of our collective mission and invite you to join us in prayer. As our community grows organically, we prepare together for the first steps of social impact we will take by His grace.'}
                  </p>
                </div>

                {/* Ethical Promise */}
                <p className="text-[11px] text-center leading-relaxed mt-auto pt-4" style={{ color: theme.textMuted }}>
                  {language === 'es'
                    ? 'HAVAH nunca venderá tus datos ni condicionará el acceso a la Palabra de Dios. Todo el contenido bíblico, devocionales y audios son y seguirán siendo gratuitos para toda persona.'
                    : 'HAVAH will never sell your data or restrict access to God’s Word. All scripture and devotionals are unconditionally free for everyone.'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

