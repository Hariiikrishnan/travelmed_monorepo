'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ShieldCheck, HeartPulse, Plane, CheckCircle } from 'lucide-react';
import { heroText, heroSubtitle, heroActions, heroVisual, floatingMedium } from '@/shared/animations';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-primary-light/40 to-transparent dark:from-primary-dark/10 font-sans">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] -z-1" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[80px] -z-1" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              variants={heroSubtitle}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2"
            >
              <Badge variant="primary" className="px-3 py-1 flex items-center gap-1">
                <Plane className="h-3.5 w-3.5" />
                <span>TSA-Compliant Carry-On Medicine</span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={heroText}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading"
            >
              Your Health. <br />
              Your Journey. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Always Protected.
              </span>
            </motion.h1>

            <motion.p
              variants={heroSubtitle}
              initial="hidden"
              animate="visible"
              className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base leading-relaxed max-w-lg"
            >
              Meet the next-generation travel medical kit. 40+ clinical-grade, color-coded medications mapped to symptoms, combined with instant video access to certified doctors worldwide.
            </motion.p>

            <motion.div
              variants={heroActions}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link href="/buy">
                <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-primary/20">
                  Configure Your Kit
                </Button>
              </Link>
            </motion.div>

            {/* Quick checks */}
            <motion.div
              variants={heroActions}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 pt-6 text-xs md:text-sm text-neutral-600 dark:text-neutral-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-accent" />
                <span>Global Teleconsult</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-accent" />
                <span>FDA/USP Certified Supplies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-accent" />
                <span>Next-Day US & EU Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4.5 w-4.5 text-accent" />
                <span>Waterproof Shell Pouch</span>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Column (Floating interactive CSS medical kit) */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              variants={heroVisual}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-[450px] aspect-square flex items-center justify-center"
            >
              {/* Levitating device wrapper */}
              <motion.div
                variants={floatingMedium}
                animate="animate"
                className="relative z-1 cursor-grab active:cursor-grabbing group"
              >
                {/* Simulated Pouch */}
                <div className="relative w-72 h-80 bg-neutral-900 border-4 border-neutral-800 rounded-[36px] shadow-2xl flex flex-col justify-between p-8 overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-primary/10">
                  
                  {/* Subtle highlights */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  {/* Pouch Logo */}
                  <div className="flex items-center justify-between">
                    <HeartPulse className="h-10 w-10 text-primary" />
                    <span className="text-[10px] text-neutral-500 font-extrabold uppercase tracking-widest bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
                      TSA Compliant
                    </span>
                  </div>

                  {/* Medical Cross Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center -z-1 opacity-10">
                    <div className="w-36 h-36 border border-neutral-100 flex items-center justify-center rounded-full">
                      <div className="w-12 h-36 bg-neutral-100 absolute" />
                      <div className="w-36 h-12 bg-neutral-100 absolute" />
                    </div>
                  </div>

                  {/* Pouch Label */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white tracking-tight">TRAVEL MED</h3>
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                      Emergency & Pharmacy Pouch
                    </p>
                  </div>
                </div>

                {/* Floating Addon Badge 1 */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 p-3 bg-white dark:bg-neutral-800 shadow-lg rounded-2xl flex items-center gap-2 border border-border"
                >
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <div className="flex flex-col text-[10px]">
                    <span className="font-bold">Protected</span>
                    <span className="text-neutral-400 font-medium">195 Countries</span>
                  </div>
                </motion.div>

                {/* Floating Addon Badge 2 */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-4 p-3 bg-white dark:bg-neutral-800 shadow-lg rounded-2xl flex items-center gap-2 border border-border"
                >
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  <div className="flex flex-col text-[10px]">
                    <span className="font-bold">Doctor Online</span>
                    <span className="text-neutral-400 font-medium">Wait: &lt; 2m</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
