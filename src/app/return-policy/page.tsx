import Link from 'next/link';
import { ArrowLeft, Phone, MessageSquare } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-wu-red transition-colors mb-12 font-mono text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>

        <h1 className="font-display font-black text-5xl sm:text-7xl text-foreground tracking-tight mb-8">
          RETURN<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-wu-red to-[#ff4b4f]">POLICY</span>
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="font-body text-xl text-muted-foreground leading-relaxed mb-12">
            At WearUp, we strive for perfection in every wrap and accessory. However, we understand that issues can sometimes arise.
          </p>

          <div className="bg-card border border-border p-8 rounded-[2rem] mb-12">
            <h2 className="font-display font-bold text-2xl mb-4 text-foreground">How to resolve a problem?</h2>
            <p className="font-body text-muted-foreground mb-8">
              If you are not satisfied with your purchase or if there is any issue with the service provided, please reach out to us directly. We handle every concern personally to ensure the best possible resolution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="tel:+919093543071" 
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl hover:border-wu-red transition-all border border-transparent"
              >
                <div className="w-12 h-12 bg-wu-red/10 rounded-full flex items-center justify-center text-wu-red">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Call Us</p>
                  <p className="font-display font-bold">+91 90935 43071</p>
                </div>
              </a>

              <a 
                href="https://wa.me/916296396462" 
                className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl hover:border-wu-red transition-all border border-transparent"
              >
                <div className="w-12 h-12 bg-wu-red/10 rounded-full flex items-center justify-center text-wu-red">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">WhatsApp</p>
                  <p className="font-display font-bold">+91 62963 96462</p>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground font-body">
            <p>
              Since most of our products (Graphic Kits & Wraps) are custom-made for specific motorcycle models, we typically do not offer generic returns. However, if there is a manufacturing defect or a wrong item sent, we will replace it immediately at no extra cost.
            </p>
            <p>
              For accessories and merchandise, items must be in original condition with tags intact for any exchange requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
