import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";

const BottomTemplate = ({ resumeData }: { resumeData: ResumeDataResponse }) => {
  return (
    <div className="space-y-8 px-8">
      <div>
        {resumeData.summary && (
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">
              Professional Summary
            </h2>
            <p className="leading-relaxed">{resumeData.summary}</p>
          </section>
        )}
      </div>

      <div>
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
                <div key={index}>
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <p className="font-medium mb-2 link-text">{exp.company}</p>
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
      </div>

      <div>
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
                <div key={index}>
                  <h3 className="text-xl font-semibold">
                    {edu.degree} in {edu.field_of_study}
                  </h3>
                  <p className="font-medium mb-1">{edu.school}</p>
                  <p className="">
                    {formatDate(edu.start_date)} -{" "}
                    {formatDate(edu.graduation_date)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div>
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
      </div>

      <div>
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
                <div key={index} className="">
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
    </div>
  );
};

export default BottomTemplate;
