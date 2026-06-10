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
            value={portfolioData.fullName}
            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
            label="Full Name"
            name="fullName"
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
            value={portfolioData.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            name="email"
          />
        </div>
        <div>
          <Input
            label="LinkedIn URL"
            type="url"
            value={portfolioData.linkedlnUrl}
            onChange={(e) => updatePersonalInfo("linkedlnUrl", e.target.value)}
            name="linkedlnUrl"
          />
        </div>
        <div>
          <Input
            label="GitHub URL"
            type="url"
            value={portfolioData.githubUrl}
            onChange={(e) => updatePersonalInfo("githubUrl", e.target.value)}
            name="githubUrl"
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
          label="Summary"
          value={portfolioData.description}
          onChange={(e) => updatePersonalInfo("description", e.target.value)}
          name="description"
          rows={4}
          placeholder="A brief summary of your professional background..."
        />
      </div>
      <div>
        <Input
          label="Theme Color"
          type="color"
          value={portfolioData.colorTheme}
          onChange={(e) => updatePersonalInfo("colorTheme", e.target.value)}
          name="colorTheme"
        />
      </div>
    </div>
  );
};

export default PortfolioPersonalInfo;
