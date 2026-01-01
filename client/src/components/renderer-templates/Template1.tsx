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
  page: {
    padding: 40,
    fontSize: 11,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 10,
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    borderBottom: "1 solid #000",
    paddingBottom: 4,
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 600,
  },
  company: {
    fontSize: 11,
    fontWeight: 500,
  },
  date: {
    fontSize: 10,
    marginBottom: 4,
  },
  link: {
    color: "#2563eb",
    textDecoration: "underline",
  },
  skillText: {
    fontSize: 11,
  },
});

const Template1PDF = ({ resumeData }: { resumeData: ResumeDataResponse }) => (
  <View>
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

    {resumeData.summary && (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text>{resumeData.summary}</Text>
      </View>
    )}

    {resumeData.experience?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Experience</Text>

        {resumeData.experience.map((exp, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 12 }}>
            <Text style={styles.jobTitle}>{exp.position}</Text>
            <Text style={styles.company}>{exp.company}</Text>
            <Text style={styles.date}>
              {formatDate(exp.start_date)} –{" "}
              {exp.end_date ? formatDate(exp.end_date) : "Present"}
            </Text>
            <Text>{exp.description}</Text>
          </View>
        ))}
      </View>
    )}

    {resumeData.education?.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>

        {resumeData.education.map((edu, index) => (
          <View key={index} wrap={false} style={{ marginBottom: 10 }}>
            <Text style={styles.jobTitle}>
              {edu.degree} in {edu.field_of_study}
            </Text>
            <Text>{edu.school}</Text>
            <Text style={styles.date}>
              {formatDate(edu.start_date)} – {formatDate(edu.graduation_date)}
            </Text>
          </View>
        ))}
      </View>
    )}

    {resumeData.skills?.length > 0 && (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.skillText}>
          {resumeData.skills.map((s) => s.name).join(", ")}
        </Text>
      </View>
    )}

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
              <Text style={{ fontSize: 10 }}>
                <Text style={{ fontWeight: 600 }}>Technologies: </Text>
                {project.technologies}
              </Text>
            )}
          </View>
        ))}
      </View>
    )}
  </View>
);

export default Template1PDF;
