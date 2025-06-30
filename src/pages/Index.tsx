import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Music, RefreshCw, TrendingUp, Mail, Heart, Globe, Sun, Moon, ChevronDown, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CountdownTimer from '@/components/CountdownTimer';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '../lib/supabase';

// Flag Scrollwheel Component
const FlagScrollwheel = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const flagSize = 160; // px, must match spacing below
  const flags = [
    '🇪🇸', '🇵🇱', '🇫🇷', '🇮🇹', '🇵🇹', '🇩🇪', '🇯🇵', '🇰🇷', '🇨🇳', '🇸🇦',
    '🇷🇺', '🇮🇳', '🇳🇱', '🇸🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇹🇷', '🇬🇷', '🇮🇱',
    '🇹🇭', '🇻🇳', '🇮🇩', '🇲🇾', '🇵🇭', '🇧🇷', '🇦🇷', '🇲🇽', '🇨🇦', '🇦🇺',
    '🇬🇧', '🇮🇪', '🇳🇿', '🇿🇦', '🇪🇬', '🇲🇦', '🇰🇪', '🇳🇬', '🇪🇹', '🇺🇬'
  ];

  // Set container width on mount and resize
  useEffect(() => {
    const updateWidth = () => setContainerWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate how many flags are needed to cover 2x the screen width
  const minFlags = Math.ceil((containerWidth * 2) / flagSize);
  const flagArray = Array.from({ length: minFlags }, (_, i) => flags[i % flags.length]);
  const totalScrollableWidth = flagArray.length * flagSize;

  // Looping scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => {
        const next = prev + 2;
        return next >= totalScrollableWidth / 2 ? 0 : next;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [totalScrollableWidth]);

  return (
    <div className="absolute left-0 top-1/2 w-full h-64 flex items-center -translate-y-1/2 z-0 opacity-40 pointer-events-none select-none overflow-hidden">
      <div className="w-full h-full flex items-center overflow-hidden">
        <div
          className="flex items-center transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {flagArray.concat(flagArray).map((flag, i) => {
            const center = scrollPosition + containerWidth / 2;
            const flagPos = i * flagSize;
            const dist = Math.abs(flagPos - center);
            const distWrapped = Math.abs(flagPos - center + totalScrollableWidth);
            const distWrappedNeg = Math.abs(flagPos - center - totalScrollableWidth);
            const minDist = Math.min(dist, distWrapped, distWrappedNeg);
            const highlightWidth = flagSize * 0.8; // narrower highlight
            const t = Math.pow(Math.max(0, 1 - minDist / highlightWidth), 2); // sharper falloff
            const scale = 1.0 + 0.2 * t; // from 1.0 to 1.2
            const opacity = 0.5 + 0.2 * t; // from 0.5 to 0.7
            return (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ scale, opacity }}
                transition={{ duration: 0.5 }}
                className="text-8xl md:text-9xl lg:text-[10rem] filter drop-shadow-lg flex-shrink-0"
                style={{ width: flagSize, marginRight: 32 }} // 32px gap
              >
                {flag}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetLanguages, setTargetLanguages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showThemeText, setShowThemeText] = useState(false);
  const [showThemePopup, setShowThemePopup] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme, resolvedTheme, cycleTheme, isLight, isDark, isTwlight } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showThemePopup && !target.closest('.theme-toggle-container')) {
        setShowThemePopup(false);
      }
    };

    if (showThemePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemePopup]);

  const languages = [
    { value: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'polish', label: 'Polish', flag: '🇵🇱' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'italian', label: 'Italian', flag: '🇮🇹' },
    { value: 'portuguese', label: 'Portuguese', flag: '🇵🇹' },
    { value: 'german', label: 'German', flag: '🇩🇪' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'korean', label: 'Korean', flag: '🇰🇷' },
    { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
    { value: 'arabic', label: 'Arabic', flag: '🇸🇦' },
    { value: 'russian', label: 'Russian', flag: '🇷🇺' },
    { value: 'hindi', label: 'Hindi', flag: '🇮🇳' },
    { value: 'dutch', label: 'Dutch', flag: '🇳🇱' },
    { value: 'swedish', label: 'Swedish', flag: '🇸🇪' },
    { value: 'norwegian', label: 'Norwegian', flag: '🇳🇴' },
    { value: 'danish', label: 'Danish', flag: '🇩🇰' },
    { value: 'finnish', label: 'Finnish', flag: '🇫🇮' },
    { value: 'turkish', label: 'Turkish', flag: '🇹🇷' },
    { value: 'greek', label: 'Greek', flag: '🇬🇷' },
    { value: 'hebrew', label: 'Hebrew', flag: '🇮🇱' },
    { value: 'thai', label: 'Thai', flag: '🇹🇭' },
    { value: 'vietnamese', label: 'Vietnamese', flag: '🇻🇳' },
    { value: 'indonesian', label: 'Indonesian', flag: '🇮🇩' },
    { value: 'malay', label: 'Malay', flag: '🇲🇾' },
    { value: 'filipino', label: 'Filipino', flag: '🇵🇭' },
    { value: 'other', label: 'Other', flag: '🌍' }
  ];

  const handleLanguageToggle = (languageValue: string) => {
    setTargetLanguages(prev => {
      if (prev.includes(languageValue)) {
        return prev.filter(lang => lang !== languageValue);
      } else if (prev.length < 2) {
        return [...prev, languageValue];
      } else {
        return prev; // cap at 2
      }
    });
  };

  const getSelectedLanguagesText = () => {
    if (targetLanguages.length === 0) return "Select languages";
    if (targetLanguages.length === 1) {
      const lang = languages.find(l => l.value === targetLanguages[0]);
      return `${lang?.label} ${lang?.flag}`;
    }
    return targetLanguages
      .map(val => {
        const lang = languages.find(l => l.value === val);
        return `${lang?.label} ${lang?.flag}`;
      })
      .join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Name required",
        description: "Please enter your name to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    if (targetLanguages.length === 0) {
      toast({
        title: "Language selection required",
        description: "Please select at least one language.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('waitlist').insert([
        {
          name,
          email,
          languages: targetLanguages,
          created_at: new Date().toISOString(),
        }
      ]);
      if (error) {
        toast({
          title: "Submission failed",
          description: error.message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "You've joined the waitlist.",
      });
      setName('');
      setEmail('');
      setTargetLanguages([]);
    } catch (err: any) {
      toast({
        title: "Submission error",
        description: err.message || 'An error occurred.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
    return;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const handleThemeClick = () => {
    setShowThemePopup(!showThemePopup);
  };

  const handleThemeSelect = (selectedTheme: 'light' | 'dark' | 'twlight') => {
    setTheme(selectedTheme);
    setShowThemePopup(false);
    // Show brief feedback
    setShowThemeText(true);
    setTimeout(() => setShowThemeText(false), 1500);
  };

  const getCurrentThemeText = () => {
    if (isDark) return 'Dark Mode';
    if (isTwlight) return 'Twlight Mode';
    return 'Light Mode';
  };

  const getCurrentThemeIcon = () => {
    if (isDark) return <Moon size={20} stroke="#222" strokeWidth="2" />;
    if (isTwlight) return <Sparkles size={20} stroke="#222" strokeWidth="2" />;
    return <Sun size={20} stroke="#222" strokeWidth="2" />;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="text-6xl mb-8 animate-float">🎉</div>
          <h1 className="font-josefin font-bold text-3xl text-gray-800 dark:text-gray-100 mb-4">
            You're in! 🎶
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Welcome to the Lody family! We'll send you updates as we get closer to launch.
          </p>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">Share with friends:</p>
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
              <input
                type="text"
                value="lody.app/waitlist?ref=your-code"
                readOnly
                className="flex-1 text-sm bg-transparent border-none outline-none dark:text-gray-100"
              />
              <Button size="sm" variant="outline">Copy</Button>
            </div>
          </div>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="font-josefin"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Theme Toggle Button with popup */}
      <div className="theme-toggle-container" style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeClick}
            className={`theme-toggle-button ${showThemeText ? 'sliding' : ''}`}
            style={{
              width: showThemeText ? 'auto' : 44,
              height: 44,
              borderRadius: showThemeText ? '22px' : '50%',
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              padding: showThemeText ? '0 16px' : '0',
              minWidth: showThemeText ? '120px' : '44px',
            }}
            aria-label="Toggle theme"
          >
            {showThemeText ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {getCurrentThemeIcon()}
                <span className="theme-toggle-text">
                  {getCurrentThemeText()}
                </span>
              </div>
            ) : (
              getCurrentThemeIcon()
            )}
          </button>
        </div>

        {/* Theme Popup */}
        {showThemePopup && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #ddd',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '8px',
              minWidth: '200px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => handleThemeSelect('light')}
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isLight ? 'rgba(67, 182, 161, 0.1)' : 'transparent',
                  color: isLight ? '#43B6A1' : '#333',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: isLight ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isLight) e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isLight) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ minWidth: 28, display: 'flex', justifyContent: 'center' }}>
                  <Sun size={18} stroke={isLight ? "#43B6A1" : "#666"} strokeWidth="2" />
                </span>
                <span style={{ flex: 1, textAlign: 'right', whiteSpace: 'nowrap' }}>Light Mode</span>
              </button>
              <button
                onClick={() => handleThemeSelect('dark')}
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isDark ? 'rgba(67, 182, 161, 0.1)' : 'transparent',
                  color: isDark ? '#43B6A1' : '#333',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: isDark ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isDark) e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isDark) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ minWidth: 28, display: 'flex', justifyContent: 'center' }}>
                  <Moon size={18} stroke={isDark ? "#43B6A1" : "#666"} strokeWidth="2" />
                </span>
                <span style={{ flex: 1, textAlign: 'right', whiteSpace: 'nowrap' }}>Dark Mode</span>
              </button>
              <button
                onClick={() => handleThemeSelect('twlight')}
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  width: '100%',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isTwlight ? 'rgba(67, 182, 161, 0.1)' : 'transparent',
                  color: isTwlight ? '#43B6A1' : '#333',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: isTwlight ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isTwlight) e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isTwlight) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ minWidth: 28, display: 'flex', justifyContent: 'center' }}>
                  <Sparkles size={18} stroke={isTwlight ? "#43B6A1" : "#666"} strokeWidth="2" />
                </span>
                <span style={{ flex: 1, textAlign: 'right', whiteSpace: 'nowrap' }}>Twlight Mode</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
      {/* Main content below */}
      <div className="min-h-screen bg-background text-foreground dark:bg-transparent font-josefin">
        {/* Hero + Countdown Section Combined */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative flex items-center justify-center pt-16 md:pt-24 pb-6 px-2 text-center"
        >
          {/* Flag Scrollwheel absolutely behind the welcome box */}
          <FlagScrollwheel />
          <div className="w-full max-w-4xl mx-auto flex flex-row items-center justify-center gap-8 relative z-10">
            {/* Welcome Box */}
            <div className="flex-1">
              <div className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700/40 rounded-2xl shadow-xl p-10 md:p-14 flex flex-col items-center justify-center text-center">
                <motion.div variants={itemVariants} className="mb-6 w-full">
                  <h1 className="text-foreground font-bold text-5xl md:text-7xl mb-6 leading-tight">
                    Welcome to{' '}
                    <span className={`bg-clip-text text-transparent animate-glow ${
                      mounted && isDark
                        ? 'bg-gradient-to-r from-[#43B6A1] via-[#B4E9DF] to-[#C7F0E2]'
                        : mounted && isTwlight
                        ? 'bg-gradient-to-r from-[#43B6A1] via-[#B4E9DF] to-[#C7F0E2]'
                        : 'bg-gradient-to-r from-[#2CA98A] via-[#43B6A1] to-[#6EDFC8]'
                    }`} style={{
                      filter: mounted && isTwlight 
                        ? 'drop-shadow(0 0 8px #43B6A1)' 
                        : mounted && isDark
                        ? 'drop-shadow(0 0 8px #43B6A1)'
                        : 'drop-shadow(0 0 8px #43B6A1)'
                    }}>
                      Lody!
                    </span>
                  </h1>
                  <p className="text-secondary-foreground text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                    Turn songs you love into words you'll remember.
                  </p>
                </motion.div>
                {/* Countdown Timer (inline, not as a separate section) */}
                <div className="w-full">
                  <CountdownTimer />
                </div>
                <motion.div variants={itemVariants} className="w-full flex justify-center mt-10">
                  <Button
                    size="lg"
                    className="font-josefin font-semibold text-lg px-8 py-4 bg-gradient-to-r from-lody-teal to-lody-aqua hover:from-lody-teal/90 hover:to-lody-aqua/90 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-1 active:scale-95 mx-auto"
                    onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get First Licks 🍦
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-24 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-foreground font-bold text-4xl md:text-5xl mb-8">
                You Don't Have to Be Abroad to Immerse Yourself.
              </h2>
              <p className="text-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                Lody brings the language to you — through real music you can listen to anytime, anywhere.
                Whether you're commuting, studying, or just relaxing, you'll pick up words, phrases, and cultural context without overthinking it.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-24 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 variants={itemVariants} className="text-foreground font-bold text-4xl md:text-5xl text-center mb-16">
              How Lody Works
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div variants={itemVariants}>
                <Card className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-lody-teal to-lody-aqua rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl leading-none mt-1">🎵</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 group-hover:text-lody-teal transition-colors duration-300">Learn Through Real Songs</h3>
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 font-medium">
                      Lody uses real music in your target language to expose you to the way people actually speak — naturally, emotionally, and in context.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-lody-aqua to-lody-mint rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl leading-none mt-1">🔁</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 group-hover:text-lody-aqua transition-colors duration-300">Track-Based Word Discovery</h3>
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 font-medium">
                      Each day, you'll learn ~10 high-impact words pulled from lyrics — not random vocab, but the most common words across multiple songs, so you see them again and again.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-lody-mint to-lody-cream rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-2xl leading-none mt-1">📈</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 group-hover:text-lody-mint transition-colors duration-300">Progress That Builds</h3>
                    <p className="text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 font-medium">
                      You don't start from scratch every day. Lody tracks what you've heard, what you've learned, and what shows up again — reinforcing the language as it appears naturally in the music you love.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Waitlist Form Section */}
        <motion.section
          id="waitlist"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-8 px-4"
        >
          <div className="max-w-lg mx-auto">
            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-0 shadow-xl rounded-xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-foreground font-bold text-4xl md:text-5xl mb-4">
                    Join the Waitlist
                  </h2>
                  <p className="text-foreground text-lg mb-0 pb-0">
                    Be the first to know when Lody launches. I am working very hard on this project and would love to share it with you when ready :)
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-0">
                    <Label htmlFor="name" className="text-foreground font-medium mt-0 pt-0">
                      Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-lody-teal focus:ring-lody-teal text-placeholder-foreground transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white dark:focus:bg-gray-700 focus:scale-[1.02] mt-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-lody-teal focus:ring-lody-teal text-placeholder-foreground transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-700/80 focus:bg-white dark:focus:bg-gray-700 focus:scale-[1.02]"
                        required
                      />
                    </div>
                    <p className="text-xs text-secondary-foreground mt-1">No spam. Unsubscribe at any time.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages" className="text-foreground font-medium">
                      Which languages are you interested in?
                    </Label>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex justify-between items-center bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600 focus:border-lody-teal focus:ring-lody-teal dark:text-gray-100 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-[1.02] focus:scale-[1.02]"
                        >
                          <span className="truncate text-left text-placeholder-foreground">{getSelectedLanguagesText()}</span>
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 max-h-64 overflow-y-auto p-2 bg-white dark:bg-gray-800">
                        {languages.map((language) => (
                          <div key={language.value} className="flex items-center px-2 py-1">
                            <Checkbox
                              checked={targetLanguages.includes(language.value)}
                              onCheckedChange={() => handleLanguageToggle(language.value)}
                              id={`language-${language.value}`}
                              className="mr-3"
                            />
                            <span className="flex items-center gap-2">
                              {language.label} {' '}{language.flag}
                            </span>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-secondary-foreground mt-1">You can select up to two languages.</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-josefin font-semibold bg-gradient-to-r from-lody-teal to-lody-aqua hover:from-lody-teal/90 hover:to-lody-aqua/90 transition-all duration-500 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed dark:!text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Joining...
                      </div>
                    ) : (
                      'Join the Waitlist 🎶'
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* YouTube Promo Section - now inside the footer, above copyright */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-16 px-4 text-center"
        >
          <motion.div variants={itemVariants}>
            <div className="max-w-lg mx-auto mb-4 text-center p-10 md:p-14 rounded-2xl shadow-xl bg-white/30 dark:bg-gray-800/40 backdrop-blur-lg border border-white/30 dark:border-gray-700/40 flex flex-col items-center justify-center">
              <p className="text-foreground text-lg font-medium mb-3">
                Can't wait? Learn your favorite songs through our YouTube videos:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="https://www.youtube.com/@TheLodyApp?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-base bg-gradient-to-r from-lody-teal to-lody-aqua hover:from-lody-teal/90 hover:to-lody-aqua/90 transition-all duration-500 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Spanish Channel
                </a>
                <a
                  href="https://www.youtube.com/@TheLodyApp-Polish?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-base bg-gradient-to-r from-lody-teal to-lody-aqua hover:from-lody-teal/90 hover:to-lody-aqua/90 transition-all duration-500 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Polish Channel
                </a>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground">
              © 2025 Lody. All rights reserved.
            </p>
          </motion.div>
        </motion.footer>
      </div>
    </>
  );
};

export default Index;
