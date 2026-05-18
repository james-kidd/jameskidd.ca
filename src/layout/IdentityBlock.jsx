import SocialIcon from "../components/SocialIcon";
import { heroData } from "../data";

export default function IdentityBlock() {
  return (
    <div className="pt-12 border-t border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
        {heroData.name}
      </h1>

      <p className="text-sm font-medium text-gray-400 mb-6">
        {heroData.title}
      </p>

      <div className="flex items-center gap-5 mb-4">
        <SocialIcon type="github" url={heroData.socials?.github} />
        <SocialIcon type="linkedin" url={heroData.socials?.linkedin} />
        <SocialIcon type="instagram" url={heroData.socials?.instagram} />
      </div>
    </div>
  );
}
