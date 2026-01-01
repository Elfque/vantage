import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";

const Template3 = ({ resumeData }: { resumeData: ResumeDataResponse }) => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-light text-gray-800 mb-4">
          {resumeData.full_name}
        </h1>
        <div className="flex justify-center flex-wrap gap-6 text-gray-600 text-sm">
          {resumeData.location && <span>{resumeData.location}</span>}
          {resumeData.phone && <span>{resumeData.phone}</span>}
          {resumeData.contact_email && <span>{resumeData.contact_email}</span>}
          {resumeData.linkedin_url && (
            <a
              href={resumeData.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {resumeData.website_url && (
            <a
              href={resumeData.website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Summary Section */}
        {resumeData.summary && (
          <section>
            <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
              Summary
            </h2>
            <p className=" leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
              Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index}>
                  <h3 className="text-lg font-normal text-gray-900">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {exp.company} • {formatDate(exp.start_date)} -{" "}
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
            <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
              Education
            </h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-normal text-gray-900">
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

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
              Skills
            </h2>
            <p className="">
              {resumeData.skills.map((skill) => skill.name).join(", ")}
            </p>
          </section>
        )}

        {/* Projects Section */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <section>
            <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
              Projects
            </h2>
            <div className="space-y-6">
              {resumeData.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-lg font-normal text-gray-900">
                    {project.title}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 mb-2 inline-block"
                    >
                      Link
                    </a>
                  )}
                  <p className=" leading-relaxed mb-2">{project.description}</p>
                  {project.technologies && (
                    <p className="text-gray-600 text-sm">
                      {project.technologies}
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

export default Template3;
