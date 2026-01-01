import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

const Template2 = ({ resumeData }: { resumeData: ResumeDataResponse }) => {
  return (
    <>
      <div className="bg-gray-100 mb-8 border-b-4 border-gray-400">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {resumeData.full_name}
        </h1>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
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
      </div>
      <div className="space-y-6">
        {/* Summary Section */}
        {resumeData.summary && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className=" leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Work Experience
            </h2>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600 font-medium mb-1">
                    {exp.company} | {formatDate(exp.start_date)} -{" "}
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
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-3">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.degree} in {edu.field_of_study}
                  </h3>
                  <p className="text-gray-600">
                    {edu.school} | {formatDate(edu.start_date)} -{" "}
                    {formatDate(edu.graduation_date)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Skills
            </h2>
            <p className="">
              {resumeData.skills.map((skill) => skill.name).join(" • ")}
            </p>
          </section>
        )}

        {/* Projects Section */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Projects
            </h2>
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
                      className="text-blue-600 mb-1 inline-block"
                    >
                      View Project
                    </a>
                  )}
                  <p className=" leading-relaxed mb-1">{project.description}</p>
                  {project.technologies && (
                    <p className="text-gray-600 text-sm">
                      Technologies: {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Template2;
