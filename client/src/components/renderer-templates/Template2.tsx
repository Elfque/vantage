import { Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    marginBottom: 20,
    borderBottom: "3 solid #9ca3af",
  },

  name: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
  },

  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 10,
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 8,
    color: "#1f2933",
  },

  jobTitle: {
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 2,
  },

  meta: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 4,
  },

  link: {
    color: "#2563eb",
    textDecoration: "underline",
    fontSize: 10,
  },

  skillText: {
    fontSize: 11,
  },

  projectTech: {
    fontSize: 10,
    color: "#4b5563",
  },
});

const Template2PDF = ({ resumeData }: { resumeData: ResumeDataResponse }) => (
  <View>
    {/* Header */}
    <View style={styles.header} wrap={false}>
      <Text style={styles.name}>{resumeData.full_name}</Text>

      <View style={styles.contactGrid}>
        {resumeData.location && <Text>{resumeData.location}</Text>}

        {resumeData.phone && (
          <Link src={`tel:${resumeData.phone}`}>
            <Text style={styles.link}>{resumeData.phone}</Text>
          </Link>
        )}

        {resumeData.contact_email && (
          <Link src={`mailto:${resumeData.contact_email}`}>
            <Text style={styles.link}>{resumeData.contact_email}</Text>
          </Link>
        )}

        {resumeData.linkedin_url && (
          <Link src={resumeData.linkedin_url}>
            <Text style={styles.link}>LinkedIn</Text>
          </Link>
        )}

        {resumeData.website_url && (
          <Link src={resumeData.website_url}>
            <Text style={styles.link}>Website</Text>
          </Link>
        )}
      </View>
    </View>

    {/* Summary */}
    {resumeData.summary && (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text>{resumeData.summary}</Text>
      </View>
    )}

    {/* Experience */}
    {resumeData.experience?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>

        {resumeData.experience.map((exp, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 12 }}>
            <Text style={styles.jobTitle}>{exp.position}</Text>
            <Text style={styles.meta}>
              {exp.company} | {formatDate(exp.start_date)} –{" "}
              {exp.end_date ? formatDate(exp.end_date) : "Present"}
            </Text>
            <Text>{exp.description}</Text>
          </View>
        ))}
      </View>
    )}

    {/* Education */}
    {resumeData.education?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>

        {resumeData.education.map((edu, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 10 }}>
            <Text style={styles.jobTitle}>
              {edu.degree} in {edu.field_of_study}
            </Text>
            <Text style={styles.meta}>
              {edu.school} | {formatDate(edu.start_date)} –{" "}
              {formatDate(edu.graduation_date)}
            </Text>
          </View>
        ))}
      </View>
    )}

    {/* Skills */}
    {resumeData.skills?.length > 0 && (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skillText}>
          {resumeData.skills.map((s) => s.name).join(" • ")}
        </Text>
      </View>
    )}

    {/* Projects */}
    {resumeData.projects?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>

        {resumeData.projects.map((project, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 12 }}>
            <Text style={styles.jobTitle}>{project.title}</Text>

            {project.link && (
              <Link src={project.link}>
                <Text style={styles.link}>View Project</Text>
              </Link>
            )}

            <Text>{project.description}</Text>

            {project.technologies && (
              <Text style={styles.projectTech}>
                Technologies: {project.technologies}
              </Text>
            )}
          </View>
        ))}
      </View>
    )}
  </View>
);

export default Template2PDF;
