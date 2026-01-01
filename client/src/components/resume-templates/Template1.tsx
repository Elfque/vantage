import { ResumeDataResponse } from "@/types/resume";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import { formatDate } from "@/utils/functions";

const Template1 = ({ resumeData }: { resumeData: ResumeDataResponse }) => {
  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">{resumeData.full_name}</h1>
        <div className="flex flex-wrap gap-4">
          {resumeData.location && (
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt />
              {resumeData.location}
            </div>
          )}
          {resumeData.phone && (
            <div className="flex items-center gap-1">
              <FaPhone />
              {resumeData.phone}
            </div>
          )}
          {resumeData.contact_email && (
            <div className="flex items-center gap-1">
              <FaEnvelope />
              {resumeData.contact_email}
            </div>
          )}
          {resumeData.linkedin_url && (
            <a
              href={resumeData.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <FaLinkedin />
              LinkedIn
            </a>
          )}
          {resumeData.website_url && (
            <a
              href={resumeData.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <FaGlobe />
              Website
            </a>
          )}
        </div>
      </div>

      <div className="space-y-8 px-8">
        {resumeData.summary && (
          <section>
            <h2
              className="text-2xl font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: "black" }}
            >
              Professional Summary
            </h2>
            <p className=" leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: "black" }}
            >
              Work Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="">
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <p className="link-text font-medium mb-2">{exp.company}</p>
                  <p className="mb-3">
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
          <section>
            <h2
              className="text-2xl font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: "black" }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="">
                  <h3 className="text-xl font-semibold">
                    {edu.degree} in {edu.field_of_study}
                  </h3>
                  <p className="font-medium mb-1">{edu.school}</p>
                  <p className="text-sm">
                    {formatDate(edu.start_date)} -{" "}
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
            <h2
              className="text-2xl font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: "black" }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-4">
              {resumeData.skills.map((skill) => skill.name).join(", ")}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <section>
            <h2
              className="text-2xl font-bold mb-4 border-b-2 pb-2"
              style={{ borderColor: "black" }}
            >
              Projects
            </h2>
            <div className="space-y-6">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-text mb-2 inline-block"
                    >
                      View Project →
                    </a>
                  )}
                  <p className=" leading-relaxed mb-2">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm">
                      <strong>Technologies:</strong> {project.technologies}
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

export default Template1;
