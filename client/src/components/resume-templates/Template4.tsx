import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

const Template4 = ({ resumeData }: { resumeData: ResumeDataResponse }) => {
  return (
    <div>
      <div className="flex">
        <div className="w-1/3 bg-purple-100 p-6">
          <h1 className="text-2xl font-bold text-purple-800 mb-4">
            {resumeData.full_name}
          </h1>
          <div className="space-y-2 text-sm text-purple-700 mb-6">
            {resumeData.location && (
              <div>
                <FaMapMarkerAlt className="inline mr-1" />
                {resumeData.location}
              </div>
            )}
            {resumeData.phone && (
              <div>
                <FaPhone className="inline mr-1" />
                {resumeData.phone}
              </div>
            )}
            {resumeData.contact_email && (
              <div>
                <FaEnvelope className="inline mr-1" />
                {resumeData.contact_email}
              </div>
            )}
            {resumeData.linkedin_url && (
              <div>
                <FaLinkedin className="inline mr-1" />
                <a
                  href={resumeData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            )}
            {resumeData.website_url && (
              <div>
                <FaGlobe className="inline mr-1" />
                <a
                  href={resumeData.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </div>
            )}
          </div>
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-purple-800 mb-2">Skills</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                {resumeData.skills.map((skill) => (
                  <li key={skill.id}>• {skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="w-2/3 p-6">
          {/* Summary Section */}
          {resumeData.summary && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3">Summary</h2>
              <p className=" leading-relaxed">{resumeData.summary}</p>
            </section>
          )}

          {/* Experience Section */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3">Experience</h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <p className="text-purple-600 font-medium mb-1">
                      {exp.company}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </p>
                    <p className=" leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xl font-bold mb-3">Education</h2>
              <div className="space-y-3">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.degree} in {edu.field_of_study}
                    </h3>
                    <p className="text-gray-600">
                      {edu.school} • {formatDate(edu.start_date)} -{" "}
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Projects</h2>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-text mb-1 inline-block"
                      >
                        View Project
                      </a>
                    )}
                    <p className=" leading-relaxed mb-1">
                      {project.description}
                    </p>
                    {project.technologies && (
                      <p className="text-sm">
                        Technologies: {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Template4;
