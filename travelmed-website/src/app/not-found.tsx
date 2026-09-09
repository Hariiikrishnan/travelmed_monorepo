'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { ShieldAlert, Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 py-20 font-sans">
      <div className="max-w-md mx-auto px-4 text-center">
        
        <Card hoverEffect={false} className="p-8 md:p-12 border-border bg-card shadow-lg space-y-6">
          
          <div className="flex justify-center">
            <div className="p-4 bg-primary-light text-primary rounded-full animate-spin-slow">
              <Compass className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="warning">404 Error</Badge>
            <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight">Route Lost</h1>
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">
              You have wandered off the safety trail. The page you are looking for does not exist or has been relocated.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/">
              <Button variant="primary" fullWidth size="md">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Safety</span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" fullWidth size="md">
                <span>Contact Support</span>
              </Button>
            </Link>
          </div>

        </Card>

      </div>
    </div>
  );
}
