import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

const Testimonials = () => {
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

  // Renders stars based on rating
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar 
        key={i} 
        className={`${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} h-5 w-5`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600">
            Don't just take our word for it. Here's what our graduates have accomplished after earning their certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4">
                  <Image 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              
              <div className="mb-4 flex">
                {renderStars(testimonial.stars)}
              </div>
              
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 