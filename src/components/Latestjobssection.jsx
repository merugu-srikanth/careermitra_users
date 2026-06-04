import { Link } from "react-router-dom";
import JobCard from "./Jobcard";
import AnimatedSection from "./Animatedsection";
import { STATIC_JOBS } from "../data/staticJobs";

const ArrowRightIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const topJobCategories = [
  "SSC Jobs 2026",
  "Bank Jobs 2026",
  "Railway Jobs 2026",
  "Defence Jobs 2026",
  "Police Jobs 2026",
];

export default function LatestJobsSection() {
  // Only show status === 0, pick first 6
  const featuredJobs = STATIC_JOBS.filter((j) => j.status === 0).slice(0, 6);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-orange-100">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Updated Daily
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Latest{" "}
              <span className="bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                Govt Jobs
              </span>
            </h2>
            <div className="w-24 h-1.5 rounded-full mx-auto mb-6 bg-gradient-to-r from-orange-500 to-green-500" />
            <p className="text-gray-500 max-w-md mx-auto text-base font-medium">
              Recently announced opportunities across various government sectors in India.
            </p>
          </div>
        </AnimatedSection>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {topJobCategories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-extrabold text-sm whitespace-nowrap hover:bg-orange-100 transition-colors duration-200 cursor-default"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Jobs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredJobs.map((job, i) => (
            <AnimatedSection key={job.id} animation="fade-up" delay={i * 60}>
              <div className="h-full">
                <JobCard
                  title={job.title}
                  org={job.org}
                  lastDate={job.lastDate}
                  location={job.location}
                  applyLink={job.applyLink}
                  noOfPosts={job.noOfPosts}
                  age={job.age}
                  qualifications={job.qualifications}
                  category={job.category}
                />
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-orange-400 text-orange-600 font-extrabold text-sm hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-200"
          >
            View All {STATIC_JOBS.filter((j) => j.status === 0).length} Opportunities <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}