import mongoose, { type Document } from "mongoose";
export interface IProfile extends Document {
    name: string;
    jobTitle: string;
    company: string;
    location: string;
    profileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
//# sourceMappingURL=Profile.d.ts.map