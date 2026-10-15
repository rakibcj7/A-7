import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

export function getBanglaDate(): string {
  const now = new Date();
  try {
    return format(now, "EEEE, d MMMM yyyy", { locale: bn });
  } catch {
          const bengaliMonths = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const bengaliDays = [
      'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
    ];
    const day = bengaliDays[now.getDay()];
    const date = now.getDate();
    const month = bengaliMonths[now.getMonth()];
    const year = now.getFullYear();
    return `${day}, ${date} ${month} ${year}`;
  }
}

export function getBanglaTime(): string {
  const now = new Date();
  const hours = now.getHours();
         const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
}