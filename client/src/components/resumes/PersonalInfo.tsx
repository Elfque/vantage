import { ResumeData } from "@/types/resume";
import Input from "../Input";

type PersonalInfoProps = {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
};

const PersonalInfo = ({
  resumeData,
  updatePersonalInfo,
}: PersonalInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            value={resumeData.full_name}
            onChange={(e) => updatePersonalInfo("full_name", e.target.value)}
            label="Full Name"
            name="full_name"
          />
        </div>
        <div>
          <Input
            label="Email"
            type="email"
            value={resumeData.contact_email}
            onChange={(e) =>
              updatePersonalInfo("contact_email", e.target.value)
            }
            name="contact_email"
          />
        </div>
        <div>
          <Input
            label="Phone"
            type="tel"
            value={resumeData.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            name="phone"
          />
        </div>
        <div>
          <Input
            label="Location"
            value={resumeData.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
            name="location"
          />
        </div>
        <div>
          <Input
            label="LinkedIn"
            type="url"
            value={resumeData.linkedin_url}
            onChange={(e) => updatePersonalInfo("linkedin_url", e.target.value)}
            name="linkedin_url"
          />
        </div>
        <div>
          <Input
            label="Website"
            type="url"
            value={resumeData.website_url}
            onChange={(e) => updatePersonalInfo("website_url", e.target.value)}
            name="website_url"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
