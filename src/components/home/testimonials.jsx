import Image from 'next/image';
import { FiStar, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useState } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'Tech Solutions Inc.',
      avatar: '/images/testimonials/avatar-1.jpg',
      quote: 'The Web Development course was exactly what I needed to take my skills to the next level. The instructors were knowledgeable and the projects were challenging but rewarding.',
      stars: 5
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      company: 'Data Insights Co.',
      avatar: '/images/testimonials/avatar-2.jpg',
      quote: 'I completed the Data Science certification and immediately saw opportunities open up. The curriculum was comprehensive and the hands-on projects gave me practical experience I could showcase.',
      stars: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'Creative Digital',
      avatar: '/images/testimonials/avatar-3.jpg',
      quote: 'The UX/UI Design course helped me transition from graphic design to UX. Within three months of completing the certification, I landed my dream job at a top agency.',
      stars: 4
    }
  ];

  // Navigation handlers
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Renders stars based on rating
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar 
        key={i} 
        className={`${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} h-5 w-5`} 
      />
    ));
  };

  return (
    <section className="py-24 bg-slate-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="container-custom relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Don't just take our word for it. Here's what our graduates have accomplished after earning their certifications.
          </p>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm mr-4">
                  <Image 
                    src={testimonial.avatar || 'https://via.placeholder.com/56?text=User'} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                  <p className="text-sm text-slate-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              
              <div className="mb-4 flex">
                {renderStars(testimonial.stars)}
              </div>
              
              <p className="text-slate-700 leading-relaxed">"{testimonial.quote}"</p>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Read full story</span>
                    <FiArrowRight className="ml-1" size={14} />
                  </div>
                  <div className="text-sm text-slate-400">
                    {testimonial.stars}/5 rating
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile carousel */}
        <div className="md:hidden">
          <div 
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center mb-6">
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm mr-4">
                <Image 
                  src={testimonials[activeIndex].avatar || 'https://via.placeholder.com/56?text=User'} 
                  alt={testimonials[activeIndex].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{testimonials[activeIndex].name}</h3>
                <p className="text-sm text-slate-500">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</p>
              </div>
            </div>
            
            <div className="mb-4 flex">
              {renderStars(testimonials[activeIndex].stars)}
            </div>
            
            <p className="text-slate-700 leading-relaxed">"{testimonials[activeIndex].quote}"</p>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Read full story</span>
                  <FiArrowRight className="ml-1" size={14} />
                </div>
                <div className="text-sm text-slate-400">
                  {testimonials[activeIndex].stars}/5 rating
                </div>
              </div>
            </div>
          </div>
          
          {/* Carousel controls */}
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
            >
              <FiArrowLeft size={20} />
            </button>
            
            <div className="text-center">
              <span className="text-slate-700 font-medium">{activeIndex + 1}</span>
              <span className="text-slate-400"> / {testimonials.length}</span>
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
            >
              <FiArrowRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Brands using our platform */}
        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">Trusted by professionals from top companies</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <div className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src="/images/brands/google.svg" alt="Google" className="h-full" />
            </div>
            <div className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src="/images/brands/microsoft.svg" alt="Microsoft" className="h-full" />
            </div>
            <div className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src="/images/brands/amazon.svg" alt="Amazon" className="h-full" />
            </div>
            <div className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src="/images/brands/netflix.svg" alt="Netflix" className="h-full" />
            </div>
            <div className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src="/images/brands/meta.svg" alt="Meta" className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 