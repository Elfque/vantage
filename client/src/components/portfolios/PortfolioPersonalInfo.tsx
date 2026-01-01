import { PortfolioPersonalData } from "@/types/portfolio";
import Input from "../Input";
import Textarea from "../Textarea";

type PortfolioPersonalInfoProps = {
  portfolioData: PortfolioPersonalData;
  updatePersonalInfo: (field: string, value: string) => void;
};

const PortfolioPersonalInfo = ({
  portfolioData,
  updatePersonalInfo,
}: PortfolioPersonalInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            value={portfolioData.full_name}
            onChange={(e) => updatePersonalInfo("full_name", e.target.value)}
            label="Full Name"
            name="full_name"
          />
        </div>
        <div>
          <Input
            label="Title"
            type="text"
            value={portfolioData.title}
            onChange={(e) => updatePersonalInfo("title", e.target.value)}
            name="title"
          />
        </div>
        <div>
          <Input
            label="Email"
            type="email"
            value={portfolioData.contact_email}
            onChange={(e) =>
              updatePersonalInfo("contact_email", e.target.value)
            }
            name="contact_email"
          />
        </div>
        <div>
          <Input
            label="LinkedIn URL"
            type="url"
            value={portfolioData.linkedin_url}
            onChange={(e) => updatePersonalInfo("linkedin_url", e.target.value)}
            name="linkedin_url"
          />
        </div>
        <div>
          <Input
            label="GitHub URL"
            type="url"
            value={portfolioData.github_url}
            onChange={(e) => updatePersonalInfo("github_url", e.target.value)}
            name="github_url"
          />
        </div>
        <div>
          <Input
            label="Slug"
            type="text"
            value={portfolioData.slug}
            onChange={(e) => updatePersonalInfo("slug", e.target.value)}
            name="slug"
            placeholder="your-portfolio-slug"
          />
        </div>
      </div>
      <div>
        <Textarea
          label="Bio"
          value={portfolioData.bio}
          onChange={(e) => updatePersonalInfo("bio", e.target.value)}
          name="bio"
          rows={3}
          placeholder="Tell us about yourself..."
        />
      </div>
      <div>
        <Textarea
          label="Summary"
          value={portfolioData.summary}
          onChange={(e) => updatePersonalInfo("summary", e.target.value)}
          name="summary"
          rows={4}
          placeholder="A brief summary of your professional background..."
        />
      </div>
      <div>
        <Input
          label="Theme Color"
          type="color"
          value={portfolioData.theme_color}
          onChange={(e) => updatePersonalInfo("theme_color", e.target.value)}
          name="theme_color"
        />
      </div>
    </div>
  );
};

export default PortfolioPersonalInfo;
