import { FiUsers, FiAward, FiBriefcase, FiGlobe } from 'react-icons/fi';

const Stats = () => {
  const stats = [
    {
      icon: <FiUsers className="h-8 w-8 text-blue-500" />,
      value: '15,000+',
      label: 'Active Students'
    },
    {
      icon: <FiAward className="h-8 w-8 text-blue-500" />,
      value: '200+',
      label: 'Certification Courses'
    },
    {
      icon: <FiBriefcase className="h-8 w-8 text-blue-500" />,
      value: '92%',
      label: 'Job Placement Rate'
    },
    {
      icon: <FiGlobe className="h-8 w-8 text-blue-500" />,
      value: '50+',
      label: 'Countries Represented'
    }
  ];

  return (
    <section className="py-12 bg-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">
                {stat.value}
              </div>
              <p className="text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats; 