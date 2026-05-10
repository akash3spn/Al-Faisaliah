import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-provider';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 border border-border/50 rounded-full px-1 py-1 bg-background/50 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={`h-7 px-3 text-xs font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:text-primary text-muted-foreground'}`}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('ar')}
        className={`h-7 px-3 text-xs font-semibold rounded-full transition-colors ${language === 'ar' ? 'bg-primary text-primary-foreground' : 'hover:text-primary text-muted-foreground'}`}
      >
        AR
      </Button>
    </div>
  );
}
