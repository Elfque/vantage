import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { ResumeDataResponse } from "@/types/resume";
import { formatDate } from "@/utils/functions";

const styles = StyleSheet.create({
  sidebar: {
    width: "33%",
    backgroundColor: "#F3E8FF",
    padding: 20,
  },

  main: {
    width: "67%",
    padding: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B21A8",
    marginBottom: 12,
  },

  contactItem: {
    marginBottom: 4,
    color: "#6B21A8",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },

  skillItem: {
    marginBottom: 4,
  },

  itemTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },

  company: {
    color: "#6B21A8",
    marginBottom: 2,
  },

  date: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },

  paragraph: {
    lineHeight: 1.5,
    marginBottom: 8,
  },

  link: {
    color: "#2563EB",
    textDecoration: "underline",
    marginBottom: 4,
  },
});

const Template4PDF = ({ resumeData }: { resumeData: ResumeDataResponse }) => {
  return (
    <View>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.name}>{resumeData.full_name}</Text>

        {resumeData.location && (
          <Text style={styles.contactItem}>📍 {resumeData.location}</Text>
        )}
        {resumeData.phone && (
          <Text style={styles.contactItem}>📞 {resumeData.phone}</Text>
        )}
        {resumeData.contact_email && (
          <Text style={styles.contactItem}>✉ {resumeData.contact_email}</Text>
        )}
        {resumeData.linkedin_url && (
          <Link style={styles.link} src={resumeData.linkedin_url}>
            LinkedIn
          </Link>
        )}
        {resumeData.website_url && (
          <Link style={styles.link} src={resumeData.website_url}>
            Website
          </Link>
        )}

        {resumeData.skills?.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {resumeData.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillItem}>
                • {skill.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {resumeData.summary && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{resumeData.summary}</Text>
          </View>
        )}

        {resumeData.experience?.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resumeData.experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.date}>
                  {formatDate(exp.start_date)} –{" "}
                  {exp.end_date ? formatDate(exp.end_date) : "Present"}
                </Text>
                <Text style={styles.paragraph}>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {resumeData.education?.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resumeData.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>
                  {edu.degree} in {edu.field_of_study}
                </Text>
                <Text style={styles.date}>
                  {edu.school} • {formatDate(edu.start_date)} –{" "}
                  {formatDate(edu.graduation_date)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {resumeData.projects?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resumeData.projects.map((project, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.itemTitle}>{project.title}</Text>
                {project.link && (
                  <Link style={styles.link} src={project.link}>
                    View Project
                  </Link>
                )}
                <Text style={styles.paragraph}>{project.description}</Text>
                {project.technologies && (
                  <Text style={{ fontSize: 10 }}>
                    Technologies: {project.technologies}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Template4PDF;
