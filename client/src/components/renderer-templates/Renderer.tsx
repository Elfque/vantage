import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import BottomTemplatePDF from "./BottomTemplate";
import { ResumeDataResponse } from "@/types/resume";
import Template1PDF from "./Template1";
import Template2PDF from "./Template2";
import Template3PDF from "./Template3";
import Template4PDF from "./Template4";

type RendererProps = {
  resumeData: ResumeDataResponse;
  template: number;
};

const Renderer = ({ resumeData, template }: RendererProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      lineHeight: 1.5,
      fontFamily: "Helvetica",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {template === 1 && <Template1PDF resumeData={resumeData} />}
        {template === 2 && <Template2PDF resumeData={resumeData} />}
        {template === 3 && <Template3PDF resumeData={resumeData} />}
        {template === 4 && <Template4PDF resumeData={resumeData} />}
        <BottomTemplatePDF resumeData={resumeData} />
      </Page>
    </Document>
  );
};

export default Renderer;
