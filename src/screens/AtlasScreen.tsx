import React, { useState } from 'react';
import {
  ArrowLeft,
  Compass,
  MapPin,
  BookOpen,
  Info,
  Maximize2,
  X,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Clock,
  GitBranch,
  Eye,
} from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';
import { ATLAS_PLATES, AtlasPlate, AtlasPin } from '../data/atlasData';

interface AtlasScreenProps {
  language: Language;
  theme: ThemeColors;
  onBack: () => void;
}

interface GenealogyNode {
  id: string;
  nameEs: string;
  nameEn: string;
  roleEs: string;
  roleEn: string;
  scriptures: string;
  eraEs: string;
  eraEn: string;
  children: GenealogyNode[];
}

const GENEALOGY_TREE_DATA: GenealogyNode = {
  id: 'abraham',
  nameEs: 'Abraham (אַבְרָהָם)',
  nameEn: 'Abraham (Father of Faith)',
  roleEs: 'Padre de la fe y receptor del pacto',
  roleEn: 'Father of faith and recipient of the covenant',
  scriptures: 'Génesis 12:1-3; 22:18 / Mateo 1:2',
  eraEs: 'c. 2000 a.C. • Época Patriarcal',
  eraEn: 'c. 2000 BC • Patriarchal Era',
  children: [
    {
      id: 'isaac',
      nameEs: 'Isaac (יִצְחָק)',
      nameEn: 'Isaac (Son of Promise)',
      roleEs: 'Hijo de la promesa en Moriah',
      roleEn: 'Son of the promise at Moriah',
      scriptures: 'Génesis 21:1-3 / Mateo 1:2',
      eraEs: 'c. 1900 a.C. • Renovación del pacto',
      eraEn: 'c. 1900 BC • Covenant renewal',
      children: [
        {
          id: 'jacob',
          nameEs: 'Jacob / Israel (יַעֲקֹב / יִשְׂרָאֵל)',
          nameEn: 'Jacob / Israel (Father of the 12)',
          roleEs: 'Padre de las doce tribus de Israel',
          roleEn: 'Father of the twelve tribes of Israel',
          scriptures: 'Génesis 28:13-15; 35:9-12 / Mateo 1:2',
          eraEs: 'c. 1800 a.C. • Teofanía en Betel y Peniel',
          eraEn: 'c. 1800 BC • Bethel & Peniel',
          children: [
            {
              id: 'judah',
              nameEs: 'Judá (יְהוּדָה)',
              nameEn: 'Judah (Royal Tribe)',
              roleEs: 'Portador del cetro y la bendición real',
              roleEn: 'Bearer of the royal scepter',
              scriptures: 'Génesis 49:10 / Mateo 1:3',
              eraEs: 'c. 1750 a.C. • Bendición en Gosén',
              eraEn: 'c. 1750 BC • Blessing in Goshen',
              children: [
                {
                  id: 'boaz_ruth',
                  nameEs: 'Booz y Rut (בֹּעַז וְרוּת)',
                  nameEn: 'Boaz & Ruth (Redeemer & Gentile Grace)',
                  roleEs: 'El pariente redentor en Belén de Judá',
                  roleEn: 'The kinsman redeemer in Bethlehem',
                  scriptures: 'Rut 4:13-22 / Mateo 1:5',
                  eraEs: 'c. 1100 a.C. • Época de los Jueces',
                  eraEn: 'c. 1100 BC • Period of the Judges',
                  children: [
                    {
                      id: 'david',
                      nameEs: 'David el Rey (דָּוִד הַמֶּלֶךְ)',
                      nameEn: 'King David (The Beloved)',
                      roleEs: 'Receptor del pacto del reino eterno',
                      roleEn: 'Recipient of the eternal kingdom covenant',
                      scriptures: '2 Samuel 7:12-16 / Mateo 1:6',
                      eraEs: 'c. 1010–970 a.C. • Monarquía Unida',
                      eraEn: 'c. 1010–970 BC • United Monarchy',
                      children: [
                        {
                          id: 'zerubbabel',
                          nameEs: 'Zorobabel (זְרֻבָּבֶל)',
                          nameEn: 'Zerubbabel (Seed of Babylon)',
                          roleEs: 'Gobernador del retorno y constructor del templo',
                          roleEn: 'Governor of the return & temple rebuilder',
                          scriptures: 'Hageo 2:23 / Zacarías 4:6-10 / Mateo 1:12',
                          eraEs: 'c. 520 a.C. • Post-Exilio Babilónico',
                          eraEn: 'c. 520 BC • Post-Exilic Era',
                          children: [
                            {
                              id: 'joseph_mary',
                              nameEs: 'José y María (יוֹסֵף וּמִרְיָם)',
                              nameEn: 'Joseph & Mary (Legal & Virginal Line)',
                              roleEs: 'Derecho davídico y concepción por el Espíritu',
                              roleEn: 'Davidic lineage & conception by the Holy Spirit',
                              scriptures: 'Mateo 1:16-25 / Lucas 1:26-38; 3:23',
                              eraEs: 'c. 5 a.C. • Plenitud del tiempo',
                              eraEn: 'c. 5 BC • Fullness of the time',
                              children: [
                                {
                                  id: 'jesus',
                                  nameEs: 'JESUCRISTO (יֵשׁוּעַ הַמָּשִׁיחַ)',
                                  nameEn: 'JESUS CHRIST (Yeshua HaMashiach)',
                                  roleEs: 'Emanuel, Salvador del mundo y Rey de reyes',
                                  roleEn: 'Immanuel, Savior of the World & King of kings',
                                  scriptures: 'Mateo 1:1, 21 / Lucas 2:11 / Juan 1:14 / Apocalipsis 19:16',
                                  eraEs: 'Siglo I d.C. • Redención Eterna Consumada',
                                  eraEn: '1st Century AD • Eternal Redemption Fulfilled',
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const AtlasScreen: React.FC<AtlasScreenProps> = ({
  language,
  theme,
  onBack,
}) => {
  const [selectedPlateIndex, setSelectedPlateIndex] = useState(0);
  const [selectedPinIndex, setSelectedPinIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [genealogyViewMode, setGenealogyViewMode] = useState<'map' | 'tree'>('map');
  const [zoom, setZoom] = useState(1);

  const plates = ATLAS_PLATES;
  const currentPlate = plates[selectedPlateIndex] || plates[0];
  const activePin =
    currentPlate.pins && currentPlate.pins.length > 0
      ? currentPlate.pins[selectedPinIndex] || currentPlate.pins[0]
      : null;

  const handleSelectPlate = (index: number) => {
    setSelectedPlateIndex(index);
    setSelectedPinIndex(0);
    setZoom(1);
  };

  const handleSelectPin = (pinIndex: number) => {
    setSelectedPinIndex(pinIndex);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.35, 3.2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.35, 0.8));
  const handleResetZoom = () => setZoom(1);

  const GenealogyTreeNodeView = ({ node, depth = 0 }: { node: GenealogyNode; depth?: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isChrist = node.id === 'jesus';

    return (
      <div className={`space-y-1.5 ${depth > 0 ? 'ml-3 sm:ml-5 border-l-2 pl-2.5 sm:pl-3.5 my-1.5' : ''}`} style={{ borderColor: theme.accentBorder }}>
        <div
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all ${hasChildren ? 'cursor-pointer hover:scale-[1.01]' : ''} ${
            isChrist ? 'ring-2' : ''
          }`}
          style={{
            backgroundColor: isChrist ? theme.accentBg : theme.card,
            borderColor: isChrist ? theme.accent : theme.cardBorder,
            boxShadow: isChrist ? `0 0 0 2px ${theme.accent}` : undefined,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: isChrist ? theme.accent : theme.textMuted }}
              />
              <span className={`font-serif-scripture ${isChrist ? 'font-bold text-sm sm:text-base text-amber-500' : 'font-semibold text-xs sm:text-sm'}`} style={{ color: isChrist ? theme.accent : theme.text }}>
                {language === 'es' ? node.nameEs : node.nameEn}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium" style={{ backgroundColor: theme.cardVariant, color: theme.accent }}>
              {language === 'es' ? node.eraEs : node.eraEn}
            </span>
          </div>

          <p className="text-[11px] mt-1 leading-snug" style={{ color: theme.textSecondary }}>
            {language === 'es' ? node.roleEs : node.roleEn}
          </p>

          <div className="flex items-center justify-between mt-1 text-[10px]" style={{ color: theme.textMuted }}>
            <span className="font-serif-scripture italic font-medium" style={{ color: theme.accent }}>
              {node.scriptures}
            </span>
            {hasChildren && (
              <span className="text-[10px] font-semibold underline" style={{ color: theme.textMuted }}>
                {isExpanded ? (language === 'es' ? 'Ocultar rama' : 'Collapse') : (language === 'es' ? 'Ver descendientes' : 'Expand')}
              </span>
            )}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="space-y-1.5">
            {node.children.map((child) => (
              <GenealogyTreeNodeView key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-28 max-w-4xl mx-auto">
      {/* Top Header Bar with Liquid Glass */}
      <div
        className="rounded-3xl p-4 sm:p-5 border shadow-xl flex items-center justify-between backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
              color: theme.accent,
            }}
            aria-label={language === 'es' ? 'Volver' : 'Go back'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h3 className="font-serif-scripture font-bold text-base sm:text-lg" style={{ color: theme.text }}>
              {language === 'es' ? 'Atlas Bíblico y Lugares Sagrados' : 'Biblical Atlas & Sacred Sites'}
            </h3>
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: theme.accent }}>
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'es' ? currentPlate.chronologyRangeEs : currentPlate.chronologyRangeEn}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setZoom(1);
            setShowFullscreen(true);
          }}
          className="p-2 sm:p-2.5 rounded-2xl border transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
          style={{
            backgroundColor: theme.cardVariant,
            borderColor: theme.cardBorder,
            color: theme.accent,
          }}
          title={language === 'es' ? 'Pantalla completa y zoom' : 'Fullscreen & zoom'}
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'es' ? 'Zoom' : 'Zoom'}</span>
        </button>
      </div>

      {/* Plates Tabs in Liquid Glass */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {plates.map((plate, index) => {
          const isSelected = selectedPlateIndex === index;
          return (
            <button
              key={plate.id}
              onClick={() => handleSelectPlate(index)}
              className="px-3.5 py-2 text-xs font-semibold rounded-2xl border transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-95 flex items-center gap-1.5"
              style={{
                backgroundColor: isSelected ? theme.accent : theme.cardVariant,
                borderColor: isSelected ? theme.accent : theme.cardBorder,
                color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent }} />
              {language === 'es' ? plate.titleEs : plate.titleEn}
            </button>
          );
        })}
      </div>

      {/* Plate Header Info Card */}
      <div
        className="rounded-2xl p-3.5 sm:p-4 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.accent,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              {language === 'es' ? currentPlate.titleEs : currentPlate.titleEn}
            </span>
            <span className="text-[11px] font-mono font-semibold" style={{ color: theme.accent }}>
              {language === 'es' ? currentPlate.chronologyRangeEs : currentPlate.chronologyRangeEn}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
            {language === 'es' ? currentPlate.subtitleEs : currentPlate.subtitleEn}
          </p>
        </div>

        {/* Genealogy View Mode Toggle when plate is genealogy */}
        {currentPlate.id === 'genealogy' && (
          <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setGenealogyViewMode('map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                genealogyViewMode === 'map' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: genealogyViewMode === 'map' ? theme.accent : 'transparent',
                color: genealogyViewMode === 'map' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Puntos en Lámina' : 'Visual Pins'}</span>
            </button>
            <button
              onClick={() => setGenealogyViewMode('tree')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                genealogyViewMode === 'tree' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: genealogyViewMode === 'tree' ? theme.accent : 'transparent',
                color: genealogyViewMode === 'tree' ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.text,
              }}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Árbol Dinámico' : 'Dynamic Tree'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Plate Container: Map or Tree */}
      {currentPlate.id === 'genealogy' && genealogyViewMode === 'tree' ? (
        <div
          className="rounded-3xl border p-4 sm:p-5 shadow-xl backdrop-blur-2xl liquid-glass"
          style={{
            backgroundColor: theme.isDark ? 'rgba(10, 15, 29, 0.78)' : 'rgba(247, 242, 232, 0.85)',
            borderColor: theme.cardBorder,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b mb-3" style={{ borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" style={{ color: theme.accent }} />
              <h4 className="font-serif-scripture font-bold text-sm sm:text-base" style={{ color: theme.text }}>
                {language === 'es' ? 'Árbol Genealógico Interactivo de Jesús' : 'Interactive Genealogy Tree of Jesus'}
              </h4>
            </div>
            <span className="text-[11px] font-serif-scripture italic" style={{ color: theme.accent }}>
              Mateo 1:1-17 / Lucas 3:23-38
            </span>
          </div>

          <div className="max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            <GenealogyTreeNodeView node={GENEALOGY_TREE_DATA} />
          </div>
        </div>
      ) : (
        /* Visual Interactive Map Plate with Pins */
        <div
          className="rounded-3xl border p-4 sm:p-5 shadow-xl relative overflow-hidden flex flex-col justify-between backdrop-blur-2xl liquid-glass"
          style={{
            backgroundColor: theme.isDark ? 'rgba(10, 15, 29, 0.78)' : 'rgba(247, 242, 232, 0.75)',
            borderColor: theme.cardBorder,
            minHeight: '340px',
          }}
        >
          {/* Subtle decorative grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, ${theme.accent} 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Plate Title Badge */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1"
              style={{
                backgroundColor: theme.accentBg,
                color: theme.accent,
                border: `1px solid ${theme.accentBorder}`,
              }}
            >
              <MapPin className="w-3 h-3" />
              {currentPlate.pins.length} {language === 'es' ? 'Hitos documentados en orden' : 'Documented historical milestones'}
            </span>
            <span className="text-[10px] font-serif-scripture italic flex items-center gap-1" style={{ color: theme.accent }}>
              <Compass className="w-3.5 h-3.5" />
              {language === 'es' ? 'Norte • Oriente' : 'North • East'}
            </span>
          </div>

          {/* Hotspots Visual Positioning */}
          <div className="relative z-10 my-6 h-56 sm:h-72 w-full rounded-2xl overflow-hidden border shadow-inner" style={{ borderColor: theme.cardBorder }}>
            <img
              src={currentPlate.imageUrl}
              className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-300"
              alt={language === 'es' ? currentPlate.titleEs : currentPlate.titleEn}
            />

            {/* Pins overlaid accurately on the map */}
            {currentPlate.pins &&
              currentPlate.pins.map((pin, i) => {
                const isActive = selectedPinIndex === i;
                return (
                  <div
                    key={pin.num}
                    onClick={() => handleSelectPin(i)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 flex items-center gap-1.5"
                    style={{
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                    }}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-xl transition-all ${
                        isActive ? 'ring-4 scale-110 animate-pulse' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? theme.accent : theme.card,
                        borderColor: theme.accent,
                        borderWidth: '2.5px',
                        color: isActive ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                        boxShadow: isActive ? `0 0 0 4px ${theme.accent}66` : undefined,
                      }}
                    >
                      {pin.num}
                    </div>
                    {isActive && (
                      <span
                        className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap backdrop-blur-md hidden sm:inline-block"
                        style={{
                          backgroundColor: theme.card,
                          color: theme.accent,
                          border: `1.5px solid ${theme.accentBorder}`,
                        }}
                      >
                        {language === 'es' ? pin.nameEs : pin.nameEn}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Selected Hotspot Bottom Active Banner */}
          {activePin && (
            <div
              className="relative z-10 p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs shadow-md"
              style={{
                backgroundColor: theme.card,
                borderColor: theme.accentBorder,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.isDark ? '#000000' : '#FFFFFF',
                  }}
                >
                  {activePin.num}
                </span>
                <span className="font-bold text-xs sm:text-sm" style={{ color: theme.text }}>
                  {language === 'es' ? activePin.nameEs : activePin.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] pl-8 sm:pl-0">
                <span className="font-mono font-medium px-2 py-0.5 rounded" style={{ backgroundColor: theme.cardVariant, color: theme.accent }}>
                  {language === 'es' ? activePin.eraEs : activePin.eraEn}
                </span>
                <span className="font-serif-scripture italic font-semibold" style={{ color: theme.accent }}>
                  {activePin.scriptures}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sequential Hotspots Selector Chips */}
      {currentPlate.pins && currentPlate.pins.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.accent }}>
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Itinerario y estaciones en orden cronológico:' : 'Chronological stations & milestones:'}</span>
            </p>
            <span className="text-[11px]" style={{ color: theme.textMuted }}>
              {selectedPinIndex + 1} / {currentPlate.pins.length}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {currentPlate.pins.map((pin, i) => {
              const isSelected = selectedPinIndex === i;
              return (
                <button
                  key={pin.num}
                  onClick={() => handleSelectPin(i)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 shadow-sm"
                  style={{
                    backgroundColor: isSelected ? theme.accentBg : theme.cardVariant,
                    borderColor: isSelected ? theme.accent : theme.cardBorder,
                    color: isSelected ? theme.accent : theme.textMuted,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: isSelected ? theme.accent : theme.cardBorder,
                      color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted,
                    }}
                  >
                    {pin.num}
                  </span>
                  <span>{language === 'es' ? pin.nameEs : pin.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Exegetical Detail Card */}
      {activePin && (
        <div
          className="rounded-3xl p-5 sm:p-6 border shadow-lg space-y-4"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          }}
        >
          {/* Title & Linguistic Background */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: theme.cardBorder }}>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
                >
                  {activePin.num}
                </span>
                <h4 className="font-serif-scripture font-bold text-lg sm:text-xl" style={{ color: theme.text }}>
                  {language === 'es' ? activePin.nameEs : activePin.nameEn}
                </h4>
              </div>
              <p className="text-xs font-serif-scripture italic mt-1" style={{ color: theme.accent }}>
                {activePin.original}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: theme.accentBg, color: theme.accent, border: `1px solid ${theme.accentBorder}` }}
              >
                {language === 'es' ? activePin.eraEs : activePin.eraEn}
              </span>
              <span
                className="text-[11px] font-serif-scripture italic font-bold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: theme.cardVariant, color: theme.text, border: `1px solid ${theme.cardBorder}` }}
              >
                {activePin.scriptures}
              </span>
            </div>
          </div>

          {/* Archaeological & Geographical Specs */}
          <div
            className="p-3.5 rounded-2xl border text-xs space-y-1.5"
            style={{
              backgroundColor: theme.cardVariant,
              borderColor: theme.cardBorder,
            }}
          >
            <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]" style={{ color: theme.accent }}>
              <Compass className="w-3.5 h-3.5" />
              {language === 'es' ? 'Especificación geográfica, topográfica y arqueológica:' : 'Geographical, Topographical & Archaeological Data:'}
            </span>
            <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
              {activePin.coords}
            </p>
          </div>

          {/* Full Exegesis */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: theme.accent }}>
              <BookOpen className="w-3.5 h-3.5" />
              {language === 'es' ? 'Exégesis y contexto bíblico documental:' : 'Biblical Exegesis & Historical Context:'}
            </span>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.text }}>
              {activePin.exegesis}
            </p>
          </div>

          {/* Theological Meaning */}
          <div
            className="p-4 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: theme.accentBg,
              borderColor: theme.accentBorder,
            }}
          >
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: theme.accent }}>
              {language === 'es' ? 'Significado teológico y aplicación para la vida:' : 'Theological Significance & Spiritual Application:'}
            </span>
            <p className="text-xs sm:text-sm font-serif-scripture italic leading-relaxed" style={{ color: theme.text }}>
              {activePin.theology}
            </p>
          </div>
        </div>
      )}

      {/* Sources & Bibliography */}
      <div
        className="rounded-2xl p-4 border text-xs space-y-2"
        style={{
          backgroundColor: theme.cardVariant,
          borderColor: theme.cardBorder,
        }}
      >
        <div className="flex items-center gap-1.5 font-bold" style={{ color: theme.accent }}>
          <Info className="w-3.5 h-3.5" />
          <span>{language === 'es' ? 'Fuentes académicas, cartográficas y arqueológicas documentadas:' : 'Scholarly, Cartographical & Archaeological Sources:'}</span>
        </div>
        <ul className="space-y-1 pl-4 list-disc" style={{ color: theme.textMuted }}>
          {currentPlate.sources.map((src, idx) => (
            <li key={idx} className="leading-snug">
              {src}
            </li>
          ))}
        </ul>
      </div>

      {/* Fullscreen Interactive Zoom Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-4xl rounded-3xl border shadow-2xl flex flex-col h-[92vh] overflow-hidden"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              color: theme.text,
            }}
          >
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: theme.cardBorder }}>
              <div className="pr-2">
                <h3 className="font-serif-scripture font-bold text-base sm:text-lg" style={{ color: theme.text }}>
                  {language === 'es' ? currentPlate.titleEs : currentPlate.titleEn}
                </h3>
                <p className="text-xs font-mono font-medium" style={{ color: theme.accent }}>
                  {language === 'es' ? currentPlate.chronologyRangeEs : currentPlate.chronologyRangeEn}
                </p>
              </div>

              {/* Zoom Controls & Close */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder, color: theme.accent }}
                  title={language === 'es' ? 'Acercar (+)' : 'Zoom in (+)'}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder, color: theme.accent }}
                  title={language === 'es' ? 'Alejar (-)' : 'Zoom out (-)'}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder, color: theme.accent }}
                  title={language === 'es' ? 'Restablecer 100%' : 'Reset 100%'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-6 mx-1" style={{ backgroundColor: theme.cardBorder }} />
                <button
                  onClick={() => {
                    setShowFullscreen(false);
                    setZoom(1);
                  }}
                  className="p-2 rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: theme.accent, borderColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
                  title={language === 'es' ? 'Cerrar (X)' : 'Close (X)'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable & Zoomable Canvas with Pins */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/20 relative">
              <div
                className="relative transition-transform duration-200 origin-center max-w-full"
                style={{ transform: `scale(${zoom})` }}
              >
                <img
                  src={currentPlate.imageUrl}
                  alt={language === 'es' ? currentPlate.titleEs : currentPlate.titleEn}
                  className="rounded-2xl max-h-[65vh] w-auto shadow-2xl object-contain pointer-events-none select-none"
                />

                {/* Interactive pins in Fullscreen */}
                {currentPlate.pins &&
                  currentPlate.pins.map((pin, i) => {
                    const isActive = selectedPinIndex === i;
                    return (
                      <div
                        key={pin.num}
                        onClick={() => handleSelectPin(i)}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-30 flex items-center gap-1"
                        style={{
                          left: `${pin.x}%`,
                          top: `${pin.y}%`,
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-2xl"
                          style={{
                            backgroundColor: isActive ? theme.accent : theme.card,
                            borderColor: theme.accent,
                            borderWidth: '2px',
                            color: isActive ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.accent,
                          }}
                        >
                          {pin.num}
                        </div>
                        {isActive && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg backdrop-blur-md whitespace-nowrap"
                            style={{
                              backgroundColor: theme.card,
                              color: theme.accent,
                              border: `1px solid ${theme.accentBorder}`,
                            }}
                          >
                            {language === 'es' ? pin.nameEs : pin.nameEn}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Modal Footer Banner with active pin */}
            {activePin && (
              <div className="p-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs flex-shrink-0" style={{ backgroundColor: theme.cardVariant, borderColor: theme.cardBorder }}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}>
                    {activePin.num}
                  </span>
                  <span className="font-bold">{language === 'es' ? activePin.nameEs : activePin.nameEn}</span>
                  <span className="italic opacity-80">({activePin.original})</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="font-mono font-medium">{language === 'es' ? activePin.eraEs : activePin.eraEn}</span>
                  <span className="font-serif-scripture italic font-semibold" style={{ color: theme.accent }}>{activePin.scriptures}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
