"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/mock-data";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from patients and doctors who trust MedCare for their healthcare needs.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 sm:p-12 border border-primary-100 shadow-xl relative"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-primary-200" />

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                  <Image
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-display font-bold text-xl text-gray-900">
                    {testimonials[current].name}
                  </h4>
                  <p className="text-primary-600 font-medium">
                    {testimonials[current].role}
                  </p>
                  <div className="flex gap-1 mt-2 justify-center sm:justify-start">
                    {Array.from({ length: testimonials[current].rating }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed text-center sm:text-left italic">
                &ldquo;{testimonials[current].content}&rdquo;
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-primary-600" : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
