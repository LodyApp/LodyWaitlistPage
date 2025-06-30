import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2026-01-01T00:00:00');
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        // Calculate months (approximate)
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
        const daysInRemainingTime = difference % (1000 * 60 * 60 * 24 * 30.44);
        const days = Math.floor(daysInRemainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ months, days, hours, minutes, seconds });
      } else {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.months, label: 'Months', color: 'from-lody-teal to-lody-aqua' },
    { value: timeLeft.days, label: 'Days', color: 'from-lody-aqua to-lody-mint' },
    { value: timeLeft.hours, label: 'Hours', color: 'from-lody-mint to-lody-cream' },
    { value: timeLeft.minutes, label: 'Minutes', color: 'from-lody-cream to-lody-teal' },
    { value: timeLeft.seconds, label: 'Seconds', color: 'from-lody-teal to-lody-aqua' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border-0 shadow-2xl">
        <CardContent className="p-6 sm:p-8 md:p-14">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 text-center w-full mb-2">
                Lody launches on January 1st, 2026
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-3 sm:gap-4 md:grid-cols-5">
            {timeUnits.map((unit, index) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`bg-gradient-to-br ${unit.color} rounded-md p-2 sm:p-3 md:p-4 shadow-lg max-w-[110px] mx-auto`}>
                  <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                    {unit.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[11px] sm:text-xs md:text-sm text-white/90 font-medium">
                    {unit.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Get ready for the sweetest way to learn languages!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CountdownTimer; 