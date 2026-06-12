"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { heroSlides } from "@/lib/mock-data";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="text-white z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Trusted by 10,000+ Patients</span>
            </motion.div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-xl text-primary-200 font-medium mb-3">
                  {slide.subtitle}
                </p>
                <p className="text-primary-100/80 text-lg mb-8 max-w-lg leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/auth/register?role=patient">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  {slide.cta}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login?role=doctor">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Doctor Portal
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10"
            >
              {[
                { value: "500+", label: "Doctors" },
                { value: "50K+", label: "Appointments" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-primary-200">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image Carousel - Paper style cards */}
          <div className="relative hidden lg:block h-[500px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, rotateY: direction > 0 ? 15 : -15, scale: 0.9 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: direction > 0 ? -15 : 15, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <div className="relative w-full h-full">
                  {/* Paper card layers */}
                  <div className="absolute top-4 left-4 right-0 bottom-0 bg-white/10 rounded-3xl transform rotate-3 backdrop-blur-sm" />
                  <div className="absolute top-2 left-2 right-2 bottom-2 bg-white/20 rounded-3xl transform -rotate-2 backdrop-blur-sm" />
                  <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                        <p className="text-sm text-gray-500">Featured Service</p>
                        <p className="font-semibold text-gray-900">{slide.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current ? "w-8 bg-white" : "w-2 bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
