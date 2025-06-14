import { type Document, type Model } from "mongoose";
export interface ICampaign extends Document {
    name: string;
    description: string;
    status: "ACTIVE" | "INACTIVE" | "DELETED";
    leads: string[];
    accountIDs: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCampaignData {
    name: string;
    description: string;
    leads: string[];
    accountIDs: string[];
}
export interface UpdateCampaignData extends Partial<CreateCampaignData> {
    status?: "ACTIVE" | "INACTIVE";
}
declare const Campaign: Model<ICampaign>;
export default Campaign;
//# sourceMappingURL=Campaign.d.ts.map