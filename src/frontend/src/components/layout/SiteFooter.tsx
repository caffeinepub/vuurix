import { SiX, SiInstagram, SiFacebook } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'vuurix-fashion';

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="vuurix-container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-widest">VUURIX</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contemporary fashion for the modern wardrobe.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>New Arrivals</li>
              <li>Collections</li>
              <li>Sale</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase">Follow Us</h4>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <SiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} VUURIX. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-3 w-3 fill-current" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

