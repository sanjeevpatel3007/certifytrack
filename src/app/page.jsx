'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useBatchStore } from '@/store/batchStore';
import Footer from '@/components/Footer';
import Hero from '@/components/home/hero';
import Feature from '@/components/home/feature';
import Stats from '@/components/home/stats';
import Testimonials from '@/components/home/testimonials';
import CTA from '@/components/home/cta';

export default function HomePage() {
  // Auth state from Zustand
  const { user, isLoggedIn } = useAuthStore();
  
  // Batch state from Zustand
  const { fetchBatches, fetchEnrollments } = useBatchStore();
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchBatches();
      
      if (isLoggedIn && user?._id) {
        await fetchEnrollments(user._id);
      }
    };
    
    loadData();
  }, [fetchBatches, fetchEnrollments, isLoggedIn, user]);
  
  return (
    <div className="min-h-screen">
      <Hero />
      <Feature />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
