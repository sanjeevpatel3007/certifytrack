import { FiBook, FiAward, FiUsers, FiLayers, FiCheck, FiTrendingUp } from 'react-icons/fi';

const Feature = () => {
  const features = [
    {
      icon: <FiBook className="h-8 w-8 text-blue-600" />,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of practical experience in their fields.'
    },
    {
      icon: <FiAward className="h-8 w-8 text-blue-600" />,
      title: 'Recognized Certifications',
      description: 'Earn certificates that are recognized by top companies and institutions worldwide.'
    },
    {
      icon: <FiUsers className="h-8 w-8 text-blue-600" />,
      title: 'Community Support',
      description: 'Join a community of learners and professionals to expand your network.'
    },
    {
      icon: <FiLayers className="h-8 w-8 text-blue-600" />,
      title: 'Structured Learning',
      description: 'Follow a well-designed curriculum that builds your skills step by step.'
    },
    {
      icon: <FiCheck className="h-8 w-8 text-blue-600" />,
      title: 'Self-Paced Learning',
      description: 'Learn at your own pace with lifetime access to course materials.'
    },
    {
      icon: <FiTrendingUp className="h-8 w-8 text-blue-600" />,
      title: 'Career Advancement',
      description: 'Boost your resume and open new opportunities in your professional journey.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CertifyTrack?
          </h2>
          <p className="text-xl text-gray-600">
            Our platform offers everything you need to advance your skills and career with industry-recognized certifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;