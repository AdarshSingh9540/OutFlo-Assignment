import { type Document, type Model } from "mongoose";
export interface ILinkedInProfile extends Document {
    fullName: string;
    jobTitle: string;
    company: string;
    location: string;
    profileUrl: string;
    summary?: string;
    imageUrl?: string;
    connectionDegree?: string;
    industry?: string;
    scrapedAt: Date;
    isActive: boolean;
}
declare const LinkedInProfile: Model<ILinkedInProfile>;
export default LinkedInProfile;
//# sourceMappingURL=LinkedInProfile.d.ts.map