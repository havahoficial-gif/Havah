import React from 'react';
import { Shield, X, Lock, FileText } from 'lucide-react';
import { Language } from '../types';
import { ThemeColors } from '../theme';

interface LegalModalProps {
  isOpen: boolean;
  language: Language;
  theme: ThemeColors;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  language,
  theme,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in ${
      theme.isDark ? 'bg-black/75' : 'bg-sky-950/20'
    }`}>
      <div
        className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl transition-all max-h-[85vh] flex flex-col relative overflow-hidden backdrop-blur-2xl liquid-glass"
        style={{
          backgroundColor: theme.glassCard,
          borderColor: theme.cardBorder,
          color: theme.text,
        }}
      >
        {/* Atmosphere */}
        {theme.isDark ? (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img src="/night-space.jpg" alt="Space" className="w-full h-full object-cover opacity-35 mix-blend-screen scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1021]/80 via-transparent to-[#0B1021]/90" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-sky-300/40 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-300/35 blur-3xl" />
          </div>
        )}

        <div className="relative z-10 flex flex-col max-h-[75vh]">
          <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: theme.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-md border"
                style={{ backgroundColor: theme.accentBg, borderColor: theme.accentBorder }}
              >
                <FileText className="w-5 h-5" style={{ color: theme.accent }} />
              </div>
              <div>
                <h3 className="font-serif-scripture font-bold text-base" style={{ color: theme.text }}>
                  {language === 'es' ? 'Términos y Política de Privacidad' : 'Terms & Privacy Policy'}
                </h3>
                <p className="text-[11px]" style={{ color: theme.accent }}>
                  {language === 'es' ? 'HAVAH • Cumplimiento legal App Store & Play Store' : 'App Store & Play Store Compliance'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-sky-100/50 dark:hover:bg-white/10 cursor-pointer"
              style={{ color: theme.textMuted }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs leading-relaxed font-sans" style={{ color: theme.textSecondary }}>
            <section className="space-y-1.5">
              <h4 className="font-bold text-sm" style={{ color: theme.text }}>
                {language === 'es' ? '1. Política de Privacidad y Protección de Datos' : '1. Privacy Policy'}
              </h4>
              <p>
                {language === 'es'
                  ? 'Tus diarios, peticiones de oración, audios y notas se guardan en tu propio dispositivo (almacenamiento local del navegador); HAVAH no los envía a sus servidores ni los vende. Si borras los datos del navegador, los perderás. Algunas funciones envían contenido a servicios de terceros para poder funcionar: el chat y la revisión de recursos de la comunidad envían el texto que escribes a Google (Gemini) para generar la respuesta; la lectura en voz alta envía el texto a un servicio de voz externo; y la app carga imágenes, vídeos y tipografías de terceros (Unsplash, Mixkit, Google Fonts), que pueden ver tu dirección IP. No escribas datos que no quieras compartir con esos servicios. HAVAH está pensada para personas de 14 años o más; si eres menor de 18, úsala con el conocimiento de tu madre, padre o tutor. Para pedir información o la eliminación de datos, escribe a havah.oficial@gmail.com.'
                  : 'Your journal entries, prayer requests, recordings and notes are saved on your own device (browser local storage); HAVAH does not send them to its servers or sell them. If you clear your browser data you will lose them. Some features send content to third-party services in order to work: the chat and the community resource review send the text you write to Google (Gemini) to generate the reply; read-aloud sends text to an external voice service; and the app loads images, videos and fonts from third parties (Unsplash, Mixkit, Google Fonts), which can see your IP address. Please do not write anything you would not want shared with those services. HAVAH is intended for people aged 14 and over; if you are under 18, please use it with the knowledge of a parent or guardian. To request information or deletion of data, write to havah.oficial@gmail.com.'}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-bold text-sm" style={{ color: theme.text }}>
                {language === 'es' ? '2. Naturaleza del Servicio y Mentoría Bíblica' : '2. Nature of Service & Biblical Mentorship'}
              </h4>
              <p>
                {language === 'es'
                  ? 'HAVAH es un espacio de fe y devoción basado en la Biblia. Las respuestas del chat las genera una inteligencia artificial, no una persona: pueden contener errores y no sustituyen a un pastor, médico, psicólogo ni abogado. Si estás en peligro o en crisis, llama a emergencias (112; en España también al 024; en EE. UU., al 988) o habla con una persona de confianza.'
                  : 'HAVAH is a faith and devotion space based on the Bible. Chat replies are generated by artificial intelligence, not by a person: they may contain mistakes and are not a substitute for a pastor, doctor, therapist or lawyer. If you are in danger or in crisis, call emergency services (112; in Spain also 024; in the US, 988) or talk to a trusted person.'}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-bold text-sm" style={{ color: theme.text }}>
                {language === 'es' ? '3. Términos de Uso y Comunidad' : '3. Terms of Use & Community'}
              </h4>
              <p>
                {language === 'es'
                  ? 'El espacio comunitario está pensado para el respeto, la intercesión y el aliento mutuo. Los recursos pasan por una revisión automática con IA, que puede equivocarse. Puedes reportar cualquier contenido inapropiado escribiendo a havah.oficial@gmail.com.'
                  : 'The community space is meant for respect, intercession and mutual encouragement. Resources go through an automatic AI review, which can make mistakes. You can report inappropriate content by writing to havah.oficial@gmail.com.'}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-bold text-sm" style={{ color: theme.text }}>
                {language === 'es' ? '4. Derechos de Autor y Traducciones Bíblicas' : '4. Scripture Copyright & Translations'}
              </h4>
              <p>
                {language === 'es'
                  ? 'Las citas bíblicas de HAVAH provienen de La Biblia en Español Sencillo (traducida y editada por Irma Flores, AudioBiblia.org; dominio público) y de la World English Bible (WEB, dominio público). Se usan con fines de estudio, reflexión y edificación personal.'
                  : 'Scripture quotations are taken from La Biblia en Español Sencillo (translated and edited by Irma Flores, AudioBiblia.org; public domain) and the World English Bible (WEB, public domain). Used for study, reflection and personal spiritual growth.'}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="font-bold text-sm" style={{ color: theme.text }}>
                {language === 'es' ? '5. Soporte y Contacto' : '5. Support & Contact Information'}
              </h4>
              <p>
                {language === 'es'
                  ? 'Para cualquier consulta de soporte, comentarios o para solicitar la eliminación de algún recurso de la comunidad, contáctanos en: havah.oficial@gmail.com'
                  : 'For support requests, feedback, or community moderation inquiries, please contact: havah.oficial@gmail.com'}
              </p>
            </section>
          </div>

          <div className="pt-3 border-t mt-3 flex justify-end" style={{ borderColor: theme.cardBorder }}>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              style={{ backgroundColor: theme.accent, color: theme.isDark ? '#000000' : '#FFFFFF' }}
            >
              {language === 'es' ? 'Entendido y de acuerdo' : 'Understood & Agreed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
