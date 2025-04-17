import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Advance Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers with our industry-recognized certifications.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/courses" 
              className="px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-lg flex items-center"
            >
              Browse Courses <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              href="/signup" 
              className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white/10 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA; 