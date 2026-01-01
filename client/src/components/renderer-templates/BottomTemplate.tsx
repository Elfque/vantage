import { View, Text, StyleSheet, Link } from "@react-pdf/renderer";
import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },

  item: {
    marginBottom: 16,
  },

  title: {
    fontSize: 13,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 11,
    fontWeight: "medium",
    marginBottom: 4,
  },

  date: {
    fontSize: 10,
    marginBottom: 6,
    color: "#555",
  },

  paragraph: {
    lineHeight: 1.5,
  },

  link: {
    color: "#2563EB",
    textDecoration: "underline",
    marginBottom: 6,
  },

  skillsText: {
    lineHeight: 1.6,
  },

  technologies: {
    fontSize: 10,
    marginTop: 4,
  },
});

const BottomTemplatePDF = ({
  resumeData,
}: {
  resumeData: ResumeDataResponse;
}) => {
  return (
    <View>
      {/* Summary */}
      {resumeData.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.paragraph}>{resumeData.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {resumeData.experience?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {resumeData.experience.map((exp, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.title}>{exp.position}</Text>
              <Text style={styles.subtitle}>{exp.company}</Text>
              <Text style={styles.date}>
                {formatDate(exp.start_date)} –{" "}
                {exp.end_date ? formatDate(exp.end_date) : "Present"}
              </Text>
              <Text style={styles.paragraph}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {resumeData.education?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {resumeData.education.map((edu, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.title}>
                {edu.degree} in {edu.field_of_study}
              </Text>
              <Text style={styles.subtitle}>{edu.school}</Text>
              <Text style={styles.date}>
                {formatDate(edu.start_date)} – {formatDate(edu.graduation_date)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skillsText}>
            {resumeData.skills.map((skill) => skill.name).join(", ")}
          </Text>
        </View>
      )}

      {/* Projects */}
      {resumeData.projects?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resumeData.projects.map((project, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.title}>{project.title}</Text>

              {project.link && (
                <Link style={styles.link} src={project.link}>
                  View Project →
                </Link>
              )}

              <Text style={styles.paragraph}>{project.description}</Text>

              {project.technologies && (
                <Text style={styles.technologies}>
                  <Text style={{ fontWeight: "bold" }}>Technologies:</Text>{" "}
                  {project.technologies}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default BottomTemplatePDF;
