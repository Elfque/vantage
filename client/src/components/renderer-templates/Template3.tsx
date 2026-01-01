import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    marginBottom: 30,
  },

  name: {
    fontSize: 26,
    fontWeight: 300,
    marginBottom: 10,
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 10,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 300,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  itemTitle: {
    fontSize: 11,
    fontWeight: 400,
    marginBottom: 2,
  },

  meta: {
    fontSize: 10,

    marginBottom: 4,
  },

  link: {
    fontSize: 10,
    textDecoration: "underline",
  },

  tech: {
    fontSize: 10,
  },
});

const Template3PDF = ({ resumeData }: { resumeData: ResumeDataResponse }) => (
  <View>
    {/* Header */}
    <View style={styles.header} wrap={false}>
      <Text style={styles.name}>{resumeData.full_name}</Text>

      <View style={styles.contactRow}>
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
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text>{resumeData.summary}</Text>
      </View>
    )}

    {/* Experience */}
    {resumeData.experience?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>

        {resumeData.experience.map((exp, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 14 }}>
            <Text style={styles.itemTitle}>{exp.position}</Text>
            <Text style={styles.meta}>
              {exp.company} • {formatDate(exp.start_date)} –{" "}
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
          <View key={index} wrap={false} style={{ marginBottom: 12 }}>
            <Text style={styles.itemTitle}>
              {edu.degree} in {edu.field_of_study}
            </Text>
            <Text style={styles.meta}>
              {edu.school} • {formatDate(edu.start_date)} –{" "}
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
        <Text>{resumeData.skills.map((skill) => skill.name).join(", ")}</Text>
      </View>
    )}

    {/* Projects */}
    {resumeData.projects?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>

        {resumeData.projects.map((project, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 14 }}>
            <Text style={styles.itemTitle}>{project.title}</Text>

            {project.link && (
              <Link src={project.link}>
                <Text style={styles.link}>Link</Text>
              </Link>
            )}

            <Text>{project.description}</Text>

            {project.technologies && (
              <Text style={styles.tech}>{project.technologies}</Text>
            )}
          </View>
        ))}
      </View>
    )}
  </View>
);

export default Template3PDF;
