import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/919677335554"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-primary px-6 py-4 shadow-[0_0_20px_rgba(198,217,50,0.5)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(198,217,50,0.8)] active:scale-95 text-black font-bold group"
            aria-label="Contact on WhatsApp"
        >
            <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-12" />
            <span className="hidden md:inline">Inquire Now</span>
        </a>
    );
}
