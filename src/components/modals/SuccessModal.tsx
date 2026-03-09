'use client'

import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function SuccessModal({ isOpen, onClose, onContinue }: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle size={40} className="text-primary" />
                </div>

                {/* Header */}
                <h2 className="text-2xl font-bold text-white mb-3">
                    Inquiry Submitted!
                </h2>

                {/* Message */}
                <p className="text-secondary mb-8 leading-relaxed">
                    Your inquiry has been submitted successfully. Our team will contact you soon.
                </p>

                {/* Continue Button */}
                <button
                    onClick={onContinue}
                    className="w-full py-3 rounded-xl bg-primary text-black font-bold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                    Continue to Inventory
                    <ArrowRight size={16} />
                </button>

                {/* Close link */}
                <button
                    onClick={onClose}
                    className="mt-4 text-secondary text-sm hover:text-white transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
